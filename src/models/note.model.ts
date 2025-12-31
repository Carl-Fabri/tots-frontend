export interface Note {
  id?: number;
  titulo: string;
  contenido: string;
  fijada?: boolean;
  categoria?: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  color?: string; // Nuevo campo para el color de la nota
}
