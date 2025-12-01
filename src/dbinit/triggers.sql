-- Elimina el trigger si ya existe
DROP TRIGGER IF EXISTS after_resource_change ON resource;
DROP TRIGGER IF EXISTS increment_resource_counter_trigger ON resource_counter;

-- Elimina las funciones si ya existen
DROP FUNCTION IF EXISTS trigger_update_estimated_price() CASCADE;
DROP FUNCTION IF EXISTS update_estimated_price(UUID) CASCADE;
DROP FUNCTION IF EXISTS increment_resource_counter() CASCADE;

-- Función principal para actualizar el precio estimado
CREATE OR REPLACE FUNCTION update_estimated_price(proyect_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE proyects
  SET estimated_price = (
    SELECT COALESCE(SUM(
      CASE 
        WHEN coin = 'USD' THEN estimated_price * quantity * 19.53
        ELSE estimated_price * quantity
      END
    ), 0)
    FROM resource
    WHERE "proyectId" = proyect_id
  )
  WHERE id = proyect_id;
END;
$$ LANGUAGE plpgsql;

-- Función trigger que invoca la anterior según la operación
CREATE OR REPLACE FUNCTION trigger_update_estimated_price()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    PERFORM update_estimated_price(OLD."proyectId");
  ELSE
    PERFORM update_estimated_price(NEW."proyectId");
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_resource_counter()
RETURNS TRIGGER AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  -- Intentar actualizar la fila con id = 1
  UPDATE resource_counter
  SET total = total + 1
  WHERE id = 1;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;

  -- Si no se actualizó ninguna fila, insertar una nueva
  IF updated_rows = 0 THEN
    INSERT INTO resource_counter (id, total)
    VALUES (1, 1);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que ejecuta la función después de cambios en resource
CREATE TRIGGER after_resource_change
AFTER INSERT OR UPDATE OR DELETE ON resource
FOR EACH ROW
EXECUTE FUNCTION trigger_update_estimated_price();

CREATE TRIGGER increment_resource_counter_trigger
AFTER INSERT ON resource
FOR EACH ROW
EXECUTE FUNCTION increment_resource_counter();



-- TRIGGERS PARA EL CONTADOR DE CROL_ID


--Define que el siguiente id de los proyectos sea 600 
-- DO $$
-- DECLARE
--   current_value bigint;
-- BEGIN
--   SELECT last_value INTO current_value FROM proyects_id_seq;

--   -- Si el valor actual es menor a 599, reiniciar la secuencia en 600
--   IF current_value < 599 THEN
--     RAISE NOTICE 'Reiniciando secuencia proyects_id_seq a 600 (valor actual: %)', current_value;
--     ALTER SEQUENCE proyects_id_seq RESTART WITH 600;
--   ELSE
--     RAISE NOTICE 'Secuencia proyects_id_seq ya está en % (mayor o igual a 599), no se modifica.', current_value;
--   END IF;
-- END;
-- $$;
