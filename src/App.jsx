import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CheckIn from "./pages/CheckIn";
import ClientList from "./pages/ClientList";
import ClientForm from "./pages/ClientForm";
import AccessHistory from "./pages/AccessHistory";
import NotFound from "./pages/NotFound";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/check-in"
            element={
              <PrivateRoute>
                <CheckIn />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/clientes"
            element={
              <PrivateRoute>
                <ClientList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/nuevo-cliente"
            element={
              <PrivateRoute>
                {" "}
                <ClientForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/editar/:id"
            element={
              <PrivateRoute>
                <ClientForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/historial"
            element={
              <PrivateRoute>
                <AccessHistory />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
