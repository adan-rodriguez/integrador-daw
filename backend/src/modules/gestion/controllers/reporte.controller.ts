import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/modules/auth/guards/auth.guard";
import { ReporteDTO } from "../dtos/output/reporte.dto";
import { ReportesService } from "../services/reportes.service";
import { ReporteClienteDTO } from "../dtos/output/repote-cliente.dto";
import { ReporteProyectoDTO } from "../dtos/output/reporte-proyecto.dto";
import { ReporteTareaDTO } from "../dtos/output/reporte-tarea.dto";

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('reportes')
export class ReporteController {
  constructor(private readonly reportesService: ReportesService) {}

  
  @ApiOperation({ summary: 'Obtener el reporte estadístico global' })
  @ApiResponse({ status: 200, type: ReporteDTO })
  @Get('reporte')
  async generarReporte(): Promise<ReporteDTO> {
    return await this.reportesService.generarReporte();
  }

  @ApiOkResponse({ type: ReporteClienteDTO, isArray: true})
  @Get('reproteClientes')
  async reporteClietes(){
    return this.reportesService.reporteClietes();

  }

  @ApiOkResponse({type: ReporteProyectoDTO, isArray: true})
  @Get('reporteProyectos')
  async repoteProyectos(){
    return this.reportesService.repoteProyectos()
  }

  @ApiOkResponse({type: ReporteTareaDTO, isArray: false})
  @Get('reporteTareas')
  async reporteTarea(){
    return this.reportesService.reporteTareas()
  }

}