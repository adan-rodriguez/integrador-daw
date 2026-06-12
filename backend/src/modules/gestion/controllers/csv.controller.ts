import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guards/auth.guard";
import { CsvService } from "../services/csv.service";
import { type Response } from 'express';
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decoradors/roles.decorador";
import { RolUsuarioEnum } from "src/modules/auth/enums/roles-usuarios.enum";

@ApiTags('csv')
@UseGuards(AuthGuard, RolesGuard)
@Controller('csv')
export class CsvController {
    constructor(private readonly csvService: CsvService) { }

    @ApiCreatedResponse({
        description: 'Genera un archivo CSV con el listado completo de proyectos',
    })
    @Roles(RolUsuarioEnum.ADMIN,RolUsuarioEnum.SUPERVISOR)
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
    @Roles(RolUsuarioEnum.ADMIN,RolUsuarioEnum.SUPERVISOR)
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
    @Roles(RolUsuarioEnum.ADMIN,RolUsuarioEnum.SUPERVISOR)
    @Get('clientes')
    async exportarClientes(@Res() res: Response) {
        const csv = await this.csvService.generarCsvCliente();
        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.attachment('reporte-clientes.csv');
        return res.send(csv);
    }
}
