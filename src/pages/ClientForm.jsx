import { useForm } from "react-hook-form";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AdminLayout from "../layouts/AdminLayout";
import { RiSaveLine, RiArrowGoBackLine } from "react-icons/ri";

const ClientForm = () => {
  const { id } = useParams(); // Para saber si editamos
  const location = useLocation(); // Para traer datos si vienen de la lista
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Si estamos editando, cargamos los valores por defecto
  const isEdit = Boolean(id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: isEdit
      ? location.state
      : { servicios: { gym: true, natacion: false } },
  });

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/clients/${id}`, data, {
          headers: { "x-auth-token": token },
        });
        Swal.fire("¡Actualizado!", "Datos guardados correctamente", "success");
      } else {
        await axios.post("http://localhost:5000/api/clients", data, {
          headers: { "x-auth-token": token },
        });
        Swal.fire("¡Creado!", "Nuevo socio registrado por 30 días", "success");
      }
      navigate("/admin/clientes");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.msg || "Error al guardar",
        "error",
      );
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#223c1f] mb-6 font-bold hover:underline"
        >
          <RiArrowGoBackLine /> Volver
        </button>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-[#223c1f] mb-8">
            {isEdit ? "Editar Socio" : "Registrar Nuevo Socio"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#223c1f] mb-2">
                  Nombre Completo
                </label>
                <input
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                  })}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#659d3a] outline-none"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#223c1f] mb-2">
                  DNI
                </label>
                <input
                  {...register("dni", { required: "El DNI es obligatorio" })}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#659d3a] outline-none"
                  disabled={isEdit} // Normalmente el DNI no se cambia
                />
                {errors.dni && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dni.message}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-[#fbf4e4] p-4 rounded-2xl">
              <label className="block text-sm font-bold text-[#223c1f] mb-4">
                Servicios contratados
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* OPCIONES DE GIMNASIO */}
                <div className="bg-[#fbf4e4] p-5 rounded-2xl border border-gray-100">
                  <label className="block text-[#223c1f] font-black mb-3 uppercase text-xs tracking-widest">
                    Gimnasio
                  </label>
                  <div className="space-y-3">
                    {["No", "3 Días", "5 Días"].map((opcion) => (
                      <label
                        key={opcion}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          value={opcion}
                          {...register("servicios.gym")}
                          className="size-5 accent-[#659d3a]"
                        />
                        <span className="text-[#223c1f] group-hover:font-bold transition-all">
                          {opcion}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* OPCIONES DE NATACIÓN */}
                <div className="bg-[#fbf4e4] p-5 rounded-2xl border border-gray-100">
                  <label className="block text-[#223c1f] font-black mb-3 uppercase text-xs tracking-widest">
                    Natación
                  </label>
                  <div className="space-y-3">
                    {["No", "2 Días", "3 Días"].map((opcion) => (
                      <label
                        key={opcion}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          value={opcion}
                          {...register("servicios.natacion")}
                          className="size-5 accent-[#659d3a]"
                        />
                        <span className="text-[#223c1f] group-hover:font-bold transition-all">
                          {opcion}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#659d3a] hover:bg-[#223c1f] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <RiSaveLine size={24} />
              {isEdit ? "Guardar Cambios" : "Registrar Socio"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ClientForm;
