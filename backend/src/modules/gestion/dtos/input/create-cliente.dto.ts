import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;
}
