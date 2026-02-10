import { useState } from "react";
import { RiMenuFill, RiCloseLine } from "react-icons/ri";
import Sidebar from "../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#fbf4e4] min-h-screen relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-[#223c1f] text-[#fbf4e4] p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
          <h2 className="font-bold">Admin Gym</h2>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-2xl p-1"
          >
            <RiMenuFill />
          </button>
        </header>
        <main className="md:ml-64 flex-1 p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
