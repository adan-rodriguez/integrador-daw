import { ApiProperty } from '@nestjs/swagger';
import { EstadosClientesEnum } from '../../enums/estados-clientes.enum';

export class ListClienteDTO {
  @ApiProperty({ example: '1' })
  id!: number;

  @ApiProperty({ example: 'Juan' })
  nombre!: string;

  @ApiProperty({
    enum: EstadosClientesEnum,
    example: EstadosClientesEnum.ACTIVO,
  })
  estado!: EstadosClientesEnum;
}
