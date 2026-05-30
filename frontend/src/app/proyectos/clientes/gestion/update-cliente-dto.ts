import { EstadosClientesEnum } from '../estados-clientes-enum';
import { CreateClienteDTO } from './create-cliente-dto';

export interface UpdateClienteDto extends Partial<CreateClienteDTO> {
  estado?: EstadosClientesEnum | null;
}
