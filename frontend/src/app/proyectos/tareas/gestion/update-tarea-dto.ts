import { EstadosTareasEnum } from '../estados-tareas-enum';
import { CreateTareaDTO } from './create-tarea-dto';

export interface UpdateTareaDto extends Partial<CreateTareaDTO> {
  estado?: EstadosTareasEnum | null;
}
