import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Film, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { authAPI } from "../services/api";

export default function ResendVerification() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);
		try {
			const res = await authAPI.resendVerificationEmail(email);
			setSuccess(res.data.message || "Verification email sent! Check your inbox.");
		} catch (err) {
			setError(err.response?.data?.message || "Failed to send verification email. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="glass-panel p-8 md:p-12 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-primary/20 w-full relative overflow-hidden">
			<div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-primary/30 rounded-full blur-[60px]" />

			<div className="relative z-10 flex flex-col items-center mb-8">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="bg-primary/10 p-4 rounded-full mb-4 ring-1 ring-primary/30">
					<Film className="w-8 h-8 text-primary" />
				</motion.div>
				<h2 className="text-3xl font-bold text-white tracking-tight mb-2">Resend Verification</h2>
				<p className="text-muted-foreground text-sm text-center">Enter your email address and we'll send you a new verification link.</p>
			</div>

			{error && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="relative z-10 mb-6 bg-destructive/10 border border-destructive/50 text-destructive-foreground px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
					<AlertCircle className="w-5 h-5 text-destructive shrink-0" />
					<p>{error}</p>
				</motion.div>
			)}

			{success && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="relative z-10 mb-6 bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
					<CheckCircle2 className="w-5 h-5 shrink-0" />
					<p>{success}</p>
				</motion.div>
			)}

			<form onSubmit={handleSubmit} className="relative z-10 space-y-6">
				<div className="relative">
					<Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
					<input
						type="email"
						placeholder="Enter your email"
						className="w-full bg-background/50 border border-border rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						disabled={loading}
					/>
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
							Send Verification Email
							<ArrowRight className="w-5 h-5" />
						</>
					)}
				</motion.button>
			</form>

			<div className="relative z-10 mt-8 text-center text-sm text-muted-foreground">
				Already verified?{" "}
				<Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
					Back to Login
				</Link>
			</div>
		</div>
	);
}
