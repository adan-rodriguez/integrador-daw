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

@ApiBearerAuth()
@UseGuards(AuthGuard)
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

  @Post()
  async crearCliente(@Body() dto: CreateClienteDto): Promise<{ id: number }> {
    return await this.clientesService.crearCliente(dto);
  }

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
  async obtenerClientes(
    @Query('estado') estado: EstadosClientesEnum,
  ): Promise<ListClienteDTO[]> {
    return await this.clientesService.obtenerClientes(estado);
  }
}
