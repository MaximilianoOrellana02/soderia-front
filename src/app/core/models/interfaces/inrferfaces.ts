export interface Cliente {
    id?: string;
    nombre: string;
    apellido: string;
    nro_telefono?: string;
    calle: string;
    altura: string;
    piso_depto?: string;
    barrio: string;
    localidad: string;
    productos?: Producto[];
    createdAt: string;
}


export interface Producto {
    id?: number;
    cliente_id?: number;
    tipoProducto: string;
    cantidad: number;
    createdAt?: string;
    updatedAt?: string;
}