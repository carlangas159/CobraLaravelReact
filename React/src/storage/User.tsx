import {useState} from "react";

const [users, setUsers] = useState<User[]>([]);

export interface iUser {
     id: number;
    email: string;
     password: string;
     token: string;

}

export class User implements iUser {
    id: number = 0;
    email: string = '';
    password: string = '';
    token: string = '';

    constructor() {
    }
}

// Agregar una nueva user
export const agregarUser = (
    email: string,
    password: string,
    token: string,
    id: number = 0,
) => {
    const newUser: User = {
        id,
        email,
        password,
        token,
    };

    // Actualizar el estado con la nueva user
    setUsers([...users, newUser]);
};