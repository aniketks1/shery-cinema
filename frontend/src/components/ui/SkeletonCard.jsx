import { motion } from "framer-motion";

const SkeletonCard = () => {
    return (
        <div className="relative rounded-xl overflow-hidden bg-background aspect-[2/3] border border-border/40">
            {/* Animated Gradient Pulse Effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
                animate={{
                    translateX: ["-100%", "200%"],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                }}
            />

            {/* Base Skeleton Background */}
            <div className="w-full h-full bg-muted/20 absolute inset-0"></div>

            {/* Mock details at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
                <div className="w-3/4 h-4 bg-white/10 rounded-md"></div>
                <div className="flex justify-between">
                    <div className="w-12 h-3 bg-white/10 rounded-md"></div>
                    <div className="w-10 h-3 bg-white/10 rounded-md"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
