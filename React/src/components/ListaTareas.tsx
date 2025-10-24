// @ts-ignore
import React, {useEffect, useState} from 'react';
import DetalleTarea from "./DetalleTarea.tsx";


import {iTarea} from "../storage/Tareas.tsx";
import 'jquery/dist/jquery.min.js';

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/dataTables.dataTables.min.css"
import $ from 'jquery';
import axiosService, {removeLog} from "../axiosService.tsx";

/**
 * Interfaz para el usuario (sólo los campos que usamos en este componente).
 */
interface IUser {
    id?: number;
    name?: string;
    email?: string;
}

/**
 * Props del componente ListaTareas
 */
interface IProps {
    user?: IUser;
}

/**
 * Componente ListaTareas
 *
 * Muestra una lista de tareas obtenidas desde la API y permite CRUD básico.
 *
 * Ejemplos de uso:
 * 1) <ListaTareas />
 * 2) <ListaTareas user={{ id: 1, name: 'Juan', email: 'juan@ejemplo.com' }} />
 * 3) <ListaTareas user={userObject} />
 */
const ListaTareas: React.FC<IProps> = ({user}) => {
    const [tareas, setTareas] = useState<iTarea[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [tareaSeleccionada, setTareaSeleccionada] = useState<iTarea | null>(null);

    /**
     * updateData
     *
     * Obtiene la lista de tareas desde la API y actualiza el estado.
     *
     * Ejemplos de uso:
     * 1) updateData(); // fuerza recarga desde la API
     * 2) useEffect(() => { updateData(); }, []); // uso en efecto
     * 3) onRefreshButtonClick -> updateData(); // desde un evento
     */
    const updateData = () => {
        // @ts-ignore
        axiosService.get('/tarea')
            .then((response) => {
                setTareas(response.data as iTarea[]);
                // @ts-ignore
            }).catch(err => {
            removeLog();
        })
        ;
    };

    useEffect(() => {
        updateData();

        $(document).ready(function () {
            // @ts-ignore
            $('#tblTareas').DataTable();

        });
    }, []);

    /**
     * handleDelete
     *
     * Elimina una tarea por id y refresca la lista.
     *
     * Ejemplos de uso:
     * 1) handleDelete(5); // elimina la tarea con id 5
     * 2) onClick -> handleDelete(item.id) // desde un botón
     * 3) await handleDelete(10) // uso asíncrono
     *
     * @param id - identificador de la tarea a eliminar
     */
    const handleDelete = async (id: number) => {
        await axiosService.delete(`/tarea/${id}`);
        updateData();
    };

    /**
     * logOut
     *
     * Cierra sesión (elimina token) y recarga la página.
     *
     * Ejemplos de uso:
     * 1) <button onClick={logOut}>Salir</button>
     * 2) if (sessionExpired) logOut();
     * 3) onLogout -> logOut();
     */
    const logOut = () => {
        removeLog()
        window.location.reload()
    };

    /**
     * handleNewOpenModal
     *
     * Prepara el modal para crear una nueva tarea.
     *
     * Ejemplos de uso:
     * 1) onClick -> handleNewOpenModal()
     * 2) crearNuevo() -> handleNewOpenModal()
     * 3) showDialog -> handleNewOpenModal()
     */
    const handleNewOpenModal = () => {
        setShowModal(true);
        setTareaSeleccionada(null);
    };

    /**
     * handleOpenModal
     *
     * Abre el modal para editar una tarea existente.
     *
     * Ejemplos de uso:
     * 1) onClick -> handleOpenModal(item)
     * 2) editItem(item) -> handleOpenModal(item)
     * 3) mostrarDetalle -> handleOpenModal(tarea)
     *
     * @param tarea - tarea que se va a editar
     */
    const handleOpenModal = (tarea: iTarea) => {
        setShowModal(true);
        setTareaSeleccionada(tarea);
    };

    /**
     * handleSave
     *
     * Crea o actualiza una tarea según su id y refresca la lista.
     *
     * Ejemplos de uso:
     * 1) await handleSave({ id: 0, title: 'Nueva', description: '', completed: false })
     * 2) await handleSave(tareaModificada)
     * 3) onSubmit -> handleSave(tarea)
     *
     * @param tarea - objeto iTarea a persistir
     */
    const handleSave = async (tarea: iTarea) => {
        if (tarea.id > 0){
            await axiosService.put(`/tarea/${tarea.id}`, tarea);
        }else{
            await axiosService.post(`/tarea`, tarea);
        }

        updateData();
        setShowModal(false);
    };

    return (

        <div className="MainDiv">
            <h1>App Tareas</h1>
            {user && user.name && <p>Bienvenido, {user.name}</p>}
            <p>Aquí se mostrarán las tareas.</p>

            <div className="container">

                <button className="btn btn-primary" onClick={() => handleNewOpenModal()}>Nuevo</button>


                <table id="tblTareas" className="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>Titulo</th>
                        <th>Descripcion</th>
                        <th>Completado</th>
                        <th>Accion</th>

                    </tr>
                    </thead>
                    <tbody>
                    {tareas && tareas.length > 0 ? (

                        tareas.map((item: iTarea) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.title}</td>
                                <td>{item.description}</td>
                                <td>{item.completed ? 'SI' : 'NO'}</td>
                                <td>
                                    <button className="btn btn-secondary"
                                            onClick={() => handleOpenModal(item)}>Editar
                                    </button>
                                    <button className="btn btn-danger"
                                            onClick={() => handleDelete(item.id)}>Eliminar
                                    </button>
                                </td>
                            </tr>


                        ))
                    ) : (
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>

                        </tr>

                    )}

                    </tbody>
                </table>
                {showModal && <DetalleTarea showModal={showModal} tarea={tareaSeleccionada} onSave={handleSave}
                                            onShowModal={setShowModal}/>}
                <button className="btn btn-danger" onClick={() => logOut()}>Salir</button>

            </div>


        </div>
    );
};

export default ListaTareas;