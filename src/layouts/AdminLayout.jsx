import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex bg-[#fbf4e4] min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;
