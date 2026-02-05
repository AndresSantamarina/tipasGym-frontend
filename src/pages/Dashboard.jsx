import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";
import {
  RiUserSharedLine,
  RiUserUnfollowLine,
  RiUserFollowLine,
  RiLoginBoxLine,
  RiPieChartLine,
} from "react-icons/ri";
import { motion } from "framer-motion";
import clientAxios from "../api/clientAxios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    vencidos: 0,
    ingresosHoy: 0,
    porcentajeVencidos: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await clientAxios.get("/clients/stats", {
          headers: { "x-auth-token": token },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Error al cargar estadísticas", error);
      }
    };
    fetchStats();
  }, [token]);

  const cards = [
    {
      label: "Total Socios",
      value: stats.total,
      icon: <RiUserSharedLine />,
      color: "bg-blue-500",
    },
    {
      label: "Socios Activos",
      value: stats.activos,
      icon: <RiUserFollowLine />,
      color: "bg-[#659d3a]",
    },
    {
      label: "Cuotas Vencidas",
      value: stats.vencidos,
      icon: <RiUserUnfollowLine />,
      color: "bg-red-500",
    },
    {
      label: "Ingresos Hoy",
      value: stats.ingresosHoy,
      icon: <RiLoginBoxLine />,
      color: "bg-[#223c1f]",
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#223c1f]">Panel de Control</h1>
        <p className="text-gray-600">Resumen general del estado del gimnasio</p>
      </div>

      {/* Tarjetas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div
              className={`${card.color} p-4 rounded-2xl text-white text-3xl shadow-lg`}
            >
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                {card.label}
              </p>
              <p className="text-3xl font-black text-[#223c1f]">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sección de Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Porcentaje de Vencidos */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <RiPieChartLine className="text-2xl text-[#659d3a]" />
            <h3 className="text-xl font-bold text-[#223c1f]">
              Estado de Cobranza
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative size-48 mb-6">
              {/* Un gráfico circular simple con CSS */}
              <svg className="size-full" viewBox="0 0 36 36">
                <path
                  className="stroke-gray-100"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-red-500"
                  strokeWidth="3"
                  strokeDasharray={`${stats.porcentajeVencidos}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-red-500">
                  {stats.porcentajeVencidos}%
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  Vencidos
                </span>
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm italic">
              {stats.vencidos > 0
                ? `Hay ${stats.vencidos} socios con la cuota impaga o vencida.`
                : "¡Excelente! Todos los socios están al día."}
            </p>
          </div>
        </div>

        {/* Mensaje de Bienvenida / Tips */}
        <div className="bg-[#223c1f] p-8 rounded-3xl text-[#fbf4e4] flex flex-col justify-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">¡Hola, Administrador!</h2>
            <p className="text-[#659d3a] font-medium mb-6">
              Aquí tienes un resumen rápido de lo que sucede en tu gimnasio hoy.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-2 bg-[#659d3a] rounded-full"></div>
                <p className="text-sm">
                  Hoy ingresaron{" "}
                  <span className="font-bold">{stats.ingresosHoy}</span>{" "}
                  personas.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2 bg-yellow-500 rounded-full"></div>
                <p className="text-sm">
                  Recuerda revisar la lista de{" "}
                  <span className="font-bold">vencidos</span> semanalmente.
                </p>
              </div>
            </div>
          </div>
          {/* Un detalle decorativo atrás */}
          <div className="absolute -right-10 -bottom-10 size-40 bg-[#659d3a] opacity-20 rounded-full"></div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
