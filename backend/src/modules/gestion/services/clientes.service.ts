import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from '../entities/cliente.entity';
import { CreateClienteDto } from '../dtos/input/create-cliente.dto';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import { UpdateClienteDto } from '../dtos/input/update-cliente.dto';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import { ListClienteDTO } from '../dtos/output/list-cliente.dto';
import {
  ConflictException,
  forwardRef,
  Inject,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ProyectosService } from './proyectos.service';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente) private readonly repository: Repository<Cliente>,
    @Inject(forwardRef(() => ProyectosService))
    private readonly proyectosService: ProyectosService,
  ) { }

  async crearCliente(dto: CreateClienteDto): Promise<{ id: number }> {
    const cliente: Cliente = this.repository.create(dto);
    cliente.estado = EstadosClientesEnum.ACTIVO;
    try {
      await this.repository.save(cliente);
      return { id: cliente.id };
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const dbError = error.driverError as { code?: string };
        if (dbError.code === '23505') {
          // unique
          throw new ConflictException(
            `Ya existe un cliente registrado con el nombre '${dto.nombre}'.`,
          );
        }
      }
      throw error;
    }
  }

  async actualizarCliente(id: number, dto: UpdateClienteDto): Promise<void> {
    const cliente: Cliente | null = await this.repository.findOneBy({ id });

    if (!cliente) {
      throw new NotFoundException(
        `El cliente con el ID ${id} no fue encontrado.`,
      );
    }

    if (dto.estado === EstadosClientesEnum.BAJA) {
      const relacionadoConProyectos =
        await this.proyectosService.existeProyectoPorIdCliente(id);

      if (relacionadoConProyectos) {
        throw new UnprocessableEntityException(
          'No se puede dar de baja un cliente con proyectos relacionados.',
        );
      }
    }

    try {
      this.repository.merge(cliente, dto);
      await this.repository.save(cliente);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const dbError = error.driverError as { code?: string };
        if (dbError.code === '23505') {
          // unique
          throw new ConflictException(
            `Ya existe un cliente registrado con el nombre '${dto.nombre}'.`,
          );
        }
      }
      throw error;
    }
  }

  async obtenerClientes(
    estado: EstadosClientesEnum,
  ): Promise<ListClienteDTO[]> {
    const whereCondition: FindOptionsWhere<ListClienteDTO> = {};

    if (estado) {
      whereCondition.estado = estado;
    }

    const clientes: Cliente[] = await this.repository.find({
      select: { id: true, nombre: true, estado: true },
      order: { id: 'ASC' },
      where: whereCondition,
    });

    const dtoList: ListClienteDTO[] = [];

    for (const c of clientes) {
      const dto = new ListClienteDTO();
      dto.id = c.id;
      dto.nombre = c.nombre;
      dto.estado = c.estado;
      dtoList.push(dto);
    }

    return dtoList;
  }

  async existeClienteActivoPorId(id: number): Promise<boolean> {
    const existe: boolean = await this.repository.exists({
      where: { id, estado: EstadosClientesEnum.ACTIVO },
    });
    return existe;
  }
}
