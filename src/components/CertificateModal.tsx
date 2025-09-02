import { Modal, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export default function CertificateModal({ open, onClose, certificate }: any) {
    if (!certificate) return null;

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
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-2xl p-4 text-center">
                            <h3>
                                🎉 New Certificate Earned!
                            </h3>
                            <p>CPM: {certificate.cpm}</p>
                            <p>Accuracy: {certificate.accuracy.toFixed(2)}%</p>
                            <p>Issued at: {new Date(certificate.issuedAt).toLocaleDateString()}</p>
                            <p>Validation ID: {certificate.validationId}</p>

                            <Button
                                variant="contained"
                                color="success"
                                sx={{ mt: 2 }}
                                onClick={onClose}
                            >
                                Close
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
