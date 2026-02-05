// src/components/Sidebar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  RiDashboardLine,
  RiTeamLine,
  RiUserAddLine,
  RiQrScan2Line,
  RiLogoutBoxRLine,
  RiHistoryLine,
} from "react-icons/ri";
import { motion } from "framer-motion";
import logo from "../assets/logo.jpeg";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", icon: <RiDashboardLine />, label: "Inicio" },
    {
      path: "/admin/clientes",
      icon: <RiTeamLine />,
      label: "Lista de Clientes",
    },
    {
      path: "/admin/nuevo-cliente",
      icon: <RiUserAddLine />,
      label: "Agregar Cliente",
    },
    { path: "/admin/historial", icon: <RiHistoryLine />, label: "Historial" }, // NUEVO
    { path: "/check-in", icon: <RiQrScan2Line />, label: "Modo Check-In" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-[#223c1f] text-[#fbf4e4] flex flex-col fixed left-0 top-0 shadow-xl">
      <div className="p-6 flex flex-col items-center border-b border-[#659d3a]/30">
        <img
          src={logo}
          alt="Logo"
          className="w-20 h-20 rounded-full mb-3 border-2 border-[#659d3a]"
        />
        <h2 className="text-lg font-bold">Admin Gym</h2>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
              location.pathname === item.path
                ? "bg-[#659d3a] text-white shadow-lg"
                : "hover:bg-[#659d3a]/20"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="m-4 flex items-center gap-3 p-3 rounded-lg hover:bg-red-900/40 text-red-400 transition-colors"
      >
        <RiLogoutBoxRLine className="text-xl" />
        <span className="font-medium">Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default Sidebar;
