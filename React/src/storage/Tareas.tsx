import {useState} from "react";

const [tareas, setTareas] = useState<Tarea[]>([]);

export interface iTarea {
    id: number;
    title: string;
    description: string;
    completed: boolean;

}

export class Tarea implements iTarea {
    id: number = 0;
    title: string = '';
    description: string = '';
    completed: boolean = false;

    constructor() {
    }
}

// Agregar una nueva tarea
export const agregarTarea = (
    title: string,
    description: string,
    completed: boolean,
    id: number = 0,
) => {
    const nuevaTarea: Tarea = {
        id,
        title,
        description,
        completed,
    };

    // Actualizar el estado con la nueva tarea
    setTareas([...tareas, nuevaTarea]);
};