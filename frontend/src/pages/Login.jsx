import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Film, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/authSlice";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/home");
		}
		return () => {
			dispatch(clearError());
		};
	}, [isAuthenticated, navigate, dispatch]);

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(loginUser({ username, password }));
	};

	return (
		<div className="glass-panel p-8 md:p-12 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-primary/20 w-full relative overflow-hidden">
			{/* Subtle glow effect inside the card */}
			<div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-primary/30 rounded-full blur-[60px]" />

			<div className="relative z-10 flex flex-col items-center mb-8">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="bg-primary/10 p-4 rounded-full mb-4 ring-1 ring-primary/30">
					<Film className="w-8 h-8 text-primary" />
				</motion.div>
				<h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h2>
				<p className="text-muted-foreground text-sm text-center">Sign in to SheryCinema to continue exploring the cinematic universe.</p>
			</div>

			{error && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="relative z-10 mb-6 bg-destructive/10 border border-destructive/50 text-destructive-foreground px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
					<AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
					<div>
						<p>{error}</p>
						{error.toLowerCase().includes("email not verified") && (
							<Link to="/resend-verification" className="text-primary hover:text-primary/80 font-medium transition-colors mt-1 inline-block">
								Resend verification email &rarr;
							</Link>
						)}
					</div>
				</motion.div>
			)}

			<form onSubmit={handleSubmit} className="relative z-10 space-y-6">
				<div className="space-y-4">
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
					<div className="relative">
						<Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							className="w-full bg-background/50 border border-border rounded-xl py-3 pl-11 pr-11 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							disabled={loading}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-3.5 text-muted-foreground hover:text-white transition-colors"
							tabIndex={-1}>
							{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
						</button>
					</div>
				</div>

				<div className="flex items-center justify-between text-sm">
					<label className="flex items-center gap-2 cursor-pointer group">
						<input type="checkbox" className="rounded border-gray-600 outline-none text-primary focus:ring-primary/50 bg-background" />
						<span className="text-muted-foreground group-hover:text-white transition-colors">Remember me</span>
					</label>
					<a href="#" className="text-primary hover:text-primary/80 transition-colors font-medium">
						Forgot password?
					</a>
				</div>

				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					type="submit"
					disabled={loading}
					className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
					{loading ? (
						<Loader2 className="w-5 h-5 animate-spin" />
					) : (
						<>
							Sign In
							<ArrowRight className="w-5 h-5" />
						</>
					)}
				</motion.button>
			</form>

			<div className="relative z-10 mt-8 text-center text-sm text-muted-foreground">
				Don't have an account?{" "}
				<Link to="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
					Create an account
				</Link>
			</div>
		</div>
	);
}
