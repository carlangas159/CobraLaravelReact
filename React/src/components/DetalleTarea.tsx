// @ts-ignore
import React, {useState, useEffect} from 'react';
import { Button, Modal } from 'react-bootstrap';

import { iTarea } from '../storage/Tareas';

/**
 * Props del componente DetalleTarea
 */
interface IDetalleTareaProps {
  tarea: iTarea | null;
  showModal: boolean;
  onSave: (tarea: iTarea) => void;
  onShowModal: (show: boolean) => void;
}

/**
 * Componente DetalleTarea
 *
 * Muestra un modal para crear o editar una tarea. Si `tarea` es null o tiene id 0 se trata como "nueva tarea".
 *
 * Ejemplos de uso:
 * 1) <DetalleTarea showModal={true} tarea={null} onSave={saveFn} onShowModal={setShow} />
 * 2) <DetalleTarea showModal={isOpen} tarea={tareaSeleccionada} onSave={saveFn} onShowModal={setShow} />
 * 3) <DetalleTarea showModal={false} tarea={null} onSave={() => {}} onShowModal={() => {}} />
 */
const DetalleTarea: React.FC<IDetalleTareaProps> = ({tarea, showModal, onSave, onShowModal}) => {
    // Estados locales sincronizados con la prop `tarea` cada vez que se abre el modal
    const [id, setId] = useState<number>(tarea && typeof tarea.id === 'number' ? tarea.id : 0);
    const [title, setTitle] = useState<string>(tarea && tarea.title ? tarea.title : '');
    const [description, setDescription] = useState<string>(tarea && tarea.description ? tarea.description : '');
    const [completed, setCompleted] = useState<boolean>(tarea && !!tarea.completed ? true : false);

    /**
     * Sincroniza los estados locales con la prop `tarea` cuando el modal se abre o `tarea` cambia.
     *
     * Ejemplos:
     * 1) Al abrir el modal para editar, los campos mostrarán los valores de la tarea seleccionada.
     * 2) Al abrir el modal para crear (tarea=null), los campos quedarán vacíos.
     * 3) Si cambias la prop `tarea` mientras el modal está abierto, los campos se actualizan.
     */
    useEffect(() => {
        if (tarea) {
            setId(typeof tarea.id === 'number' ? tarea.id : Number(tarea.id || 0));
            setTitle(tarea.title || '');
            setDescription(tarea.description || '');
            setCompleted(!!tarea.completed);
        } else {
            // Nueva tarea -> resetear campos
            setId(0);
            setTitle('');
            setDescription('');
            setCompleted(false);
        }
    }, [tarea, showModal]);

    /**
     * handleSubmit
     *
     * Valida y construye el objeto tarea para enviarlo vía onSave.
     *
     * Ejemplos:
     * 1) Al presionar guardar en edición, se actualiza la tarea existente.
     * 2) Al presionar guardar en nueva tarea, se crea con id 0 (backend asignará id).
     * 3) onSave se puede usar para refrescar la lista en el componente padre.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedTarea: iTarea = {
            // mantener la estructura: si id es 0, backend interpreta como creación
            id: id || 0,
            title: title.trim(),
            description: description.trim(),
            completed: completed,
        } as iTarea;

        onSave(updatedTarea);
    };

    /**
     * toggleModal
     *
     * Cierra el modal y limpia el estado local si es necesario.
     *
     * Ejemplos:
     * 1) toggleModal(false) -> cierra el modal
     * 2) toggleModal(true) -> abriría el modal (no usado internamente)
     * 3) toggleModal(false) antes de navegar fuera de la vista
     */
    const toggleModal = (show: boolean) => {
        onShowModal(show);
    };

    // Título del modal: nombre de la tarea si estamos editando, o 'Nueva tarea' si es creación
    const modalTitle = (tarea && (tarea.id && tarea.id > 0)) ? (title || 'Editar tarea') : 'Nueva tarea';

    return (
        <div>
            <Modal show={showModal} onHide={() => toggleModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        {/* id oculto */}
                        <input type="hidden" id="id" value={id} />

                        <div className="mb-2">
                            <label htmlFor="title" className="form-label">Nombre:</label>
                            <input className="form-control" type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="description" className="form-label">Descripción:</label>
                            <input className="form-control" type="text" id="description" value={description}
                                   onChange={(e) => setDescription(e.target.value)} required />
                        </div>

                        <div className="form-check mb-3">
                            <input className="form-check-input" type="checkbox" id="completed" checked={completed} onChange={(e) => setCompleted(e.target.checked)} />
                            <label className="form-check-label" htmlFor="completed">Completado</label>
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-secondary">Guardar</button>
                            <Button variant="outline-secondary" onClick={() => toggleModal(false)}>Atrás</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

        </div>
    );
};

export default DetalleTarea;
