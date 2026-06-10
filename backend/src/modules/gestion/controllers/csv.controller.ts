import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guards/auth.guard";
import { CsvService } from "../services/csv.service";
import { type Response } from 'express';
@ApiTags('csv')
@Controller('csv')
export class CsvController {
    constructor(private readonly csvService: CsvService) { }

    @ApiCreatedResponse({
        description: 'Genera un archivo CSV con el listado completo de proyectos',
    })
    @Get('proyectos')
    async exportarProyectos(@Res() res: Response) {
        const csv = await this.csvService.generarCsvProyecto();
        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.attachment('reporte-proyectos.csv');
        return res.send(csv);
    }
    
    @ApiCreatedResponse({
        description: 'Genera un archivo CSV con el listado completo de tareas',
    })
    @Get('tareas')
    async exportarTareas(@Res() res: Response) {
        const csv = await this.csvService.generarCsvTarea();
        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.attachment('reporte-tareas.csv');
        return res.send(csv);
    }

    @ApiCreatedResponse({
        description: 'Genera un archivo CSV con el listado completo de clientes',
    })
    @Get('clientes')
    async exportarClientes(@Res() res: Response) {
        const csv = await this.csvService.generarCsvCliente();
        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.attachment('reporte-clientes.csv');
        return res.send(csv);
    }
}
