// src/pages/Login.jsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import { RiLockPasswordLine, RiUserLine } from 'react-icons/ri';
import logo from '../assets/logo.jpeg';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', data);
            localStorage.setItem('token', res.data.token);
            
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Acceso concedido',
                confirmButtonColor: '#659d3a',
            });
            
            navigate('/admin/dashboard');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.msg || 'Credenciales incorrectas',
                confirmButtonColor: '#223c1f',
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#fbf4e4] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-8 border-[#659d3a]"
            >
                <div className="flex flex-col items-center mb-8">
                    <img src={logo} alt="Gym Logo" className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-[#fbf4e4]" />
                    <h1 className="text-2xl font-bold text-[#223c1f]">Panel Administrativo</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="flex items-center gap-2 text-[#223c1f]  font-medium mb-2">
                            <RiUserLine /> Usuario
                        </label>
                        <input 
                            {...register("usuario", { required: "El usuario es obligatorio" })}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#659d3a] outline-none transition"
                            placeholder="Ingrese su usuario"
                        />
                        {errors.usuario && <p className="text-red-500 text-xs mt-1">{errors.usuario.message}</p>}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-[#223c1f] font-medium mb-2">
                            <RiLockPasswordLine /> Contraseña
                        </label>
                        <input 
                            type="password"
                            {...register("password", { required: "La contraseña es obligatoria" })}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#659d3a] outline-none transition"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-[#659d3a] hover:bg-brand-dark text-white font-bold py-3 rounded-lg transition-colors duration-300 shadow-md"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;