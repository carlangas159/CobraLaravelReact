import React, {useEffect, useState} from 'react';
import DetalleTarea from "./DetalleTarea.tsx";


import axios from "axios";
import {iTarea, Tarea} from "../storage/Tareas.tsx";
import 'jquery/dist/jquery.min.js';

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/dataTables.dataTables.min.css"
import $ from 'jquery';

let dts = undefined;
const ListaTareas = () => {
    const [tareas, setTareas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

    const updateData =  async () => {
        const response = await axios.get('http://127.0.0.1:8000/api/tarea');
        setTareas(response.data);
    };
    useEffect(() => {
        updateData();

        $(document).ready(function () {
            dts = $('#tblTareas').DataTable();

        });
    }, []);

    const handleDelete = async (id: number) => {
        // Eliminar la tarea de la API
        await axios.delete(`http://127.0.0.1:8000/api/tarea/${id}`);
        updateData();


    };

    const handleNewOpenModal = () => {
        setShowModal(true);
        setTareaSeleccionada(null);

    };

    const handleOpenModal = (tarea: iTarea) => {
        setShowModal(true);
        setTareaSeleccionada(tarea);

    };

    const handleSave = async (tarea: iTarea) => {
        // Actualizar la tarea en la API
        await axios.put(`http://127.0.0.1:8000/api/tarea/${tarea.id}`, tarea);

        updateData();

        // Cerrar el modal
        setShowModal(false);

    };

    return (
        <div className="MainDiv">

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
                                <td>{item.completed?'SI':'NO'}</td>
                                <td>
                                    <button className="btn btn-secondary" onClick={() => handleOpenModal(item)}>Editar</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
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
                {showModal && <DetalleTarea showModal={showModal} tarea={tareaSeleccionada} onSave={handleSave} onShowModal={setShowModal}  />}
            </div>
        </div>
    );
};

export default ListaTareas;