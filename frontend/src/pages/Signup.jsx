import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Film, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, clearError } from "../store/authSlice";

export default function Signup() {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, signupSuccess } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/home");
        }
        return () => {
            dispatch(clearError());
            dispatch({ type: 'auth/resetSignupSuccess' }); // using type directly to avoid exporting
        }
    }, [isAuthenticated, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError("");

        if (password !== confirmPassword) {
            setLocalError("Passwords do not match!");
            return;
        }

        dispatch(signupUser({ fullName, username, email, password }));
    };

    const displayError = localError || error;

    if (signupSuccess) {
        return (
            <div className="glass-panel p-8 md:p-12 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-primary/20 w-full relative overflow-hidden text-center">
                <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-green-500/20 rounded-full blur-[60px]" />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 flex flex-col items-center"
                >
                    <div className="bg-green-500/10 p-4 rounded-full mb-6 ring-1 ring-green-500/30">
                        <Mail className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Check Your Email</h2>
                    <p className="text-muted-foreground text-base mb-2">
                        We've sent a verification link to <span className="text-white font-medium">{email}</span>.
                    </p>
                    <p className="text-muted-foreground text-sm mb-8 px-4 bg-white/5 py-2 rounded-lg border border-white/5">
                        Please click the link to activate your account. <br />
                        <span className="text-yellow-500/80">Don't forget to check your spam folder!</span>
                    </p>
                    <Link
                        to="/login"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        Go to Login
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-8 md:p-12 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-primary/20 w-full relative overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-blue-500/20 rounded-full blur-[60px]" />

            <div className="relative z-10 flex flex-col items-center mb-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-primary/10 p-4 rounded-full mb-4 ring-1 ring-primary/30"
                >
                    <Film className="w-8 h-8 text-primary" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Create Account</h2>
                <p className="text-muted-foreground text-sm text-center">
                    Join SheryCinema to track your favorite movies and shows.
                </p>
            </div>

            {displayError && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 mb-6 bg-destructive/10 border border-destructive/50 text-destructive-foreground px-4 py-3 rounded-lg flex items-center gap-3 text-sm"
                >
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                    <p>{displayError}</p>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full bg-background/50 border border-border rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full bg-background/50 border border-border rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full bg-background/50 border border-border rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <input
                        type="password"
                        placeholder="Password (Min. 6 characters, mixed case, number, symbol)"
                        className="w-full bg-background/50 border border-border rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full bg-background/50 border border-border rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Create Account
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </motion.button>
            </form>

            <div className="relative z-10 mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Sign In
                </Link>
            </div>
        </div>
    );
}
