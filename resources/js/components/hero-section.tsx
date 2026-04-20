import { lazy, Suspense } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { login, register, dashboard } from '@/routes';
import type { Auth } from '@/types/auth';
import type { Team } from '@/types/teams';

const CameraModel = lazy(() => import('@/components/camera-model'));

interface HeroSectionProps {
    auth: Auth;
    canRegister: boolean;
    currentTeam: Team | null;
}

function CameraFallback() {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.15)',
                    borderTop: '2px solid rgba(255,255,255,0.6)',
                    animation: 'spin 1s linear infinite',
                }}
            />
        </div>
    );
}

export default function HeroSection({ auth, canRegister, currentTeam }: HeroSectionProps) {
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';

    return (
        <section
            id="hero"
            style={{
                minHeight: '100vh',
                background: '#0a0a0a',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Subtle radial glow in center */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(255,255,255,0.035) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Nav */}
            <nav
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '28px 48px',
                }}
            >
                <span
                    style={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: '1.3rem',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        color: '#ffffff',
                    }}
                >
                  TheKingsVault
                </span>

                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    {auth.user ? (
                        <Link href={dashboardUrl} className="hero-nav-btn hero-nav-btn--primary">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={login()} className="hero-nav-btn">
                                Log in
                            </Link>
                            {canRegister && (
                                <Link href={register()} className="hero-nav-btn hero-nav-btn--primary">
                                    Register
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </nav>

            {/* Floating abstract shapes for depth */}
            <div style={{
                position: 'absolute', top: '8%', left: '-12%',
                width: 520, height: 520, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
                filter: 'blur(60px)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '15%', right: '-8%',
                width: 380, height: 280, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
                filter: 'blur(50px)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', top: '35%', right: '12%',
                width: 180, height: 180, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)',
                filter: 'blur(35px)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', top: '55%', left: '8%',
                width: 140, height: 200, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)',
                filter: 'blur(40px)', pointerEvents: 'none',
            }} />

            {/* 3D Canvas — center stage */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    paddingTop: '80px',
                }}
            >
                {/* 3D Camera */}
                <div
                    style={{
                        width: '100%',
                        maxWidth: 700,
                        height: 420,
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    <Suspense fallback={<CameraFallback />}>
                        <CameraModel />
                    </Suspense>
                </div>

                {/* Headline block */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0.9, 0.36, 1] }}
                    style={{
                        textAlign: 'center',
                        padding: '0 24px',
                        marginTop: 8,
                        position: 'relative',
                        zIndex: 3,
                    }}
                >
                    <h1
                        style={{
                            fontFamily: '"Cormorant Garamond", Georgia, serif',
                            fontSize: 'clamp(2.8rem, 7vw, 6rem)',
                            fontWeight: 300,
                            letterSpacing: '0.02em',
                            lineHeight: 1.05,
                            color: '#ffffff',
                            margin: '0 0 16px',
                        }}
                    >
                        TheKingsVault
                    </h1>
                    <p
                        className="tagline-shimmer"
                        style={{
                            fontFamily: '"DM Sans", sans-serif',
                            fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                            fontWeight: 400,
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            margin: '0 0 40px',
                        }}
                    >
                        Where Every Shot is Secured
                    </p>

                    {/* CTA Buttons */}
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="#features" className="cta-btn cta-btn--primary">
                            Book a Session
                        </a>
                        <a href="#features" className="cta-btn cta-btn--secondary">
                            View Gallery
                        </a>
                    </div>
                </motion.div>

                {/* Scroll cue */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    style={{
                        position: 'absolute',
                        bottom: 36,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        zIndex: 2,
                    }}
                >
                    <span
                        style={{
                            fontFamily: '"DM Sans", sans-serif',
                            fontSize: '0.7rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.3)',
                        }}
                    >
                       
                    </span>
                  
                    
                </motion.div>
            </div>
        </section>
    );
}
