import { EstadosClientesEnum } from '../estados-clientes-enum';

export interface ListClienteDTO {
  id: number;
  nombre: string;
  estado: EstadosClientesEnum;
}
