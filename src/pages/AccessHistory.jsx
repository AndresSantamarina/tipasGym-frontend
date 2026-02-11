import { useEffect, useState } from "react";
import {
  RiHistoryLine,
  RiTimeLine,
  RiCalendarLine,
  RiSearchLine,
  RiDeleteBin7Line,
} from "react-icons/ri";
import AdminLayout from "../layouts/AdminLayout";
import clientAxios from "../api/clientAxios";
import Swal from "sweetalert2";

const AccessHistory = () => {
  const [logs, setLogs] = useState([]);
  const [searchDni, setSearchDni] = useState("");
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await clientAxios.get("/clients/history", {
          headers: { "x-auth-token": token },
        });
        setLogs(res.data);
      } catch (error) {
        console.error("Error al cargar historial", error);
      }
    };
    fetchHistory();
  }, [token]);

  const RenderDate = ({ date, label }) => {
    if (!date) return null;
    const isExpired = new Date(date) < new Date();
    return (
      <div
        className={`text-[10px] flex justify-between gap-2 px-2 py-0.5 rounded mb-1 ${
          isExpired
            ? "bg-red-50 text-red-600 border border-red-100"
            : "bg-green-50 text-green-700 border border-green-100"
        }`}
      >
        <span className="font-bold">{label}:</span>
        <span>{new Date(date).toLocaleDateString()}</span>
      </div>
    );
  };

  const RenderStartDate = ({ date, label }) => {
    if (!date) return null;
    return (
      <div className="text-[10px] flex justify-between gap-2 px-2 py-0.5 rounded mb-1 bg-blue-50 text-blue-700 border border-blue-100">
        <span className="font-bold">{label} INICIO:</span>
        <span>{new Date(date).toLocaleDateString()}</span>
      </div>
    );
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.nombre.toLowerCase().includes(searchDni.toLowerCase()) ||
      log.dni.includes(searchDni),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handleCleanHistory = async () => {
    Swal.fire({
      title: "¿Limpiar registros viejos?",
      text: "Se borrarán los ingresos de hace más de 7 días.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Sí, limpiar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await clientAxios.delete("/clients/history/clean");
          const res = await clientAxios.get("/clients/history");
          setLogs(res.data);
          setCurrentPage(1);
          Swal.fire("Limpiado", "Base de datos optimizada", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo limpiar", "error");
        }
      }
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#223c1f] flex items-center gap-3">
            <RiHistoryLine /> Historial de Accesos
          </h1>
          <p className="text-gray-600">Monitoreo de ingresos al gimnasio</p>
          <button
            onClick={handleCleanHistory}
            className="text-xs text-red-500 font-bold hover:underline mt-2 flex items-center gap-1"
          >
            <RiDeleteBin7Line /> MANTENIMIENTO: BORRAR MÁS DE 7 DÍAS
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
          <input
            type="text"
            placeholder="Filtrar por nombre o DNI..."
            value={searchDni}
            onChange={(e) => {
              setSearchDni(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#659d3a] outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-[#223c1f] text-white">
              <tr>
                <th className="p-4 md:p-5 font-semibold">Cliente</th>
                <th className="p-4 md:p-5 font-semibold">DNI</th>
                <th className="p-4 md:p-5 font-semibold">Fecha</th>
                <th className="p-4 md:p-5 font-semibold">Hora</th>
                <th className="p-4 md:p-5 font-semibold text-sm">Servicios</th>
                <th className="p-4 md:p-5 font-semibold">Vencimientos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length > 0 ? (
                currentItems.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-[#fbf4e4]/30 transition-colors"
                  >
                    <td className="p-4 md:p-5 font-bold text-[#223c1f]">
                      {log.nombre}
                    </td>
                    <td className="p-4 md:p-5 text-gray-500">{log.dni}</td>
                    <td className="p-4 md:p-5 text-gray-700">
                      <span className="flex items-center gap-1">
                        <RiCalendarLine className="text-[#659d3a]" />
                        {new Date(log.fecha).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 md:p-5 text-gray-700">
                      <span className="flex items-center gap-1 font-bold">
                        <RiTimeLine className="text-[#659d3a]" />
                        {new Date(log.fecha).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        hs
                      </span>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex flex-col gap-1 items-start">
                        {log.clientDetails?.servicios?.gym?.modalidad !==
                          "No" && (
                          <span className="text-[10px] bg-[#659d3a]/10 text-[#659d3a] px-2 py-0.5 rounded-md font-bold border border-[#659d3a]/20">
                            GYM ({log.clientDetails.servicios.gym.modalidad})
                          </span>
                        )}
                        {log.clientDetails?.servicios?.natacion?.modalidad !==
                          "No" && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold border border-blue-200">
                            NATA (
                            {log.clientDetails.servicios.natacion.modalidad})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="w-48">
                        {log.clientDetails?.servicios?.gym?.modalidad !==
                          "No" && (
                          <>
                            <RenderStartDate
                              date={log.clientDetails.servicios.gym.inicio}
                              label="GYM"
                            />
                            <RenderDate
                              date={log.clientDetails.servicios.gym.vencimiento}
                              label="GYM VENCE"
                            />
                          </>
                        )}
                        {log.clientDetails?.servicios?.natacion?.modalidad !==
                          "No" && (
                          <>
                            <RenderStartDate
                              date={log.clientDetails.servicios.natacion.inicio}
                              label="NATA"
                            />
                            <RenderDate
                              date={
                                log.clientDetails.servicios.natacion.vencimiento
                              }
                              label="NATA VENCE"
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <RiSearchLine size={40} className="opacity-20" />
                      <p className="text-lg font-medium">
                        No se encontraron registros
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs md:text-sm text-gray-500 font-medium order-2 sm:order-1">
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, filteredLogs.length)} de{" "}
              {filteredLogs.length} ingresos
            </p>

            <div className="flex gap-2 order-1 sm:order-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-2 md:px-4 bg-white border border-gray-200 rounded-xl disabled:opacity-30 text-xs md:text-sm font-bold shadow-sm"
              >
                Anterior
              </button>
              <div className="flex items-center px-3 md:px-4 bg-[#223c1f] text-white rounded-xl text-xs md:text-sm font-bold">
                {currentPage} / {totalPages}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-2 md:px-4 bg-white border border-gray-200 rounded-xl disabled:opacity-30 text-xs md:text-sm font-bold shadow-sm"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AccessHistory;
