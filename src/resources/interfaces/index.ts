export interface ResourceWithRelations {
  proyect: {
    id: string;
  };
  user: { id: string };
  id: string;
  status: string;
}

export interface ResourceWithRelationsPlain {
  proyect: string;
  user: string;
  id: string;
  toState: string;
}
