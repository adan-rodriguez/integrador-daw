import { ApiProperty } from "@nestjs/swagger";
import { ProyectoReporteDTO } from "./proyectos-reporte.dto";

export class ReporteDTO {
    @ApiProperty({ example: 10, description: 'Cantidad total de proyectos' })
    total_proyectos!: number;

    @ApiProperty({ example: 7, description: 'Cantidad total de proyectos activos' })
    proyectos_activos!: number;

    @ApiProperty({ example: 3, description: 'Cantidad total de proyectos finalizados' })
    proyectos_finalizados!: number;

    @ApiProperty({ example: 0, description: 'Cantidad total de proyectos de baja' })
    proyectos_baja!: number;

    @ApiProperty({ type: [ProyectoReporteDTO], description: 'Lista de proyectos activos' })
    lista_proyectos_activos!: ProyectoReporteDTO[];

    @ApiProperty({ type: [ProyectoReporteDTO], description: 'Lista de proyectos finalizados' })
    lista_proyectos_finalizados!: ProyectoReporteDTO[];

    @ApiProperty({ type: [ProyectoReporteDTO], description: 'Lista de proyectos de baja' })
    lista_proyectos_baja!: ProyectoReporteDTO[];

    @ApiProperty({ example: '2026-06-07T20:30:00.000Z', description: 'Fecha de generación' })
    fecha_generacion!: Date;
}