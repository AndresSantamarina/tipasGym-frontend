import { useEffect, useState } from "react";
import axios from "axios";
import {
  RiHistoryLine,
  RiTimeLine,
  RiCalendarLine,
  RiSearchLine,
  RiDeleteBin7Line,
} from "react-icons/ri";
import AdminLayout from "../layouts/AdminLayout";
import clientAxios from "../api/clientAxios";

const AccessHistory = () => {
  const [logs, setLogs] = useState([]);
  const [searchDni, setSearchDni] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await clientAxios.get(
          "/clients/history",
          {
            headers: { "x-auth-token": token },
          },
        );
        setLogs(res.data);
      } catch (error) {
        console.error("Error al cargar historial", error);
      }
    };
    fetchHistory();
  }, [token]);

  // Lógica de filtrado por DNI
  const filteredLogs = logs.filter((log) => log.dni.includes(searchDni));

  return (
    <AdminLayout>
      {/* Encabezado y Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#223c1f] flex items-center gap-3">
            <RiHistoryLine /> Historial de Accesos
          </h1>
          <p className="text-gray-600">Monitoreo de ingresos al gimnasio</p>
        </div>

        <div className="relative w-full md:w-80">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
          <input
            type="text"
            placeholder="Filtrar por DNI..."
            value={searchDni}
            onChange={(e) => setSearchDni(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#659d3a] outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#223c1f] text-white">
              <tr>
                <th className="p-5 font-semibold">Cliente</th>
                <th className="p-5 font-semibold">DNI</th>
                <th className="p-5 font-semibold">Fecha</th>
                <th className="p-5 font-semibold">Hora</th>
                <th className="p-5 font-semibold">Estado de Socio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-[#fbf4e4]/30 transition-colors"
                  >
                    <td className="p-5">
                      <div className="font-bold text-[#223c1f]">
                        {log.nombre}
                      </div>
                    </td>
                    <td className="p-5 text-gray-500 font-medium">{log.dni}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-gray-700">
                        <RiCalendarLine className="text-[#659d3a]" />
                        {new Date(log.fecha).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-gray-700">
                        <RiTimeLine className="text-[#659d3a]" />
                        {new Date(log.fecha).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="p-5">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider ${
                          log.statusAlIngresar === "ACTIVO"
                            ? "bg-[#659d3a]/20 text-[#659d3a]"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {log.statusAlIngresar}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <RiSearchLine size={40} className="opacity-20" />
                      <p className="text-lg font-medium">
                        No se encontraron registros para "{searchDni}"
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AccessHistory;
