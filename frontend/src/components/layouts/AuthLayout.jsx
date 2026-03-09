import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
    return (
        <div className="min-h-screen auth-bg flex items-center justify-center p-4 overflow-hidden relative">
            {/* Abstract blurred shapes for premium cinematic dark aesthetic */}
            <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <Outlet />
            </motion.div>
        </div>
    );
};

export default AuthLayout;
