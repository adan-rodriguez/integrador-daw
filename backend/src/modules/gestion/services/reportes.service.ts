import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Proyecto } from "../entities/proyecto.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Cliente } from "../entities/cliente.entity";
import { Tarea } from "../entities/tarea.entity";
import { ReporteDTO } from "../dtos/output/reporte.dto";
import { EstadosProyectosEnum } from "../enums/estados-proyectos.enum";
import { EstadosTareasEnum } from "../enums/estados-tareas.enum";
import { ReporteClienteDTO } from "../dtos/output/repote-cliente.dto";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { ReporteProyectoDTO } from "../dtos/output/reporte-proyecto.dto";
import { ReporteTareaDTO } from "../dtos/output/reporte-tarea.dto";

@Injectable()
export class ReportesService {
    constructor(
        @InjectRepository(Proyecto)
        private readonly repositoryProyecto: Repository<Proyecto>,
        @InjectRepository(Cliente)
        private readonly repositoryCliente: Repository<Cliente>,
        @InjectRepository(Tarea)
        private readonly repositoryTarea: Repository<Tarea>,
    ) { }

    /**
     * @description
     * NOTE: Esta función genera un reporte de toda la base de datos.
     * se abandono por mejores funcionalidades.
     * se deberia eliminar o modificar su funcionalidad para que sea mas especifica y no tan general como lo es actualmente.
     * @returns 
     */
    
    async generarReporte(): Promise<ReporteDTO> {
        const reporte = new ReporteDTO();

        try {
            reporte.fecha_generacion = new Date();

            reporte.proyectos_activos = await this.repositoryProyecto.count({ where: { estado: EstadosProyectosEnum.ACTIVO } });
            reporte.proyectos_finalizados = await this.repositoryProyecto.count({ where: { estado: EstadosProyectosEnum.FINALIZADO } });
            reporte.proyectos_baja = await this.repositoryProyecto.count({ where: { estado: EstadosProyectosEnum.BAJA } });

            reporte.total_proyectos = reporte.proyectos_activos + reporte.proyectos_finalizados + reporte.proyectos_baja;

            const proyectosActivos = await this.repositoryProyecto.find({ where: { estado: EstadosProyectosEnum.ACTIVO }, relations: ['cliente', 'tareas'] });
            const proyectosFinalizados = await this.repositoryProyecto.find({ where: { estado: EstadosProyectosEnum.FINALIZADO }, relations: ['cliente', 'tareas'] });
            const proyectosBaja = await this.repositoryProyecto.find({ where: { estado: EstadosProyectosEnum.BAJA }, relations: ['cliente', 'tareas'] });

            reporte.lista_proyectos_activos = proyectosActivos.map(proyecto => ({
                id: proyecto.id,
                nombre: proyecto.nombre,
                estado: proyecto.estado,
                cliente: proyecto.cliente ? `${proyecto.cliente.id} - ${proyecto.cliente.nombre}` : 'Sin Cliente',
                // TAREAS PENDIENTES, FINALIZADAS Y DE BAJA SE FILTRAN Y MAPEAN POR SEPARADO PARA CADA PROYECTO----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                tareas_pendiente: (proyecto.tareas || []).filter(tarea => tarea.estado === EstadosTareasEnum.PENDIENTE).map(tarea => ({
                    id: tarea.id,
                    descripcion: tarea.descripcion,
                    estado: tarea.estado
                })),
                tareas_finalizada: (proyecto.tareas || []).filter(tarea => tarea.estado === EstadosTareasEnum.FINALIZADA).map(tarea => ({
                    id: tarea.id,
                    descripcion: tarea.descripcion,
                    estado: tarea.estado
                })),
                tareas_baja: (proyecto.tareas || []).filter(tarea => tarea.estado === EstadosTareasEnum.BAJA).map(tarea => ({
                    id: tarea.id,
                    descripcion: tarea.descripcion,
                    estado: tarea.estado
                }))
            }));

            reporte.lista_proyectos_finalizados = proyectosFinalizados.map(proyecto => ({
                id: proyecto.id,
                nombre: proyecto.nombre,
                estado: proyecto.estado,
                cliente: proyecto.cliente ? `${proyecto.cliente.id} - ${proyecto.cliente.nombre}` : 'Sin Cliente',

                // TAREAS PENDIENTES, FINALIZADAS Y DE BAJA SE FILTRAN Y MAPEAN POR SEPARADO PARA CADA PROYECTO----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                tareas_pendiente: (proyecto.tareas || []).filter(tarea => tarea.estado === EstadosTareasEnum.PENDIENTE).map(tarea => ({
                    id: tarea.id,
                    descripcion: tarea.descripcion,
                    estado: tarea.estado
                })),
                tareas_finalizada: (proyecto.tareas || []).filter(tarea => tarea.estado === EstadosTareasEnum.FINALIZADA).map(tarea => ({
                    id: tarea.id,
                    descripcion: tarea.descripcion,
                    estado: tarea.estado
                })),
                tareas_baja: (proyecto.tareas || []).filter(tarea => tarea.estado === EstadosTareasEnum.BAJA).map(tarea => ({
                    id: tarea.id,
                    descripcion: tarea.descripcion,
                    estado: tarea.estado
                }))
            }));

            reporte.lista_proyectos_baja = proyectosBaja.map(proyecto => ({
                id: proyecto.id,
                nombre: proyecto.nombre,
                estado: proyecto.estado,
                cliente: proyecto.cliente ? `${proyecto.cliente.id} - ${proyecto.cliente.nombre}` : 'Sin Cliente',
                // TAREAS PENDIENTES, FINALIZADAS Y DE BAJA SE FILTRAN Y MAPEAN POR SEPARADO PARA CADA PROYECTO----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                tareas_pendiente: (proyecto.tareas || []).filter(tarea => tarea.estado === EstadosTareasEnum.PENDIENTE).map(tarea => ({
                    id: tarea.id,
                    descripcion: tarea.descripcion,
                    estado: tarea.estado
                })),
                tareas_finalizada: (proyecto.tareas || []).filter(tarea => tarea.estado === EstadosTareasEnum.FINALIZADA).map(tarea => ({
                    id: tarea.id,
                    descripcion: tarea.descripcion,
                    estado: tarea.estado
                })),
                tareas_baja: (proyecto.tareas || []).filter(tarea => tarea.estado === EstadosTareasEnum.BAJA).map(tarea => ({
                    id: tarea.id,
                    descripcion: tarea.descripcion,
                    estado: tarea.estado
                }))
            }));

        } catch (error) {
            console.error('Error al generar el reporte:', error);
            throw new Error('No se pudo generar el reporte');
        }


        reporte.fecha_generacion = new Date();
        return reporte;
    }

    async reporteClietes(): Promise<ReporteClienteDTO[]> {
        const clientes: Cliente[] = await this.repositoryCliente.find({
            where: { estado: EstadosClientesEnum.ACTIVO },
            relations: { proyectos: true }
        });

        if (clientes.length === 0) {
            throw new NotFoundException(`Actualmente no existen clientes en: ${EstadosClientesEnum.ACTIVO}.`);
        }

        const clientesDto: ReporteClienteDTO[] = clientes.map((cliente) => {
            const proyectosActivos = cliente.proyectos
                ? cliente.proyectos.filter(proyecto => proyecto.estado === EstadosProyectosEnum.ACTIVO)
                : [];

            return ({
                id_cliente: cliente.id,
                nombre_cliente: cliente.nombre,
                proyectos_activos: proyectosActivos.length
            })

        })
        return clientesDto
    }

    async repoteProyectos(): Promise<ReporteProyectoDTO[]> {
        const proyectos: Proyecto[] = await this.repositoryProyecto.find({
            where: { estado: EstadosProyectosEnum.ACTIVO },
            relations: { tareas: true }
        });

        const proyectosDto: ReporteProyectoDTO[] = proyectos.map((proyecto) => {

            const tareas_pendientes = proyecto.tareas ? proyecto.tareas.filter(tarea => tarea.estado === EstadosTareasEnum.PENDIENTE) : []

            return {
                id_proyecto: proyecto.id,
                nombre_proyecto: proyecto.nombre,
                tareas_pendientes: tareas_pendientes.length
            }
        })

        return proyectosDto
    }

    async reporteTareas(): Promise<ReporteTareaDTO> {
        const tareas: Tarea[] = await this.repositoryTarea.find()

        const tareasDto: ReporteTareaDTO = {
            total_tareas: tareas.length,
            tareas_pendientes: tareas.filter(tarea => tarea.estado === EstadosTareasEnum.PENDIENTE).length
        }

        return tareasDto
    }

}