import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { authAPI } from "../services/api";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../store/authSlice";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [status, setStatus] = useState("loading"); // loading, success, error
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        const verifyUserEmail = async () => {
            try {
                // Wait a bit just to prevent violent flashing and feel like it's processing
                // Not strictly necessary but creates a smoother UX
                await new Promise(resolve => setTimeout(resolve, 800));

                const response = await authAPI.verifyEmail({ token });
                if (response.data?.token) {
                    localStorage.setItem('token', response.data.token);
                }
                setStatus("success");
                setMessage("Your email has been successfully verified! Redirecting you to home...");

                // Immediately hydrate user profile into redux state since backend sets HttpOnly cookie 
                // on successful verification.
                await dispatch(fetchUserProfile());

                // Redirect after 3 seconds
                setTimeout(() => {
                    navigate("/home");
                }, 3000);

            } catch (error) {
                console.error("Verification error:", error);
                setStatus("error");
                setMessage(
                    error.response?.data?.message || "Failed to verify email. The link might be expired."
                );
            }
        };

        verifyUserEmail();
    }, [token, navigate, dispatch]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-primary/5 rounded-full blur-[100px]" />

            <div className="glass-panel p-8 md:p-12 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-primary/20 w-full max-w-md relative z-10 text-center flex flex-col items-center">
                {status === "loading" && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center"
                    >
                        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">Verifying...</h2>
                        <p className="text-muted-foreground">{message}</p>
                    </motion.div>
                )}

                {status === "success" && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center"
                    >
                        <div className="bg-green-500/10 p-4 rounded-full mb-6 ring-1 ring-green-500/30">
                            <CheckCircle2 className="w-12 h-12 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Email Verified!</h2>
                        <p className="text-muted-foreground mb-6">{message}</p>
                        <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3, ease: "linear" }}
                                className="h-full bg-green-400"
                            />
                        </div>
                    </motion.div>
                )}

                {status === "error" && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center w-full"
                    >
                        <div className="bg-destructive/10 p-4 rounded-full mb-6 ring-1 ring-destructive/30">
                            <XCircle className="w-12 h-12 text-destructive" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Verification Failed</h2>
                        <p className="text-muted-foreground mb-8 text-sm px-4 bg-white/5 py-3 rounded-xl border border-white/10 w-full">
                            {message}
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300"
                        >
                            Return to Login
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
