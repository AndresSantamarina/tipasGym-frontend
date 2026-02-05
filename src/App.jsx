import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CheckIn from "./pages/CheckIn";
import ClientList from "./pages/ClientList";
import ClientForm from "./pages/ClientForm";
import AccessHistory from "./pages/AccessHistory";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/check-in" element={<CheckIn />} />

        {/* Rutas Privadas Admin */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/clientes" element={<ClientList />} />
        <Route path="/admin/nuevo-cliente" element={<ClientForm />} />
        <Route path="/admin/editar/:id" element={<ClientForm />} />
        <Route path="/admin/historial" element={<AccessHistory />} />

        {/* Redirección por defecto */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Router>
  );
}

export default App;
