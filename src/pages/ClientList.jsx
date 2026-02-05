import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  RiEditLine,
  RiDeleteBin7Line,
  RiSearchLine,
  RiRefreshLine,
} from "react-icons/ri";
import AdminLayout from "../layouts/AdminLayout";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clients", {
        headers: { "x-auth-token": token },
      });
      setClients(res.data);
    } catch (error) {
      console.error(error);
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
          // Nota: Asegúrate de tener la ruta DELETE en tu backend
          await axios.delete(`http://localhost:5000/api/clients/${id}`, {
            headers: { "x-auth-token": token },
          });
          setClients(clients.filter((c) => c._id !== id));
          Swal.fire("Eliminado", "El cliente ha sido borrado.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar", "error");
        }
      }
    });
  };

  const filteredClients = clients.filter((c) => c.dni.includes(searchTerm));

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#223c1f]">
          Gestión de Clientes
        </h1>
        <div className="relative w-64">
          <RiSearchLine className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por DNI..."
            className="pl-10 p-2 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#659d3a] outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
          <tbody>
            {filteredClients.map((client) => {
              const isExpired = new Date(client.fechaVencimiento) < new Date();
              return (
                <tr
                  key={client._id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
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
                      className={`px-3 py-1 rounded-full text-xs font-bold ${isExpired ? "bg-red-100 text-red-600" : "bg-[#659d3a]/20 text-[#659d3a]"}`}
                    >
                      {isExpired ? "VENCIDO" : "ACTIVO"}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
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
      </div>
    </AdminLayout>
  );
};

export default ClientList;
