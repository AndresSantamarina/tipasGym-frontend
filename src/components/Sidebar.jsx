import { Link, useLocation } from "react-router-dom";
import {
  RiDashboardLine,
  RiTeamLine,
  RiUserAddLine,
  RiQrScan2Line,
  RiLogoutBoxRLine,
  RiHistoryLine,
  RiCloseLine,
} from "react-icons/ri";
import logo from "../assets/logo.jpeg";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

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
    { path: "/admin/historial", icon: <RiHistoryLine />, label: "Historial" },
    { path: "/check-in", icon: <RiQrScan2Line />, label: "Modo Check-In" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-[#223c1f] text-[#fbf4e4] flex flex-col shadow-xl transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0
    `}
    >
      <div className="p-6 flex flex-col items-center border-b border-[#659d3a]/30 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute right-4 top-4 text-2xl text-[#659d3a]"
        >
          <RiCloseLine />
        </button>
        <img
          src={logo}
          alt="Logo"
          className="w-20 h-20 rounded-full mb-3 border-2 border-[#659d3a]"
        />
        <h2 className="text-lg font-bold">Admin Gym</h2>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
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
