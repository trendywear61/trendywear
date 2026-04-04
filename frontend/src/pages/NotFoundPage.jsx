import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const NotFoundPage = () => {
    useEffect(() => {
        document.title = "404 Not Found | Trendy Wear";
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-8xl font-black mb-4 font-serif italic"
            >
                404
            </motion.h1>
            <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold mb-6 tracking-tight uppercase"
            >
                Page Not Found
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 mb-8 max-w-md"
            >
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </motion.p>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Link 
                    to="/" 
                    className="bg-black text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors inline-block"
                >
                    Go Home
                </Link>
            </motion.div>
        </div>
    );
};
