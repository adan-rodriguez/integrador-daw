-- 1. LIMPIEZA ABSOLUTA (Evita el error de "ya existe")
DROP TABLE IF EXISTS tareas, proyectos, clientes, usuarios CASCADE;
DROP TYPE IF EXISTS estados_usuarios, estados_clientes, estados_proyectos, estados_tareas CASCADE;

-- 2. CREACIÓN DE ENUMS
CREATE TYPE estados_usuarios AS ENUM ('ACTIVO','BAJA');
CREATE TYPE estados_clientes AS ENUM ('ACTIVO','BAJA');
CREATE TYPE estados_proyectos AS ENUM ('ACTIVO','FINALIZADO','BAJA');
CREATE TYPE estados_tareas AS ENUM ('PENDIENTE','FINALIZADA','BAJA');
-- 2.5. CREACIÓN DEL ENUM DE ROLES (Agregalo antes de la tabla)
CREATE TYPE roles_usuarios AS ENUM ('ADMIN', 'USUARIO', 'SUPERVISOR');

-- 3. CREACIÓN DE TABLAS
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    clave TEXT NOT NULL,
    estado estados_usuarios NOT NULL,
    rol roles_usuarios NOT NULL DEFAULT 'USUARIO'
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    estado estados_clientes NOT NULL
);

CREATE TABLE proyectos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    estado estados_proyectos NOT NULL,
    id_cliente INT,
    CONSTRAINT fk_proyectos_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes (id)
);

CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    estado estados_tareas NOT NULL,
    id_proyecto INT NOT NULL,
    CONSTRAINT fk_tareas_proyecto
        FOREIGN KEY (id_proyecto)
        REFERENCES proyectos (id)
);

-- 4. EXTENSIONES Y USUARIO BASE (¡Con punto y coma!)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Usuario Administrador (para probar reportes y permisos altos)
INSERT INTO usuarios (nombre, clave, estado, rol) 
VALUES ('admin', crypt('clave', gen_salt('bf', 10)), 'ACTIVO', 'ADMIN');

-- Usuario Normal (para probar que el sistema le bloquee las cosas)
INSERT INTO usuarios (nombre, clave, estado, rol) 
VALUES ('usuario', crypt('clave', gen_salt('bf', 10)), 'ACTIVO', 'USUARIO');

-- Usuario Supervisor (opcional, para tener variedad)
INSERT INTO usuarios (nombre, clave, estado, rol) 
VALUES ('supervisor', crypt('clave', gen_salt('bf', 10)), 'ACTIVO', 'SUPERVISOR');


-- 5. SEMILLA DE DATOS (Clientes)
INSERT INTO clientes (nombre, estado) VALUES 
('Mercado Libre', 'ACTIVO'),
('Coca Cola S.A.', 'ACTIVO'),
('Globant', 'ACTIVO'),
('Arcor', 'BAJA');

-- 6. SEMILLA DE DATOS (Proyectos)
INSERT INTO proyectos (nombre, estado, id_cliente) VALUES 
('Migración Cloud', 'ACTIVO', 1),
('Dashboard Analítico', 'FINALIZADO', 1),
('App Mobile iOS', 'ACTIVO', 2),
('Rediseño Web Institucional', 'BAJA', 2),
('API de Pagos', 'ACTIVO', 2),
('Sistema de RRHH', 'ACTIVO', 3),
('Bot de Soporte con IA', 'FINALIZADO', 3),
('Integración de CRM', 'ACTIVO', 3),
('Ecommerce V2', 'ACTIVO', 4),
('Inventario Automatizado', 'ACTIVO', 4);

-- 7. SEMILLA DE DATOS (Tareas)
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES 
('Configurar servidores AWS', 'FINALIZADA', 1),
('Migrar base de datos principal', 'PENDIENTE', 1),
('Apagar servidores físicos', 'PENDIENTE', 1),
('Definir KPIs con el cliente', 'FINALIZADA', 2),
('Armar gráficos en Angular', 'FINALIZADA', 2),
('Diseño de pantallas UI/UX', 'FINALIZADA', 3),
('Programar Login con Apple', 'PENDIENTE', 3),
('Testing en dispositivos físicos', 'PENDIENTE', 3),
('Relevar requerimientos', 'FINALIZADA', 4),
('Maquetar Home', 'BAJA', 4),
('Conexión con Stripe', 'PENDIENTE', 5),
('Crear webhooks de respuesta', 'PENDIENTE', 5),
('Módulo de vacaciones', 'FINALIZADA', 6),
('Módulo de liquidación de sueldos', 'PENDIENTE', 6),
('Entrenar modelo base', 'FINALIZADA', 7),
('Conectar API de WhatsApp', 'FINALIZADA', 7),
('Mapear campos de base de datos', 'PENDIENTE', 8),
('Sincronización nocturna', 'PENDIENTE', 8),
('Resolver errores de duplicados', 'BAJA', 8),
('Configurar carrito de compras', 'FINALIZADA', 9),
('Pasarela de envíos', 'PENDIENTE', 9),
('Instalar sensores en depósito', 'BAJA', 10),
('Panel de control web', 'PENDIENTE', 10);