import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
    Zap,
    Type,
    CheckCircle,
    AlertTriangle,
    Clock
} from "lucide-react";

type ResultModalProps = {
    open: boolean;
    onClose: () => void;
    wpm: number;
    accuracy: number;
    mistakes: number;
    timeElapsed: number;
    cpm: number;
};

export default function ResultModal({
    open,
    onClose,
    wpm,
    accuracy,
    mistakes,
    timeElapsed,
    cpm,
}: ResultModalProps) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black z-40"
                        aria-hidden="true"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        role="dialog"
                        aria-modal="true"
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-4 relative">
                            <h6 className="font-semibold text-[24px]">
                                Nice results!
                            </h6>
                            <p className="font-normal text-[14px] mb-3">We know, you can even better!</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-[#10B981]" />
                                    <span className="text-sm">
                                        WPM: <span className="font-semibold">{wpm}</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Type className="w-5 h-5 text-[#10B981]" />
                                    <span className="text-sm">
                                        CPM: <span className="font-semibold">{cpm}</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-[#10B981]" />
                                    <span className="text-sm">
                                        Accuracy: <span className="font-semibold">{accuracy.toFixed(2)}%</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-[#10B981]" />
                                    <span className="text-sm">
                                        Total Errors: <span className="font-semibold">{mistakes}</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[#10B981]" />
                                    <span className="text-sm">
                                        Time: <span className="font-semibold">{timeElapsed}s</span>
                                    </span>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
                                <X />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
