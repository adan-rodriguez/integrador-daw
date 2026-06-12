import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProyectosService } from '../services/proyectos.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { ListProyectoDTO } from '../dtos/output/list-proyecto.dto';
import { CreateProyectoDto } from '../dtos/input/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/input/update-proyecto.dto';
import { ProyectoDTO } from '../dtos/output/proyecto.dto';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decoradors/roles.decorador';
import { RolUsuarioEnum } from 'src/modules/auth/enums/roles-usuarios.enum';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard) // <---protegiendo con rol
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

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
  @Roles(RolUsuarioEnum.ADMIN) // <---solo admin puede crear proyectos
  @Post()
  async crearProyecto(@Body() dto: CreateProyectoDto): Promise<{ id: number }> {
    return await this.proyectosService.crearProyecto(dto);
  }

  
  @Put(':id')
  @Roles(RolUsuarioEnum.ADMIN,RolUsuarioEnum.SUPERVISOR) 
  async actualizarProyecto(
    @Body() dto: UpdateProyectoDto,
    @Param('id') id: number,
  ): Promise<void> {
    await this.proyectosService.actualizarProyecto(id, dto);
  }

  @ApiOkResponse({ type: ListProyectoDTO, isArray: true })
  @Get()
  // Cualquier rol puede consultar proyectos, pero solo se muestran los activos por defecto
  async obtenerProyectos(): Promise<ListProyectoDTO[]> {
    return await this.proyectosService.obtenerProyectos();
  }

  @ApiOkResponse({ type: ProyectoDTO })
  @Get(':id')
  // Cualquier rol puede consultar un proyecto por ID, pero solo si está activo
  async obtenerProyecto(@Param('id') id: number): Promise<ProyectoDTO> {
    return await this.proyectosService.obtenerProyecto(id);
  }
}
