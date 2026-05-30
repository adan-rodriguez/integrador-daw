import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UpdateTareaDto } from '../dtos/input/update-tarea.dto';
import { CreateTareaDto } from '../dtos/input/create-tarea.dto';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { TareasService } from '../services/tarea.service';
import { AuthGuard } from '../../auth/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('proyectos/:idProyecto/tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

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
  async crearTarea(
    @Body() dto: CreateTareaDto,
    @Param('idProyecto') idProyecto: number,
  ): Promise<{ id: number }> {
    return await this.tareasService.crearTarea(dto, idProyecto);
  }

  @Put(':id')
  async actualizarTarea(
    @Body() dto: UpdateTareaDto,
    @Param('id') id: number,
  ): Promise<void> {
    await this.tareasService.actualizarTarea(dto, id);
  }
}
