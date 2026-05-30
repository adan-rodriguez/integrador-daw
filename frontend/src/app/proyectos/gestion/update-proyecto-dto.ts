import { EstadosProyectosEnum } from '../estados-proyectos-enum';
import { CreateProyectoDTO } from './create-proyecto-dto';

export interface UpdateProyectoDto extends Partial<CreateProyectoDTO> {
  estado?: EstadosProyectosEnum | null;
}
