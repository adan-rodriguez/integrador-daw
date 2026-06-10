import { ApiProperty } from '@nestjs/swagger';

export class ReporteTareaDTO {
    @ApiProperty({ example: 120, description: 'Cantidad total de tareas registradas en el sistema' })
    total_tareas!: number;

    @ApiProperty({ example: 45, description: 'Cantidad de tareas que actualmente están pendientes' })
    tareas_pendientes!: number;
}