import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clapperboard, Home, Search } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background cinematic elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center max-w-lg mx-auto"
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                        delay: 0.2
                    }}
                    className="flex justify-center mb-8"
                >
                    <div className="relative">
                        <Clapperboard className="w-32 h-32 text-primary opacity-20" />
                        <span className="absolute inset-0 flex items-center justify-center text-6xl font-black text-white mix-blend-overlay">
                            404
                        </span>
                    </div>
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                    Director's Cut Not Found
                </h1>

                <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                    It looks like this scene ended up on the cutting room floor.
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/home"
                        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto shadow-lg shadow-primary/20"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <Link
                        to="/explore"
                        className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors w-full sm:w-auto"
                    >
                        <Search className="w-5 h-5 text-muted-foreground" />
                        Explore Cinema
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
