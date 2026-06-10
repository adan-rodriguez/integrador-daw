import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Proyecto } from "../entities/proyecto.entity";
import { Repository } from "typeorm";
import { Cliente } from "../entities/cliente.entity";
import { Tarea } from "../entities/tarea.entity";
import { Parser } from "json2csv";

@Injectable()
export class CsvService {
    constructor(
        @InjectRepository(Proyecto) private readonly repositoryProyecto: Repository<Proyecto>,
        @InjectRepository(Cliente) private readonly repositoryCliente: Repository<Cliente>,
        @InjectRepository(Tarea) private readonly repositoryTarea: Repository<Tarea>,
    ) { }


    async generarCsvProyecto(): Promise<string> {
        const proyectos = await this.repositoryProyecto.find();


        if (proyectos.length === 0) {
            return 'id,nombre,estado,id_cliente\n'; // Retorna solo el encabezado si no hay datos
        }

        const dataAplanada = proyectos.map(
            (proyecto) => ({
                id_proyecto: proyecto.id,
                nombre_proyecto: proyecto.nombre,
                estado_proyecto: proyecto.estado,
                Cliente: proyecto.cliente ? proyecto.cliente.nombre : 'Sin Cliente', // Maneja
            })
        )

        const archivos = ['id_proyecto', 'nombre_proyecto', 'estado_proyecto', 'Cliente'];
        return new Parser({ fields: archivos }).parse(dataAplanada);
    }

    async generarCsvCliente(): Promise<string> {
        const clientes = await this.repositoryCliente.find();

        if (clientes.length === 0) {
            return 'id,nombre,estado\n'; // Retorna solo el encabezado si no hay datos
        }

        const dataAplanada = clientes.map(
            (cliente) => ({
                id_cliente: cliente.id,
                nombre_cliente: cliente.nombre,
                estado_cliente: cliente.estado,
            })
        )

        const archivos = ['id_cliente', 'nombre_cliente', 'estado_cliente'];
        return new Parser({ fields: archivos }).parse(dataAplanada);
    }

    async generarCsvTarea(): Promise<string> {
        const tareas = await this.repositoryTarea.find();

        if (tareas.length === 0) {
            return 'id,descripcion,estado,id_proyecto\n'; // Retorna solo el encabezado si no hay datos
        }

        const dataAplanada = tareas.map(
            (tarea) => ({
                id_tarea: tarea.id,
                descripcion_tarea: tarea.descripcion,
                estado_tarea: tarea.estado,
                id_proyecto: tarea.idProyecto
            })
        )

        const archivos = ['id_tarea', 'descripcion_tarea', 'estado_tarea', 'id_proyecto'];
        return new Parser({ fields: archivos }).parse(dataAplanada);
    }


}