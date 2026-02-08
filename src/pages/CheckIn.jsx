import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.jpeg";
import clientAxios from "../api/clientAxios";

const CheckIn = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      setError(null);
      const res = await clientAxios.get(`/clients/check/${data.dni}`);

      setCliente(res.data);
      reset();
    } catch (err) {
      setCliente(null);
      setError(err.response?.data?.msg || "Error al consultar");
      setTimeout(() => setError(null), 3000);
      reset();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVO TOTAL":
      case "SOLO GYM":
      case "SOLO NATACIÓN":
        return "bg-[#659d3a]";
      case "ACTIVO PARCIAL":
        return "bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]";
      case "VENCIDO":
      default:
        return "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]";
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf4e4] flex flex-col items-center justify-center p-4">
      <img
        src={logo}
        alt="Logo"
        className="w-32 h-32 rounded-full mb-8 shadow-lg border-4 border-[#659d3a]"
      />

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xl text-center border-t-8 border-[#223c1f]">
        <h1 className="text-3xl font-bold text-[#223c1f] mb-6">
          Control de Acceso
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
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
            className={`w-full text-center text-4xl p-4 rounded-2xl border-2 outline-none transition-all mb-4 ${
              errors.dni
                ? "border-red-500"
                : "border-gray-200 focus:border-[#659d3a]"
            }`}
            placeholder="INGRESE SU DNI"
            autoFocus
            autoComplete="off"
          />
          {errors.dni && (
            <p className="text-red-500 font-bold mb-4">{errors.dni.message}</p>
          )}
          <button className="w-full bg-[#223c1f] text-white py-4 rounded-2xl text-xl font-bold hover:bg-[#659d3a] transition-all">
            INGRESAR
          </button>
        </form>

        <AnimatePresence>
          {cliente && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-3xl text-white ${getStatusColor(cliente.statusGlobal)}`}
            >
              <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">
                {cliente.statusGlobal}
              </h2>
              <p className="text-2xl uppercase font-medium border-b border-white/20 pb-4 mb-4">
                {cliente.nombre}
              </p>

              <div className="space-y-3 text-left bg-black/10 p-4 rounded-xl">
                {cliente?.servicios?.gym?.modalidad !== "No" && (
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div>
                      <p className="font-bold flex items-center gap-2">
                        🏋️ GIMNASIO
                      </p>
                      <p className="text-xs opacity-80">
                        {cliente.servicios.gym.modalidad}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs px-2 py-1 rounded font-bold ${cliente.servicios.gym.activo ? "bg-white text-green-700" : "bg-red-600 text-white"}`}
                      >
                        {cliente.servicios.gym.activo ? "AL DÍA" : "VENCIDO"}
                      </span>
                      <p className="text-[10px] mt-1">
                        Vence:{" "}
                        {new Date(
                          cliente.servicios.gym.vencimiento,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                {cliente?.servicios?.natacion?.modalidad !== "No" && (
                  <div className="flex justify-between items-center pt-1">
                    <div>
                      <p className="font-bold flex items-center gap-2">
                        🏊 NATACIÓN
                      </p>
                      <p className="text-xs opacity-80">
                        {cliente.servicios.natacion.modalidad}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs px-2 py-1 rounded font-bold ${cliente.servicios.natacion.activo ? "bg-white text-blue-700" : "bg-red-600 text-white"}`}
                      >
                        {cliente.servicios.natacion.activo
                          ? "AL DÍA"
                          : "VENCIDO"}
                      </span>
                      <p className="text-[10px] mt-1">
                        Vence:{" "}
                        {new Date(
                          cliente.servicios.natacion.vencimiento,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {error && (
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-red-500 font-bold text-xl mt-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckIn;
