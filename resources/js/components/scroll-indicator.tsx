import { useEffect, useState } from 'react';

interface ScrollIndicatorProps {
    sections: { id: string; label: string }[];
}

export default function ScrollIndicator({ sections }: ScrollIndicatorProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        sections.forEach(({ id }, index) => {
            const el = document.getElementById(id);
            if (!el) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveIndex(index);
                    }
                },
                { threshold: 0.4, rootMargin: '-10% 0px -10% 0px' },
            );

            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, [sections]);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                right: 28,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
            }}
        >
            {/* Vertical connecting line */}
            <div
                style={{
                    position: 'absolute',
                    top: 8,
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 1,
                    background: 'rgba(255,255,255,0.1)',
                    zIndex: -1,
                }}
            />

            {sections.map(({ id, label }, index) => {
                const isActive = index === activeIndex;
                return (
                    <button
                        key={id}
                        onClick={() => scrollTo(id)}
                        title={label}
                        style={{
                            width: isActive ? 2 : 6,
                            height: isActive ? 24 : 6,
                            borderRadius: isActive ? 1 : '50%',
                            background: isActive ? '#ffffff' : 'rgba(255,255,255,0.25)',
                            border: isActive ? 'none' : '1px solid transparent',
                            boxShadow: isActive ? '0 0 8px rgba(255,255,255,0.35)' : 'none',
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'all 0.3s ease',
                            outline: 'none',
                        }}
                    />
                );
            })}
        </div>
    );
}
