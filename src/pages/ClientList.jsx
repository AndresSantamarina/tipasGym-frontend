import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  RiEditLine,
  RiDeleteBin7Line,
  RiSearchLine,
  RiRefreshLine,
  RiFilter3Line,
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
    const inputOptions = {};
    if (client.servicios.gym.modalidad !== "No") {
      inputOptions.gym = "🏋️ Gimnasio";
    }
    if (client.servicios.natacion.modalidad !== "No") {
      inputOptions.natacion = "🏊 Natación";
    }

    if (Object.keys(inputOptions).length === 0) {
      Swal.fire("Error", "Este cliente no tiene servicios activos", "info");
      return;
    }
    const { value: servicioSeleccionado } = await Swal.fire({
      title: "Renovar Suscripción",
      text: "Selecciona qué servicio quieres renovar por 30 días:",
      input: "radio",
      inputOptions: inputOptions,
      inputValidator: (value) => {
        if (!value) {
          return "Debes seleccionar una opción";
        }
      },
      showCancelButton: true,
      confirmButtonColor: "#659d3a",
      confirmButtonText: "Renovar",
    });

    if (servicioSeleccionado) {
      try {
        const res = await clientAxios.put(`/clients/renew/${client._id}`, {
          servicio: servicioSeleccionado,
        });
        setClients((prevClients) =>
          prevClients.map((c) => (c._id === client._id ? res.data.client : c)),
        );
        Swal.fire({
          title: "¡Renovado!",
          text: res.data.msg,
          icon: "success",
          confirmButtonColor: "#659d3a",
        });
      } catch (error) {
        Swal.fire("Error", "No se pudo procesar la renovación", "error");
      }
    }
  };

  const filteredClients = clients.filter((c) => {
    const hoy = new Date();
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.dni.includes(searchTerm);
    const hasGym = c.servicios.gym.modalidad !== "No";
    const hasNata = c.servicios.natacion.modalidad !== "No";
    const gymVencido =
      hasGym &&
      (!c.servicios.gym.vencimiento ||
        new Date(c.servicios.gym.vencimiento) < hoy);
    const nataVencida =
      hasNata &&
      (!c.servicios.natacion.vencimiento ||
        new Date(c.servicios.natacion.vencimiento) < hoy);
    const gymActivo = hasGym && !gymVencido;
    const nataActiva = hasNata && !nataVencida;

    let matchesFilter = true;

    if (serviceFilter === "Gym") matchesFilter = gymActivo;
    if (serviceFilter === "Natacion") matchesFilter = nataActiva;
    if (serviceFilter === "Ambos") matchesFilter = hasGym && hasNata;
    if (serviceFilter === "Activos") {
      const totalContratados = (hasGym ? 1 : 0) + (hasNata ? 1 : 0);
      const totalActivos = (gymActivo ? 1 : 0) + (nataActiva ? 1 : 0);
      matchesFilter = totalContratados > 0 && totalActivos === totalContratados;
    }
    if (serviceFilter === "Vencidos") {
      matchesFilter = gymVencido || nataVencida;
    }
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const RenderDate = ({ date, label }) => {
    if (!date) return null;
    const isExpired = new Date(date) < new Date();
    return (
      <div
        className={`text-xs flex justify-between gap-2 px-2 py-1 rounded ${isExpired ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}
      >
        <span className="font-bold">{label}:</span>
        <span>{new Date(date).toLocaleDateString()}</span>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[#223c1f]">
          {serviceFilter === "Vencidos"
            ? "Socios con Deuda"
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
              <option value="Activos">Socios al Día</option>
              <option value="Vencidos">Con Deuda (Parcial/Total)</option>
              <option value="Gym">Activos en Gym</option>
              <option value="Natacion">Activos en Natación</option>
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

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#223c1f] text-white">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">DNI</th>
              <th className="p-4">Servicios</th>
              <th className="p-4">Vencimientos</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <RiSearchLine size={48} className="mb-4 opacity-20" />
                    <p className="text-xl font-medium">
                      No se encontraron coincidencias
                    </p>
                    <p className="text-sm">
                      Intenta con otro nombre, DNI o cambia el filtro.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentClients.map((client) => (
                <tr
                  key={client._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-medium text-[#223c1f]">
                    {client.nombre}
                  </td>
                  <td className="p-4 text-gray-600">{client.dni}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 items-start">
                      {client.servicios.gym.modalidad !== "No" && (
                        <span className="text-[10px] bg-[#659d3a]/10 text-[#659d3a] px-2 py-0.5 rounded-md font-bold border border-[#659d3a]/20">
                          GYM ({client.servicios.gym.modalidad})
                        </span>
                      )}
                      {client.servicios.natacion.modalidad !== "No" && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold border border-blue-200">
                          NATA ({client.servicios.natacion.modalidad})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {client.servicios.gym.modalidad !== "No" && (
                        <RenderDate
                          date={client.servicios.gym.vencimiento}
                          label="GYM"
                        />
                      )}
                      {client.servicios.natacion.modalidad !== "No" && (
                        <RenderDate
                          date={client.servicios.natacion.vencimiento}
                          label="NATA"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleRenew(client)}
                      title="Renovar suscripción"
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
                      title="Editar cliente"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <RiEditLine size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      title="Eliminar cliente"
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
        {totalPages > 1 && (
          <div className="p-4 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <span className="text-sm text-gray-500 font-medium">
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, filteredClients.length)} de{" "}
              {filteredClients.length} socios
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 bg-white border rounded-xl disabled:opacity-30 font-bold text-sm shadow-sm"
              >
                Anterior
              </button>
              <div className="flex items-center px-4 bg-[#223c1f] text-white rounded-xl text-sm font-bold">
                {currentPage} / {totalPages}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 bg-white border rounded-xl disabled:opacity-30 font-bold text-sm shadow-sm"
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

export default ClientList;
