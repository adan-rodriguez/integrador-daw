import { Module } from '@nestjs/common';
import { ProyectosController } from './controllers/proyectos.controller';
import { ProyectosService } from './services/proyectos.service';
import { AuthModule } from '../auth/auth.module';
import { ClientesController } from './controllers/clientes.controller';
import { TareasController } from './controllers/tareas.controller';
import { ClientesService } from './services/clientes.service';
import { TareasService } from './services/tarea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarea } from './entities/tarea.entity';
import { Cliente } from './entities/cliente.entity';
import { Proyecto } from './entities/proyecto.entity';
import { CsvController } from './controllers/csv.controller';
import { CsvService } from './services/csv.service';
import { ReportesService } from './services/reportes.service';
import { ReporteController } from './controllers/reporte.controller';

@Module({
  controllers: [ProyectosController, ClientesController, TareasController, CsvController, ReporteController],
  providers: [ProyectosService, ClientesService, TareasService, CsvService, ReportesService],
  imports: [TypeOrmModule.forFeature([Tarea, Cliente, Proyecto]), AuthModule],
})

export class GestionModule {}

