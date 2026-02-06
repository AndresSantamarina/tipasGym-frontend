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

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("Todos");
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

  const handleRenew = async (id) => {
    Swal.fire({
      title: "¿Renovar suscripción?",
      text: "Se sumarán 30 días de acceso.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#659d3a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, renovar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await clientAxios.put(`/clients/renew/${id}`);
          setClients(clients.map((c) => (c._id === id ? res.data.client : c)));
          Swal.fire("¡Renovado!", "Fecha actualizada con éxito", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo renovar", "error");
        }
      }
    });
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.dni.includes(searchTerm);

    const hasGym = c.servicios.gym !== "No";
    const hasNata = c.servicios.natacion !== "No";

    let matchesService = true;
    if (serviceFilter === "Gym") matchesService = hasGym;
    if (serviceFilter === "Natacion") matchesService = hasNata;
    if (serviceFilter === "Ambos") matchesService = hasGym && hasNata;

    return matchesSearch && matchesService;
  });

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[#223c1f]">Gestión de Socios</h1>
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
              <option value="Todos">Todos los Servicios</option>
              <option value="Gym">Solo Gym</option>
              <option value="Natacion">Solo Natación</option>
              <option value="Ambos">Gym + Natación</option>
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
              <th className="p-4">Vencimiento</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentClients.map((client) => {
              const isExpired = new Date(client.fechaVencimiento) < new Date();
              return (
                <tr
                  key={client._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-medium text-[#223c1f]">
                    {client.nombre}
                  </td>
                  <td className="p-4 text-gray-600">{client.dni}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {client.servicios.gym !== "No" && (
                        <span className="text-[10px] bg-[#659d3a]/10 text-[#659d3a] px-2 py-0.5 rounded-md font-bold border border-[#659d3a]/20">
                          GYM: {client.servicios.gym}
                        </span>
                      )}
                      {client.servicios.natacion !== "No" && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold border border-blue-200">
                          NATA: {client.servicios.natacion}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(client.fechaVencimiento).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isExpired
                          ? "bg-red-100 text-red-600"
                          : "bg-[#659d3a]/20 text-[#659d3a]"
                      }`}
                    >
                      {isExpired ? "VENCIDO" : "ACTIVO"}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleRenew(client._id)}
                      title="Renovar 30 días"
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
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <RiEditLine size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <RiDeleteBin7Line size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
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
