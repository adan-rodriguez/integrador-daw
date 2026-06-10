import { ApiProperty } from '@nestjs/swagger';
import { ListTareaDTO } from './list-tarea.dto'; 
import { EstadosProyectosEnum } from '../../enums/estados-proyectos.enum';



export class ProyectoReporteDTO {
  @ApiProperty({ example: 1, description: 'ID del proyecto' })
  id!: number;

  @ApiProperty({ example: 'Sistema de Gestión Escolar' })
  nombre!: string;

  @ApiProperty({
    enum: EstadosProyectosEnum,
    example: EstadosProyectosEnum.ACTIVO,
    description: 'Estado actual del proyecto usando el enum real',
  })
  estado!: EstadosProyectosEnum;

  @ApiProperty({ example: '3 - Coca Cola S.A.', description: 'Formato id - nombre del cliente' })
  cliente!: string;

  @ApiProperty({ type: [ListTareaDTO], description: 'Lista de tareas pendientes asociadas a este proyecto' })
  tareas_pendiente!: ListTareaDTO[];

  @ApiProperty({ type: [ListTareaDTO], description: 'Lista de tareas finalizadas asociadas a este proyecto' })
  tareas_finalizada!: ListTareaDTO[];

  @ApiProperty({ type: [ListTareaDTO], description: 'Lista de tareas de baja asociadas a este proyecto' })
  tareas_baja!: ListTareaDTO[];
}
