import { ApiProperty } from '@nestjs/swagger';

export class ReporteClienteDTO {
    @ApiProperty({example: 1})
    id_cliente!: number

    @ApiProperty({ example: 'Coca Cola S.A.' })
    nombre_cliente!: string;

    @ApiProperty({ example: 3, description: 'Cantidad de proyectos activos de este cliente' })
    proyectos_activos!: number;
}