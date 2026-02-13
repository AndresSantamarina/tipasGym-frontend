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
  const getInitialPrice = (serviceData) => serviceData?.precioTotal || 0;
  const getInitialPaid = (serviceData) => serviceData?.montoPagado || 0;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: isEdit
      ? {
          nombre: location.state.nombre,
          dni: location.state.dni,
          servicios: {
            gym: {
              modalidad: getInitialValue(location.state.servicios.gym),
              precioTotal: getInitialPrice(location.state.servicios.gym),
              montoPagado: getInitialPaid(location.state.servicios.gym),
            },
            natacion: {
              modalidad: getInitialValue(location.state.servicios.natacion),
              precioTotal: getInitialPrice(location.state.servicios.natacion),
              montoPagado: getInitialPaid(location.state.servicios.natacion),
            },
            kids: {
              modalidad: getInitialValue(location.state.servicios.kids),
              precioTotal: getInitialPrice(location.state.servicios.kids),
              montoPagado: getInitialPaid(location.state.servicios.kids),
            },
            profe: {
              modalidad: getInitialValue(location.state.servicios.profe),
              precioTotal: getInitialPrice(location.state.servicios.profe),
              montoPagado: getInitialPaid(location.state.servicios.profe),
            },
          },
        }
      : {
          nombre: "",
          dni: "",
          servicios: {
            gym: { modalidad: "No", precioTotal: 0, montoPagado: 0 },
            natacion: { modalidad: "No", precioTotal: 0, montoPagado: 0 },
            kids: { modalidad: "No", precioTotal: 0, montoPagado: 0 },
            profe: { modalidad: "No", precioTotal: 0, montoPagado: 0 },
          },
        },
  });

  const watchGym = watch("servicios.gym.modalidad");
  const watchNata = watch("servicios.natacion.modalidad");
  const watchKids = watch("servicios.kids.modalidad");
  const watchProfe = watch("servicios.profe.modalidad");

  const actualizarPrecioBase = (servicio, modalidad) => {
    const precios = {
      gym: { "3 Días": 25000, "5 Días": 30000, No: 0 },
      natacion: { "2 Días": 30000, "3 Días": 30000, No: 0 },
      kids: { "3 Días": 25000, No: 0 },
      profe: { "3 Días": 20000, No: 0 },
    };
    setValue(
      `servicios.${servicio}.precioTotal`,
      precios[servicio][modalidad] || 0,
    );
  };

  const onSubmit = async (data) => {
    const tieneServicio = Object.values(data.servicios).some(
      (s) => s.modalidad !== "No",
    );
    if (!tieneServicio) {
      return Swal.fire("Error", "Selecciona al menos un servicio", "error");
    }

    try {
      if (isEdit) {
        await clientAxios.put(`/clients/${id}`, data);
        Swal.fire("Actualizado", "Cliente guardado", "success");
      } else {
        await clientAxios.post("/clients", data);
        Swal.fire("Creado", "Cliente registrado con éxito", "success");
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

  const ServiceCard = ({ title, name, options, watchVal, color }) => (
    <div
      className={`p-4 rounded-2xl border ${watchVal !== "No" ? `bg-${color}-50 border-${color}-200` : "bg-gray-50 border-gray-100"}`}
    >
      <label className="block text-[#223c1f] font-black mb-3 uppercase text-xs tracking-widest">
        {title}
      </label>
      <div className="space-y-2 mb-4">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value={opt}
              {...register(`servicios.${name}.modalidad`)}
              onChange={(e) => {
                register(`servicios.${name}.modalidad`).onChange(e);
                actualizarPrecioBase(name, e.target.value);
              }}
              className="accent-[#659d3a]"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
      {watchVal !== "No" && (
        <div className="space-y-2 pt-2 border-t border-gray-200">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500">
              PRECIO TOTAL (EDITABLE PARA PROMOS)
            </span>
            <input
              type="number"
              {...register(`servicios.${name}.precioTotal`)}
              className="w-full p-1 text-sm rounded border border-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500">
              ENTREGA INICIAL
            </span>
            <input
              type="number"
              {...register(`servicios.${name}.montoPagado`)}
              className="w-full p-1 text-sm rounded border border-gray-300 bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-[#223c1f] mb-8">
            {isEdit ? "Editar Socio" : "Nuevo Socio"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-[#223c1f] mb-2">
                Nombre Completo
              </label>
              <input
                {...register("nombre", { required: true })}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#659d3a] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#223c1f] mb-2">
                DNI
              </label>
              <input
                {...register("dni", { required: true, pattern: /^[0-9]{8}$/ })}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#659d3a] outline-none"
                maxLength={8}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <ServiceCard
              title="Gimnasio"
              name="gym"
              options={["No", "3 Días", "5 Días"]}
              watchVal={watchGym}
              color="green"
            />
            <ServiceCard
              title="Natación"
              name="natacion"
              options={["No", "2 Días", "3 Días"]}
              watchVal={watchNata}
              color="blue"
            />
            <ServiceCard
              title="Kids"
              name="kids"
              options={["No", "3 Días"]}
              watchVal={watchKids}
              color="orange"
            />
            <ServiceCard
              title="Profe"
              name="profe"
              options={["No", "3 Días"]}
              watchVal={watchProfe}
              color="purple"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#659d3a] hover:bg-[#223c1f] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <RiSaveLine size={24} />{" "}
            {isEdit ? "Guardar Cambios" : "Registrar Socio"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ClientForm;
