// src/pages/CheckIn.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import logo from "../assets/logo.jpeg";
import clientAxios from "../api/clientAxios";

const CheckIn = () => {
  const { register, handleSubmit, reset } = useForm();
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      setError(null);
      const res = await clientAxios.get(
        `/clients/check/${data.dni}`,
      );
      setCliente(res.data);
      reset(); // Limpiar input para el próximo

      // Auto-limpiar el mensaje después de 5 segundos
      setTimeout(() => setCliente(null), 5000);
    } catch (err) {
      setError(err.response?.data?.msg || "Error al consultar");
      setTimeout(() => setError(null), 3000);
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
            {...register("dni", { required: true })}
            className="w-full text-center text-4xl p-4 rounded-2xl border-2 border-gray-200 focus:border-[#659d3a] outline-none transition-all mb-4"
            placeholder="INGRESE SU DNI"
            autoFocus
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
              className={`p-6 rounded-3xl text-white ${cliente.status === "ACTIVO" ? "bg-[#659d3a]" : "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]"}`}
            >
              <h2 className="text-5xl font-black mb-4 tracking-tighter">
                {cliente.status}
              </h2>
              <p className="text-2xl uppercase font-medium border-b border-white/20 pb-4 mb-4">
                {cliente.nombre}
              </p>

              <div className="space-y-2 text-left bg-black/10 p-4 rounded-xl">
                <p className="text-sm font-bold uppercase opacity-80">
                  Suscripción:
                </p>
                {cliente.servicios.gym !== "No" && (
                  <p className="flex justify-between">
                    <span>🏋️ Gimnasio:</span>{" "}
                    <strong>{cliente.servicios.gym}</strong>
                  </p>
                )}
                {cliente.servicios.natacion !== "No" && (
                  <p className="flex justify-between">
                    <span>🏊 Natación:</span>{" "}
                    <strong>{cliente.servicios.natacion}</strong>
                  </p>
                )}
              </div>

              <p className="mt-4 text-sm font-bold">
                VENCE: {new Date(cliente.vence).toLocaleDateString()}
              </p>
            </motion.div>
          )}

          {error && (
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-red-500 font-bold text-xl"
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
