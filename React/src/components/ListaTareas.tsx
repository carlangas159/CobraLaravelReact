// @ts-ignore
import React, { useEffect, useState, useMemo } from 'react';
import DetalleTarea from "./DetalleTarea.tsx";

import { iTarea } from "../storage/Tareas.tsx";
// Usamos react-data-table-component para tabla reactiva, paginada y responsive
import DataTable, { TableColumn } from 'react-data-table-component';
import axiosService, { removeLog } from "../axiosService.tsx";

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
const ListaTareas: React.FC<IProps> = ({ user }) => {
  const [tareas, setTareas] = useState<iTarea[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState<iTarea | null>(null);
  const [filterText, setFilterText] = useState<string>("");
  const [perPage, setPerPage] = useState<number>(10);

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
      });
  };

  useEffect(() => { updateData(); }, []);

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
    removeLog();
    window.location.reload();
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
    if (tarea.id > 0) {
      await axiosService.put(`/tarea/${tarea.id}`, tarea);
    } else {
      await axiosService.post(`/tarea`, tarea);
    }

    updateData();
    setShowModal(false);
  };

  // Columnas para react-data-table-component (deben definirse después de los handlers)
  const columns = useMemo(() => [
    { name: 'ID', selector: (row: iTarea) => row.id ?? 0, sortable: true, width: '72px' },
    { name: 'Titulo', selector: (row: iTarea) => row.title ?? '', sortable: true, wrap: true },
    { name: 'Descripcion', selector: (row: iTarea) => row.description ?? '', sortable: false, grow: 2, wrap: true },
    { name: 'Completado', selector: (row: iTarea) => (row.completed ? 'SI' : 'NO'), sortable: true, width: '110px' },
    {
      name: 'Acción',
      cell: (row: iTarea) => (
        <div className="d-flex gap-2">
          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(row)}>Editar</button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.id)}>Eliminar</button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '180px'
    }
  ], []) as TableColumn<iTarea>[];

  // Datos filtrados por búsqueda
  const filteredTareas = useMemo(() => {
    if (!filterText) return tareas;
    const ft = filterText.toLowerCase();
    return tareas.filter(t => (t.title || '').toLowerCase().includes(ft) || (t.description || '').toLowerCase().includes(ft));
  }, [tareas, filterText]);

  // Estilos personalizados para mejor apariencia (usar Bootstrap + ajustes)
  const customStyles = useMemo(() => ({
    rows: { style: { minHeight: '56px' } },
    headCells: { style: { fontSize: '14px', fontWeight: 600 } },
    cells: { style: { fontSize: '14px' } }
  }), []);

  return (

    <div className="MainDiv">
      <h1>App Tareas</h1>
      {user && user.name && <p>Bienvenido, {user.name}</p>}
      <p>Aquí se mostrarán las tareas.</p>

      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex gap-2 align-items-center">
            <button className="btn btn-primary" onClick={() => handleNewOpenModal()}>Nuevo</button>
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ width: '280px' }}
              placeholder="Buscar por título o descripción"
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
          </div>
          <div>
            <label className="me-2">Filas por página:</label>
            <select className="form-select form-select-sm" style={{ width: '80px' }} value={perPage} onChange={e => setPerPage(Number(e.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredTareas}
          pagination
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={[5, 10, 20]}
          responsive
          highlightOnHover
          persistTableHead
          customStyles={customStyles}
          noDataComponent={<div className="p-3">No hay tareas disponibles</div>}
        />

        {showModal && <DetalleTarea showModal={showModal} tarea={tareaSeleccionada} onSave={handleSave} onShowModal={setShowModal} />}
        <button className="btn btn-danger mt-3" onClick={() => logOut()}>Salir</button>

      </div>


    </div>
  );
};

export default ListaTareas;
