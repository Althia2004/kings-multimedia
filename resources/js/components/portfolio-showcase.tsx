import { useState, useEffect, useRef } from 'react';
import SectionReveal from '@/components/section-reveal';

const portfolioItems = [
    {
        id: 1,
        type: 'image',
        category: '18',
        label: '2026',
        image: '/images/portfolio/18photo.jpg',
    },
    {
        id: 2,
        type: 'image',
        category: 'ArawNgPanabo',
        label: 'pageant',
        image: '/images/portfolio/binibini.jpg',
    },
    {
        id: 3,
        type: 'image',
        category: 'Pictorial',
        label: 'Solo Pictorial',
        image: '/images/portfolio/photo2.jpg',
    },
    {
        id: 4,
        type: 'image',
        category: 'Concert',
        label: ' 2026 concert',
        image: '/images/portfolio/maki.jpg',
    },
    {
        id: 5,
        type: 'image',
        category: 'Portrait',
        label: 'family',
        image: '/images/portfolio/family.jpg',
    },
    {
        id: 6,
        type: 'image',
        category: 'Events',
        label: 'Debut Coverage',
        image: '/images/portfolio/nica18.jpg',
    },
];

const categoryGradients: Record<string, string> = {
    Graduation: 'linear-gradient(135deg, #1c1c1c 0%, #252525 100%)',
    Portrait: 'linear-gradient(135deg, #161818 0%, #1e2020 100%)',
    Events: 'linear-gradient(135deg, #181618 0%, #201e20 100%)',
    'Behind the Scenes': 'linear-gradient(135deg, #181a18 0%, #202220 100%)',
};

function PlaceholderCard({ item }) {
    return (
        <div
            className="portfolio-card"
            style={{
                position:'relative',
                overflow:'hidden',
                backgroundImage: `
                    linear-gradient(
                        to top,
                        rgba(0,0,0,0.75),
                        rgba(0,0,0,0.2)
                    ),
                    url(${item.image})
                `,
                backgroundSize:'cover',
                backgroundPosition:'center',
                backgroundRepeat:'no-repeat',
            }}
        >
            <div
                style={{
                    position:'absolute',
                    bottom:20,
                    left:20,
                    zIndex:2,
                }}
            >
                <span
                    style={{
                        display:'block',
                        fontSize:'0.6rem',
                        letterSpacing:'0.28em',
                        textTransform:'uppercase',
                        color:'rgba(255,255,255,.65)',
                    }}
                >
                    {item.category}
                </span>

                <span
                    style={{
                        fontFamily:'Cormorant Garamond',
                        fontSize:'1rem',
                        color:'white',
                    }}
                >
                    {item.label}
                </span>
            </div>
        </div>
    );
}
function MarqueeRow({
    items,
    direction,
}: {
    items: typeof portfolioItems;
    direction: 'left' | 'right';
}) {
    const doubled = [...items, ...items];

    return (
        <div
            className="marquee-wrap"
            style={{ overflow: 'hidden', width: '100%' }}
        >
            <div className={`marquee-track marquee-track--${direction}`}>
                {doubled.map((item, i) => (
                    <PlaceholderCard key={`${item.id}-${i}`} item={item} />
                ))}
            </div>
        </div>
    );
}

function SpotlightCarousel() {
    const [active, setActive] = useState(0);
    const [animKey, setAnimKey] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const advance = (dir: number) => {
        setActive(
            (prev) =>
                (prev + dir + portfolioItems.length) % portfolioItems.length,
        );
        setAnimKey((k) => k + 1);
    };

    const goTo = (i: number) => {
        setActive(i);
        setAnimKey((k) => k + 1);

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => advance(1), 4000);
    };

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setActive((prev) => (prev + 1) % portfolioItems.length);
            setAnimKey((k) => k + 1);
        }, 4000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const item = portfolioItems[active];

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                maxWidth: 900,
                margin: '0 auto',
            }}
        >
            {/* Main slide */}
            <div
                key={animKey}
                style={{
                    backgroundImage: `
                    linear-gradient(
                    to top,
                    rgba(0,0,0,.8),
                    rgba(0,0,0,.15)
                    ),
                    url(${item.image})
                    `,
                    backgroundSize:'cover',
                    backgroundPosition:'center',
                    backgroundRepeat:'no-repeat',
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    height: 'clamp(280px, 38vw, 500px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    animation: 'ken-burns 6s ease-in-out forwards',
                }}
            >
                {/* Bottom gradient overlay */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '55%',
                        background:
                            'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                        zIndex: 2,
                    }}
                />

                {/* Category + label */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 'clamp(20px, 3vw, 36px)',
                        left: 'clamp(20px, 4vw, 40px)',
                        zIndex: 3,
                    }}
                >
                    <span
                        style={{
                            display: 'block',
                            fontFamily: '"DM Sans", sans-serif',
                            fontSize: '0.62rem',
                            fontWeight: 500,
                            letterSpacing: '0.32em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.45)',
                            marginBottom: 8,
                        }}
                    >
                        {item.category}
                    </span>
                    <span
                        style={{
                            fontFamily: '"Cormorant Garamond", Georgia, serif',
                            fontSize: 'clamp(1.3rem, 2.8vw, 1.9rem)',
                            fontWeight: 300,
                            color: 'rgba(255,255,255,0.88)',
                            letterSpacing: '0.02em',
                        }}
                    >
                        {item.label}
                    </span>
                </div>
            </div>

            {/* Arrow buttons */}
            <button
                className="spotlight-arrow spotlight-arrow--left"
                onClick={() => advance(-1)}
                aria-label="Previous slide"
            >
                &#8592;
            </button>
            <button
                className="spotlight-arrow spotlight-arrow--right"
                onClick={() => advance(1)}
                aria-label="Next slide"
            >
                &#8594;
            </button>

            {/* Dot indicators */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 22,
                }}
            >
                {portfolioItems.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        style={{
                            width: i === active ? 24 : 6,
                            height: 6,
                            borderRadius: 3,
                            background:
                                i === active
                                    ? 'rgba(255,255,255,0.85)'
                                    : 'rgba(255,255,255,0.18)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'all 0.3s ease',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default function PortfolioShowcase() {
    return (
        <section
            id="portfolio"
            style={{
                background: '#141414',
                padding: 'clamp(80px, 10vw, 140px) 0',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Top divider line */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '10%',
                    right: '10%',
                    height: 1,
                    background:
                        'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)',
                }}
            />

            {/* Section heading */}
            <SectionReveal>
                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: 'clamp(48px, 7vw, 72px)',
                        padding: '0 clamp(24px, 6vw, 80px)',
                    }}
                >
                    <span
                        style={{
                            display: 'block',
                            fontFamily: '"DM Sans", sans-serif',
                            fontSize: '0.68rem',
                            fontWeight: 500,
                            letterSpacing: '0.32em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.28)',
                            marginBottom: 14,
                        }}
                    >
                        — Our Work —
                    </span>
                    <h2
                        style={{
                            fontFamily: '"Cormorant Garamond", Georgia, serif',
                            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                            fontWeight: 300,
                            color: '#f0f0f0',
                            lineHeight: 1.1,
                            margin: 0,
                            letterSpacing: '0.01em',
                        }}
                    >
                        Captured Moments
                    </h2>
                </div>
            </SectionReveal>

            {/* Marquee strip — two rows */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    marginBottom: 'clamp(56px, 8vw, 88px)',
                }}
            >
                <MarqueeRow items={portfolioItems} direction="left" />
                <MarqueeRow items={portfolioItems} direction="right" />
            </div>

            {/* Spotlight carousel */}
            <div style={{ padding: '0 clamp(24px, 6vw, 80px)' }}>
                <SectionReveal>
                    <p
                        style={{
                            fontFamily: '"DM Sans", sans-serif',
                            fontSize: '0.68rem',
                            fontWeight: 500,
                            letterSpacing: '0.28em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.25)',
                            textAlign: 'center',
                            marginBottom: 28,
                        }}
                    >
                        Featured
                    </p>
                    <SpotlightCarousel />
                </SectionReveal>
            </div>
        </section>
    );
}
