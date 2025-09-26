import { Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import lvl1Cerificate from '/LVL 1 Certificate layout.png';
import lvl2Cerificate from '/LVL 2 Certificate layout.png';
import lvl3Cerificate from '/LVL 3 Certificate layout.png';

export default function CertificateModal({ open, onClose, certificate }: any) {
    if (!certificate) return null;

    if (certificate) {
        console.log(certificate);
    }

    const certificateTimeFormatting = (time: number) => {
        if (time == 90) {
            return { number: 1.5, unit: 'min' }
        } else if (time == 60) {
            return { number: 1, unit: 'min' }
        } else if (time == 30) {
            return { number: 30, unit: 'sec' }
        }
    }

    let certificateImage;
    switch (certificate.difficultyLevel) {
        case 'Level 1':
            certificateImage = lvl1Cerificate;
            break;
        case 'Level 2':
            certificateImage = lvl2Cerificate;
            break;
        case 'Level 3':
            certificateImage = lvl3Cerificate;
            break;
        default:
            certificateImage = lvl1Cerificate;
    }

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
                            <h3>🎉 New Certificate Earned!</h3>
                            <div className="w-full relative">
                                <img
                                    src={certificateImage}
                                    alt={`Certificate ${certificate.difficultyLevel}`}
                                    className="w-full rounded-xl mt-4 "
                                />

                                <p className="absolute top-[145px] left-[50px] text-[14px] font-bold">{certificate.cpm}<span className="text-[10px]">c/m</span></p>
                                <p className="absolute top-[145px] left-[128px] text-[14px] font-bold">{certificate.accuracy.toFixed(1)}<span className="text-[10px]">%</span></p>
                                <p>Time: {certificate.time}</p>
                                <p>Issued at: {new Date(certificate.issuedAt).toLocaleDateString()}</p>
                                <p>Validation ID: {certificate.validationId}</p>
                                <p>User name: {certificate.userName}</p>
                                <p>Mistakes: {certificate.mistakes}</p>
                                <p>Difficulty: {certificate.difficultyLevel}</p>
                                <p>Language: {certificate.language}</p>
                            </div>
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
