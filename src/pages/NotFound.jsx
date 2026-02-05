import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiHome, HiExclamationCircle } from "react-icons/hi";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <HiExclamationCircle className="text-9xl text-[#c1b275]" />
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-[#c1b275] blur-2xl rounded-full -z-10"
            ></motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-black text-[#283d29] mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          Página no encontrada
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          Lo sentimos, la página que estás buscando no existe. Verifica la
          dirección o vuelve al inicio.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 bg-[#283d29] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors"
          >
            <HiHome className="text-xl" />
            Volver al Inicio
          </Link>
        </motion.div>

        <div className="mt-12 flex justify-center gap-2">
          <div className="w-12 h-1 bg-[#c1b275] rounded-full"></div>
          <div className="w-4 h-1 bg-[#283d29] rounded-full"></div>
          <div className="w-12 h-1 bg-[#c1b275] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
