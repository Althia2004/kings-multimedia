import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionRevealProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    direction?: 'up' | 'left' | 'right';
}

export default function SectionReveal({
    children,
    delay = 0,
    className = '',
    direction = 'up',
}: SectionRevealProps) {
    const initial = {
        opacity: 0,
        y: direction === 'up' ? 48 : 0,
        x: direction === 'left' ? -48 : direction === 'right' ? 48 : 0,
    };

    return (
        <motion.div
            initial={initial}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay, ease: [0.22, 0.9, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
