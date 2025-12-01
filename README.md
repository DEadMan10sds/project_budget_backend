<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Descripción

El sistema se encarga de conectarse con la aplicación "CROL" para el manejo de las finanzas y optimización de procesos internos para la compra y manejo de materiales y proyectos.

Cuenta con dockerización para la fácil ejecución del sistema tanto en desarrollo como pruebas y producción. Usando archivos distintos para cada entorno.

## Tecnologías

- Nestjs
- Postgres
- Docker

## Ejecución en local o desarrollo

Para la ejecución en local o desarrollo, se ejecuta el siguiente comando, lo cual levantará el servidor backend y la base de datos postgress según las variables de entorno:

```bash
$ docker compose up -d --build | npm run start:dev
```

En caso de que ya se cuente con una base de datos postgress, solo se tendra que ejecutar el siguiente comando:

```
$ npm run start:dev
```

## Ejecución en testing

Para la ejecución en testing

```
$ docker compose --file docker-compose.test.yaml up -d --build
```
