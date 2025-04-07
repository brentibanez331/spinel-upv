import Image from "next/image";
import { motion } from "framer-motion"

export default function Loader() {
    return (
        <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
            }}
            className="flex justify-center items-center w-11/12 h-full"
        >
            <Image
                src="/logo.png"
                alt="Loading..."
                width={80}
                height={80}
            />
        </motion.div>
    );
}