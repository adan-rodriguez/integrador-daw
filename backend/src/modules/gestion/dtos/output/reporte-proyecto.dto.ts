import { ApiProperty } from '@nestjs/swagger';

export class ReporteProyectoDTO {
    @ApiProperty({ example: 1 })
    id_proyecto!: number;

    @ApiProperty({ example: 'Desarrollo de Módulo de Inventario' })
    nombre_proyecto!: string;

    @ApiProperty({ example: 4, description: 'Cantidad de tareas pendientes que tiene este proyecto' })
    tareas_pendientes!: number;
}