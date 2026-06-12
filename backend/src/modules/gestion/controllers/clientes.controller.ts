import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateClienteDto } from '../dtos/input/create-cliente.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ListClienteDTO } from '../dtos/output/list-cliente.dto';
import { UpdateClienteDto } from '../dtos/input/update-cliente.dto';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import { ClientesService } from '../services/clientes.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decoradors/roles.decorador';
import { RolUsuarioEnum } from 'src/modules/auth/enums/roles-usuarios.enum';


@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          example: 1,
        },
      },
    },
  })
  @Roles(RolUsuarioEnum.ADMIN,RolUsuarioEnum.SUPERVISOR)
  @Post()
  async crearCliente(@Body() dto: CreateClienteDto): Promise<{ id: number }> {
    return await this.clientesService.crearCliente(dto);
  }

  @Roles(RolUsuarioEnum.ADMIN,RolUsuarioEnum.SUPERVISOR)
  @Put(':id')
  async actualizarCliente(
    @Param('id') id: number,
    @Body() dto: UpdateClienteDto,
  ): Promise<void> {
    await this.clientesService.actualizarCliente(id, dto);
  }

  @ApiOkResponse({ type: ListClienteDTO, isArray: true })
  @ApiQuery({
    name: 'estado',
    required: false,
    enum: EstadosClientesEnum,
  })
  @Get()
  // Culquier ROL puede consultar clientes, pero solo se muestran los activos por defecto
  async obtenerClientes(
    @Query('estado') estado: EstadosClientesEnum,
  ): Promise<ListClienteDTO[]> {
    return await this.clientesService.obtenerClientes(estado);
  }
}
