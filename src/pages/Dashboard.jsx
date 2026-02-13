import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  RiUserSharedLine,
  RiUserUnfollowLine,
  RiUserFollowLine,
  RiLoginBoxLine,
  RiPieChartLine,
  RiRunLine,
  RiDropLine,
  RiHandCoinLine,
} from "react-icons/ri";
import { TbMoodKidFilled } from "react-icons/tb";
import { CgGym } from "react-icons/cg";
import { motion } from "framer-motion";
import clientAxios from "../api/clientAxios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    activosGym: 0,
    activosNatacion: 0,
    activosKids: 0,
    activosProfe: 0,
    cuotasParciales: 0,
    totalVencidos: 0,
    ingresosHoy: 0,
    montoPendiente: 0,
    semaforo: {
      verde: 0,
      amarillo: 0,
      rojo: 0,
      pVerde: 0,
      pAmarillo: 0,
      pRojo: 0,
    },
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
      filter: "Todos",
    },
    {
      label: "Socios Gym",
      value: stats.activosGym,
      icon: <CgGym />,
      color: "bg-orange-500",
      filter: "Gym",
    },
    {
      label: "Socios Natación",
      value: stats.activosNatacion,
      icon: <RiDropLine />,
      color: "bg-cyan-500",
      filter: "Natacion",
    },
    {
      label: "Socios Kids",
      value: stats.activosKids,
      icon: <TbMoodKidFilled />,
      color: "bg-pink-500",
      filter: "Kids",
    },
    {
      label: "Socios Profe",
      value: stats.activosProfe,
      icon: <RiRunLine />,
      color: "bg-purple-500",
      filter: "Profe",
    },
    {
      label: "Cuotas al día",
      value: stats.activos,
      icon: <RiUserFollowLine />,
      color: "bg-[#659d3a]",
      filter: "Activos",
    },
    {
      label: "Cuotas Parciales",
      value: stats.cuotasParciales,
      icon: <RiHandCoinLine />,
      color: "bg-yellow-500",
      filter: "Parciales",
    },
    {
      label: "Cuotas Vencidas",
      value: stats.totalVencidos,
      icon: <RiUserUnfollowLine />,
      color: "bg-red-500",
      filter: "Vencidos",
    },
    {
      label: "Ingresos Hoy",
      value: stats.ingresosHoy,
      icon: <RiLoginBoxLine />,
      color: "bg-[#223c1f]",
      path: "/admin/historial",
    },
  ];
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#223c1f]">Panel de Control</h1>
        <p className="text-gray-600">Resumen general del estado del gimnasio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {" "}
        {cards.map((card, index) => (
          <motion.div
            key={index}
            onClick={() => {
              if (card.path) {
                navigate(card.path);
              } else {
                navigate("/admin/clientes", { state: { filter: card.filter } });
              }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{
              y: -5,
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow duration-300"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <RiPieChartLine className="text-2xl text-[#659d3a]" />
            <h3 className="text-xl font-bold text-[#223c1f]">
              Estado de Cobranza
            </h3>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full h-12 bg-gray-100 rounded-2xl overflow-hidden flex mb-8 shadow-inner">
              <div
                style={{ width: `${stats.semaforo.pVerde}%` }}
                className="bg-[#659d3a] h-full transition-all duration-1000 flex items-center justify-center text-white text-[10px] font-bold"
              >
                {stats.semaforo.pVerde > 10 && `${stats.semaforo.pVerde}%`}
              </div>
              <div
                style={{ width: `${stats.semaforo.pAmarillo}%` }}
                className="bg-yellow-400 h-full transition-all duration-1000 flex items-center justify-center text-yellow-900 text-[10px] font-bold"
              >
                {stats.semaforo.pAmarillo > 10 &&
                  `${stats.semaforo.pAmarillo}%`}
              </div>
              <div
                style={{ width: `${stats.semaforo.pRojo}%` }}
                className="bg-red-500 h-full transition-all duration-1000 flex items-center justify-center text-white text-[10px] font-bold"
              >
                {stats.semaforo.pRojo > 10 && `${stats.semaforo.pRojo}%`}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="text-center p-3 rounded-2xl bg-green-50 border border-green-100">
                <p className="text-[#659d3a] font-black text-xl">
                  {stats.semaforo.verde}
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Al día
                </p>
              </div>
              <div className="text-center p-3 rounded-2xl bg-yellow-50 border border-yellow-100">
                <p className="text-yellow-600 font-black text-xl">
                  {stats.semaforo.amarillo}
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Parcial
                </p>
              </div>
              <div className="text-center p-3 rounded-2xl bg-red-50 border border-red-100">
                <p className="text-red-500 font-black text-xl">
                  {stats.semaforo.rojo}
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Deuda Total
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-gray-400 text-xs italic">
              Se consideran{" "}
              <span className="text-yellow-600 font-bold">Parciales</span> a los
              socios que tienen deudas pendientes (dentro del periodo de gracia)
              pero siguen habilitados, o a socios que tienen al menos uno de sus
              servicios en deuda.
            </p>
          </div>
        </div>
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
              <div className="flex items-center gap-3">
                <div className="size-2 bg-emerald-400 rounded-full"></div>
                <p className="text-sm">
                  Hay un total de{" "}
                  <span className="font-bold">
                    ${stats.montoPendiente?.toLocaleString("es-AR")}
                  </span>{" "}
                  por cobrar.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 size-40 bg-[#659d3a] opacity-20 rounded-full"></div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
