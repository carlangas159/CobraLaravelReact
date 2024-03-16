import './App.css'
import ListaTareas from "./components/ListaTareas.tsx";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <>
        <div>
            <h1>App Tareas</h1>
            <p>Aquí se mostrarán las tareas.</p>
            <ListaTareas/>
        </div>
    </>
  )
}

export default App