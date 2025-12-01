export interface CrolProyectResponse {
  data: ProyectData | null;
  resultado: boolean;
  error: ErrorData;
}

export interface DivisionPadre {
  divisionId: number;
  divisionNombre: string;
  divisionActiva: boolean;
}

export interface ProyectData {
  divisionId: number;
  divisionCodigo: string;
  divisionNombre: string;
  divisionExentoIVA: boolean;
  centroCostoIdDefault: number;
  centroCostoNombre: string;
  divisionIdDefault: boolean;
  divisionActiva: boolean;
  divisionPadre: DivisionPadre[];
  controlActivosFijos: boolean;
  usuarioIdUpdate: number;
  mensaje: string;
}

export interface ErrorData {
  error: {
    ClassName: string;
    Message: string;
    Data: any;
    InnerException: null;
    HelpURL: null;
    StackTraceString: string;
    RemoteStackTraceString: null;
    RemoteStackIndex: number;
    ExceptionMethod: null;
    HResult: number;
    Source: string;
    WatsonBuckets: null;
    Errors: null;
    ClientConnectionId: string;
  };
  errorMensaje: string;
  errorCodigo: number;
}
