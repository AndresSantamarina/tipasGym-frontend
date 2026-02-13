import { useEffect, useState } from "react";
import {
  RiHistoryLine,
  RiTimeLine,
  RiCalendarLine,
  RiSearchLine,
  RiDeleteBin7Line,
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine,
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

  const StatusBadge = ({ status }) => {
    const styles = {
      "ACTIVO TOTAL": "bg-green-100 text-green-700 border-green-200",
      "ACTIVO PARCIAL": "bg-yellow-100 text-yellow-700 border-yellow-200",
      VENCIDO: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      <span
        className={`text-[10px] px-2 py-0.5 rounded-full font-black border ${styles[status] || "bg-gray-100 text-gray-600"}`}
      >
        {status}
      </span>
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
      title: "¿Limpiar registros?",
      text: "Se borrarán los ingresos de hace más de 7 días.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Sí, limpiar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await clientAxios.delete("/clients/history/clean", {
            headers: { "x-auth-token": token },
          });
          const res = await clientAxios.get("/clients/history", {
            headers: { "x-auth-token": token },
          });
          setLogs(res.data);
          setCurrentPage(1);
          Swal.fire("Listo", "Historial optimizado", "success");
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
          <button
            onClick={handleCleanHistory}
            className="text-xs text-red-500 font-bold hover:underline mt-2 flex items-center gap-1 uppercase tracking-tighter"
          >
            <RiDeleteBin7Line /> Mantenimiento (Borrar +7 días)
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o DNI..."
            value={searchDni}
            onChange={(e) => {
              setSearchDni(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#659d3a] transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#223c1f] text-white">
              <tr>
                <th className="p-5">Socio</th>
                <th className="p-5 text-center">Estado al Ingresar</th>
                <th className="p-5">Fecha y Hora</th>
                <th className="p-5">Servicios Contratados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((log) => (
                <tr
                  key={log._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-5">
                    <p className="font-bold text-[#223c1f] uppercase">
                      {log.nombre}
                    </p>
                    <p className="text-xs text-gray-400">DNI: {log.dni}</p>
                  </td>
                  <td className="p-5 text-center">
                    <StatusBadge status={log.statusAlIngresar} />
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col text-sm text-gray-700">
                      <span className="flex items-center gap-1">
                        <RiCalendarLine className="text-[#659d3a]" />{" "}
                        {new Date(log.fecha).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 font-bold">
                        <RiTimeLine className="text-[#659d3a]" />{" "}
                        {new Date(log.fecha).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        hs
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {["gym", "natacion", "kids", "profe"].map((key) => {
                        const s = log.servicios?.[key];
                        if (!s || s.modalidad === "No") return null;

                        const isExpired = new Date(s.vencimiento) < new Date();

                        const colors = {
                          gym: "border-green-200 text-green-700",
                          natacion: "border-blue-200 text-blue-700",
                          kids: "border-purple-200 text-purple-700",
                          profe: "border-orange-200 text-orange-700",
                        };

                        return (
                          <div
                            key={key}
                            className={`flex flex-col border-l-4 p-2 rounded bg-gray-50 ${colors[key]}`}
                          >
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-[10px] font-black uppercase">
                                {key}: {s.modalidad}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[9px] font-medium text-gray-500 uppercase tracking-tighter">
                                Vence:
                              </span>
                              <span
                                className={`text-[10px] font-bold ${isExpired ? "text-red-500" : "text-gray-700"}`}
                              >
                                {new Date(s.vencimiento).toLocaleDateString()}
                              </span>
                              {isExpired && (
                                <span className="text-[8px] bg-red-100 text-red-600 px-1 rounded font-black">
                                  VENCIDO
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs md:text-sm text-gray-500 font-medium order-2 sm:order-1">
              Mostrando{" "}
              <span className="text-[#223c1f] font-bold">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              a{" "}
              <span className="text-[#223c1f] font-bold">
                {Math.min(currentPage * itemsPerPage, filteredLogs.length)}
              </span>{" "}
              de{" "}
              <span className="text-[#223c1f] font-bold">
                {filteredLogs.length}
              </span>{" "}
              ingresos
            </p>

            <div className="flex items-center gap-1 md:gap-2 order-1 sm:order-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-2 bg-white border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-gray-50 shadow-sm text-[#223c1f]"
              >
                <RiArrowLeftDoubleLine size={18} />
              </button>

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-30 text-xs md:text-sm font-bold shadow-sm hover:bg-gray-50 text-[#223c1f]"
              >
                Anterior
              </button>

              <div className="flex items-center px-3 md:px-4 h-9 bg-[#223c1f] text-white rounded-xl text-xs md:text-sm font-bold shadow-md">
                {currentPage} / {totalPages}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-30 text-xs md:text-sm font-bold shadow-sm hover:bg-gray-50 text-[#223c1f]"
              >
                Siguiente
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-2 bg-white border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-gray-50 shadow-sm text-[#223c1f]"
              >
                <RiArrowRightDoubleLine size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AccessHistory;
