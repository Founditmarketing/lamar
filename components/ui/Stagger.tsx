import React from 'react';
import { motion } from 'framer-motion';

interface StaggerProps {
    children: React.ReactNode;
    delay?: number;
    staggerChildren?: number;
    className?: string;
}

export const Stagger: React.FC<StaggerProps> = ({ children, delay = 0, staggerChildren = 0.1, className = "" }) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerChildren,
                        delayChildren: delay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const FadeIn: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
