import { useForm } from "react-hook-form";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import AdminLayout from "../layouts/AdminLayout";
import { RiSaveLine } from "react-icons/ri";
import clientAxios from "../api/clientAxios";

const ClientForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const getInitialValue = (serviceData) => serviceData?.modalidad || "No";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: isEdit
      ? {
          nombre: location.state.nombre,
          dni: location.state.dni,
          servicios: {
            gym: getInitialValue(location.state.servicios.gym),
            natacion: getInitialValue(location.state.servicios.natacion),
          },
        }
      : {
          nombre: "",
          dni: "",
          servicios: { gym: "No", natacion: "No" },
        },
  });

  const onSubmit = async (data) => {

    if (data.servicios.gym === "No" && data.servicios.natacion === "No") {
      return Swal.fire({
        icon: "error",
        title: "Selección requerida",
        text: "Debes elegir al menos un servicio (Gimnasio o Natación) para registrar al socio.",
        confirmButtonColor: "#223c1f",
      });
    }
    
    try {
      const payload = {
        nombre: data.nombre,
        dni: data.dni,
        servicios: {
          gym: { modalidad: data.servicios.gym },
          natacion: { modalidad: data.servicios.natacion },
        },
      };

      if (isEdit) {
        await clientAxios.put(`/clients/${id}`, payload);
        Swal.fire("¡Actualizado!", "Datos guardados", "success");
      } else {
        await clientAxios.post("/clients", payload);
        Swal.fire("¡Creado!", "Socio registrado por 30 días", "success");
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
                  {...register("dni", {
                    required: "El DNI es obligatorio",
                    pattern: {
                      value: /^[0-9]{8}$/,
                      message: "El DNI debe tener exactamente 8 números",
                    },
                  })}
                  type="text"
                  maxLength={8}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#659d3a] outline-none"
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
