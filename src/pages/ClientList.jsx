import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  RiEditLine,
  RiDeleteBin7Line,
  RiSearchLine,
  RiRefreshLine,
  RiFilter3Line,
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine,
} from "react-icons/ri";
import AdminLayout from "../layouts/AdminLayout";
import clientAxios from "../api/clientAxios";
import { useLocation } from "react-router-dom";

const ClientList = () => {
  const location = useLocation();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState(
    location.state?.filter || "Todos",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await clientAxios.get("/clients");
      setClients(res.data);
    } catch (error) {
      console.error("Error al obtener clientes", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#223c1f",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await clientAxios.delete(`/clients/${id}`);
          setClients(clients.filter((c) => c._id !== id));
          Swal.fire("Eliminado", "El cliente ha sido borrado.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar", "error");
        }
      }
    });
  };

  const handleRenew = async (client) => {
    const serviciosActivos = Object.keys(client.servicios).filter(
      (key) => client.servicios[key].modalidad !== "No",
    );

    if (serviciosActivos.length === 0) {
      return Swal.fire(
        "Error",
        "Este cliente no tiene servicios activos",
        "info",
      );
    }

    const { value: formValues } = await Swal.fire({
      title: "Renovar Suscripción",
      html: `
        <div class="flex flex-col gap-4 text-left">
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase">Servicio a renovar</label>
            <select id="swal-service" class="swal2-input w-full m-0">
              ${serviciosActivos.map((s) => `<option value="${s}">${s.toUpperCase()}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase">Precio Total ($)</label>
            <input id="swal-total" type="number" class="swal2-input w-full m-0" placeholder="Ej: 30000">
          </div>
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase">Monto que paga hoy ($)</label>
            <input id="swal-paid" type="number" class="swal2-input w-full m-0" placeholder="Ej: 15000">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#659d3a",
      confirmButtonText: "Renovar",
      preConfirm: () => {
        const total = document.getElementById("swal-total").value;
        const paid = document.getElementById("swal-paid").value;
        if (!total || !paid) {
          Swal.showValidationMessage("Por favor completa todos los campos");
        }
        return {
          servicio: document.getElementById("swal-service").value,
          precioTotal: Number(total),
          montoPagado: Number(paid),
        };
      },
    });

    if (formValues) {
      try {
        const res = await clientAxios.put(
          `/clients/renew/${client._id}`,
          formValues,
        );
        setClients(
          clients.map((c) => (c._id === client._id ? res.data.client : c)),
        );
        Swal.fire("¡Éxito!", "Suscripción renovada por 30 días", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo renovar", "error");
      }
    }
  };

  const getStatus = (servicio) => {
    if (servicio.modalidad === "No") return null;
    const hoy = new Date();
    const vencimiento = new Date(servicio.vencimiento);
    const inicio = new Date(servicio.inicio);
    const fechaLimiteGracia = new Date(inicio);
    fechaLimiteGracia.setDate(fechaLimiteGracia.getDate() + 12);

    if (hoy > vencimiento)
      return {
        label: "VENCIDO",
        color: "text-red-600 bg-red-50 border-red-100",
      };
    if (servicio.montoPagado >= servicio.precioTotal)
      return {
        label: "AL DÍA",
        color: "text-green-600 bg-green-50 border-green-100",
      };
    if (hoy <= fechaLimiteGracia)
      return {
        label: "GRACIA",
        color: "text-amber-600 bg-amber-50 border-amber-100",
      };

    return {
      label: "DEUDA",
      color: "text-red-600 bg-red-50 border-red-100 font-black",
    };
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.dni.includes(searchTerm);
    if (serviceFilter === "Todos") return matchesSearch;

    const servicios = Object.values(c.servicios).filter(
      (s) => s.modalidad !== "No",
    );

    if (serviceFilter === "Vencidos") {
      return (
        matchesSearch &&
        servicios.some((s) => {
          const status = getStatus(s);
          return status.label === "VENCIDO" || status.label === "DEUDA";
        })
      );
    }

    if (serviceFilter === "Parciales") {
      return (
        matchesSearch &&
        servicios.some((s) => {
          const status = getStatus(s);
          return status.label === "GRACIA";
        })
      );
    }

    if (serviceFilter === "Activos") {
      return (
        matchesSearch &&
        servicios.some((s) => {
          const status = getStatus(s);
          return status.label === "AL DÍA";
        })
      );
    }

    if (serviceFilter === "Gym")
      return matchesSearch && c.servicios.gym.modalidad !== "No";
    if (serviceFilter === "Natacion")
      return matchesSearch && c.servicios.natacion.modalidad !== "No";
    if (serviceFilter === "Kids")
      return matchesSearch && c.servicios.kids.modalidad !== "No";
    if (serviceFilter === "Profe")
      return matchesSearch && c.servicios.profe.modalidad !== "No";

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const currentClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[#223c1f]">
          {serviceFilter === "Vencidos"
            ? "Socios con Deuda / Vencidos"
            : "Gestión de Socios"}
        </h1>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <RiFilter3Line className="absolute left-3 top-3 text-gray-400" />
            <select
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 p-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#659d3a] outline-none bg-white appearance-none pr-8 cursor-pointer"
            >
              <option value="Todos">Todos los Socios</option>
              <option value="Activos">Al día</option>
              <option value="Parciales">Parciales</option>
              <option value="Vencidos">Vencidos</option>
              <option value="Gym">Inscriptos en Gym</option>
              <option value="Natacion">Inscriptos en Natación</option>
              <option value="Kids">Inscriptos en Kids</option>
              <option value="Profe">Inscriptos con Profe</option>
            </select>
          </div>
          <div className="relative w-full md:w-64">
            <RiSearchLine className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Nombre o DNI..."
              className="pl-10 p-2 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#659d3a] outline-none"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-[#223c1f] text-white">
              <tr>
                <th className="p-4">Socio</th>
                <th className="p-4">Servicios</th>
                <th className="p-4">Pagos</th>
                <th className="p-4">Vencimiento</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentClients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-400">
                    No hay socios que coincidan.
                  </td>
                </tr>
              ) : (
                currentClients.map((client) => (
                  <tr
                    key={client._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-[#223c1f]">
                        {client.nombre}
                      </div>
                      <div className="text-xs text-gray-500">
                        DNI: {client.dni}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(client.servicios).map(
                          ([key, s]) =>
                            s.modalidad !== "No" && (
                              <span
                                key={key}
                                className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold uppercase"
                              >
                                {key}: {s.modalidad}
                              </span>
                            ),
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {Object.entries(client.servicios).map(([key, s]) => {
                        const status = getStatus(s);
                        if (!status) return null;
                        return (
                          <div
                            key={key}
                            className={`text-[10px] mb-1 p-1 px-2 rounded border flex justify-between ${status.color}`}
                          >
                            <span className="font-bold">
                              {key.toUpperCase()}- Pago:{" "}
                              {s.fechaPago
                                ? new Date(s.fechaPago).toLocaleDateString()
                                : "N/A"}
                            </span>
                            <span>
                              ${s.montoPagado} de ${s.precioTotal}
                            </span>
                          </div>
                        );
                      })}
                    </td>
                    <td className="p-4 text-[11px]">
                      {Object.entries(client.servicios).map(
                        ([key, s]) =>
                          s.modalidad !== "No" && (
                            <div key={key} className="mb-1">
                              <span className="font-bold opacity-70">
                                {key.toUpperCase()}:
                              </span>{" "}
                              <span>
                                {new Date(s.inicio).toLocaleDateString()} al{" "}
                                {new Date(s.vencimiento).toLocaleDateString()}
                              </span>{" "}
                            </div>
                          ),
                      )}
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleRenew(client)}
                        title="Renovar"
                        className="p-2 text-[#659d3a] hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <RiRefreshLine size={20} />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/editar/${client._id}`, {
                            state: client,
                          })
                        }
                        title="Editar"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <RiEditLine size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(client._id)}
                        title="Eliminar"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <RiDeleteBin7Line size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
                {Math.min(currentPage * itemsPerPage, filteredClients.length)}
              </span>{" "}
              de{" "}
              <span className="text-[#223c1f] font-bold">
                {filteredClients.length}
              </span>{" "}
              socios
            </p>
            <div className="flex items-center gap-1 md:gap-2 order-1 sm:order-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-2 bg-white border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm text-[#223c1f]"
                title="Primera página"
              >
                <RiArrowLeftDoubleLine size={18} />
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-30 text-xs md:text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors text-[#223c1f]"
              >
                Anterior
              </button>
              <div className="flex items-center px-3 md:px-4 h-9 bg-[#223c1f] text-white rounded-xl text-xs md:text-sm font-bold shadow-md">
                {currentPage} / {totalPages}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-30 text-xs md:text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors text-[#223c1f]"
              >
                Siguiente
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-2 bg-white border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm text-[#223c1f]"
                title="Última página"
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

export default ClientList;
