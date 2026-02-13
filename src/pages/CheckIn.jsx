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
        return "bg-[#659d3a]";
      case "ACTIVO PARCIAL":
        return "bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]";
      case "VENCIDO":
      default:
        return "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]";
    }
  };

  const getCardStyle = (estado) => {
    switch (estado) {
      case "ACTIVO":
        return "bg-green-500 text-white shadow-sm border-b-4 border-green-700";
      case "DEUDA PARCIAL":
        return "bg-yellow-400 text-yellow-900 shadow-sm border-b-4 border-yellow-600";
      case "DEUDA TOTAL":
      default:
        return "bg-red-500 text-white shadow-sm border-b-4 border-red-700";
    }
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "ACTIVO TOTAL":
        return "text-green-600 border-green-600";
      case "ACTIVO PARCIAL":
        return "text-yellow-600 border-yellow-600";
      default:
        return "text-red-600 border-red-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf4e4] flex flex-col items-center justify-center p-4">
      <img
        src={logo}
        alt="Logo"
        className="w-24 h-24 rounded-full mb-6 shadow-lg border-4 border-[#659d3a]"
      />

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-xl text-center border-t-8 border-[#223c1f]">
        <h1 className="text-2xl font-bold text-[#223c1f] mb-6">
          Control de Acceso
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <input
            {...register("dni", {
              required: "Obligatorio",
              pattern: { value: /^[0-9]{8}$/, message: "8 números" },
            })}
            type="text"
            maxLength={8}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
            }
            className={`w-full text-center text-4xl p-4 rounded-2xl border-2 outline-none mb-4 transition-colors ${
              errors.dni
                ? "border-red-500"
                : "border-gray-200 focus:border-[#659d3a]"
            }`}
            placeholder="DNI"
            autoFocus
            autoComplete="off"
          />
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
              className="p-6 rounded-3xl bg-[#2d3436] text-white shadow-xl"
            >
              <div className="mb-6">
                <h2 className="text-3xl font-black uppercase tracking-tight leading-none">
                  {cliente.nombre}
                </h2>
              </div>

              <div className="space-y-4">
                {Object.keys(cliente.servicios).map((key) => {
                  const s = cliente.servicios[key];
                  const icons = {
                    gym: "🏋️",
                    natacion: "🏊",
                    kids: "👶",
                    profe: "🎓",
                  };

                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-2xl flex justify-between items-center transition-all ${getCardStyle(s.estado)}`}
                    >
                      <div className="text-left">
                        <p className="font-black text-lg flex items-center gap-2">
                          {icons[key] || "✅"} {key.toUpperCase()}
                        </p>
                        <p className="text-xs font-medium italic opacity-90">
                          {s.modalidad}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded shadow-inner">
                          {s.estado}
                        </p>
                        <p className="text-xs font-bold mt-1">
                          Vence: {new Date(s.vencimiento).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
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
