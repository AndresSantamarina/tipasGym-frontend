import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import { RiLockPasswordLine, RiUserAddLine } from "react-icons/ri";
import logo from "../assets/logo.jpeg";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", data);

      Swal.fire({
        icon: "success",
        title: "Registro Exitoso",
        text: "Ahora puedes iniciar sesión.",
        confirmButtonColor: "#659d3a",
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || "Error en el servidor",
        confirmButtonColor: "#223c1f",
      });
    }
  };

  return (
    /* Fondo Crema: #fbf4e4 */
    <div className="min-h-screen bg-[#fbf4e4] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        /* Borde Superior Verde: #659d3a */
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-[#659d3a]"
      >
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Logo"
            className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-[#fbf4e4]"
          />
          {/* Texto Verde Oscuro: #223c1f */}
          <h1 className="text-2xl font-bold text-[#223c1f]">
            Nuevo Administrador
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-[#223c1f] font-semibold mb-2">
              Usuario
            </label>
            <input
              {...register("usuario", { required: "Campo obligatorio" })}
              /* Focus con Verde: #659d3a */
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#659d3a] outline-none"
              placeholder="Nombre de usuario"
            />
            {errors.usuario && (
              <p className="text-red-500 text-xs mt-1">
                {errors.usuario.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[#223c1f] font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Campo obligatorio",
                minLength: 6,
              })}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#659d3a] outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            /* Botón Verde: #659d3a, Hover Verde Oscuro: #223c1f */
            className="w-full bg-[#659d3a] hover:bg-[#223c1f] text-white font-bold py-3 rounded-xl transition-all duration-300"
          >
            Registrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-[#659d3a] font-bold hover:underline text-sm"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
