import React, {useState} from 'react';
import { Button, Modal } from 'react-bootstrap';
import {Tarea} from "../storage/Tareas.tsx";

const DetalleTarea = ({tarea,showModal, onSave,onShowModal}) => {
    const [id, setId] = useState(tarea!==null ? tarea.id : 0);
    const [title, setTitle] = useState(tarea!==null ? tarea.title:"");
    const [description, setDescription] = useState(tarea!==null ? tarea.description:"");
    const [completed, setCompleted] = useState(tarea!==null ? tarea.completed:false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedTarea = {
            ...tarea,
            id,
            title,
            description,
            completed,
        };

        onSave(updatedTarea);
    };

    return (
        <div>
            <Modal show={showModal} onHide={() => onShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>My Modal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} >
                        <input type="hidden" id="id" value={id} onChange={(e) => setId(e.target.value)}/>

                        <label htmlFor="title">Nombre:</label>
                        <input className="form-control" type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                        <br/>
                        <label htmlFor="description">Descripción:</label>
                        <input className="form-control" type="text" id="description" value={description}
                               onChange={(e) => setDescription(e.target.value)} required/>
                        <br/>
                        <label htmlFor="completed">Completado:</label>
                        <input type="checkbox" id="completed" checked={completed?true:false} value={completed?1:0} onChange={(e) => setCompleted(Boolean(e.target.value))}/>
                        <br/>
                        <button type="submit" className="btn btn-secondary">Guardar</button>
                    </form>
                                    </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-danger" variant="secondary" onClick={() => onShowModal(false)}>
                        Atras
                    </Button>
                </Modal.Footer>
            </Modal>



        </div>
    );
};

export default DetalleTarea;