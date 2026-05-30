import { ListClienteDTO } from '../clientes/listado/list-cliente-dto';
import { EstadosProyectosEnum } from '../estados-proyectos-enum';

export interface ListProyectoDTO {
  id: number;
  nombre: string;
  estado: EstadosProyectosEnum;
  cliente?: ListClienteDTO;
}
