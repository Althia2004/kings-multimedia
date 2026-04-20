import { Head, usePage } from '@inertiajs/react';
import { Instagram, Twitter, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/hero-section';
import FeatureCards from '@/components/feature-cards';
import PortfolioShowcase from '@/components/portfolio-showcase';
import ScrollIndicator from '@/components/scroll-indicator';
import SectionReveal from '@/components/section-reveal';
import type { Auth } from '@/types/auth';
import type { Team } from '@/types/teams';

function SectionDivider() {
    return (
        <div style={{ padding: '0 clamp(24px, 6vw, 80px)' }}>
            <motion.div
                initial={{ width: '0%' }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true, amount: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 0.9, 0.36, 1] }}
                style={{
                    height: 1,
                    background: 'rgba(255,255,255,0.08)',
                }}
            />
        </div>
    );
}

const SECTIONS = [
    { id: 'hero', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'portfolio', label: 'Our Work' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'footer', label: 'Get Started' },
];

const steps = [
    {
        number: '01',
        title: 'Book a Session',
        description:
            'Choose your package, pick a date, and confirm your booking in minutes. Instant confirmation, zero back-and-forth.',
    },
    {
        number: '02',
        title: 'We Shoot',
        description:
            "Your photographer arrives fully prepared. Every shot is captured with professional-grade equipment and an artist's eye.",
    },
    {
        number: '03',
        title: 'Receive Your Gallery',
        description:
            'Edited photos are delivered to your private client portal within 7 days — ready to download, share, and cherish.',
    },
];

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth, currentTeam } = usePage().props as { auth: Auth; currentTeam: Team | null };

    return (
        <>
            <Head title="KINGS Media Graphics Design — Where Every Shot is Secured">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div
                className="kings-page"
                style={{
                    background: '#0d0d0d',
                    color: '#ffffff',
                    fontFamily: '"DM Sans", sans-serif',
                    overflowX: 'hidden',
                }}
            >
               

                <HeroSection
                    auth={auth}
                    canRegister={canRegister}
                    currentTeam={currentTeam}
                />

                <FeatureCards />

                <SectionDivider />

                <PortfolioShowcase />

                <SectionDivider />

                {/* How It Works */}
                <section
                    id="how-it-works"
                    style={{
                        background: '#0d0d0d',
                        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: '10%',
                            right: '10%',
                            height: 1,
                            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)',
                        }}
                    />

                    <SectionReveal>
                        <p
                            style={{
                                fontFamily: '"DM Sans", sans-serif',
                                fontSize: '0.72rem',
                                fontWeight: 500,
                                letterSpacing: '0.25em',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.35)',
                                textAlign: 'center',
                                marginBottom: 16,
                            }}
                        >
                            The Process
                        </p>
                        <h2
                            style={{
                                fontFamily: '"Cormorant Garamond", Georgia, serif',
                                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                                fontWeight: 300,
                                color: '#f0f0f0',
                                textAlign: 'center',
                                marginBottom: 'clamp(56px, 8vw, 96px)',
                                lineHeight: 1.15,
                            }}
                        >
                            Three steps to
                            <br />
                            <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.45)' }}>
                                your perfect gallery.
                            </em>
                        </h2>
                    </SectionReveal>

                    <div
                        style={{
                            maxWidth: 1000,
                            margin: '0 auto',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                            gap: 24,
                        }}
                    >
                        {steps.map((step, i) => (
                            <SectionReveal key={step.number} delay={i * 0.15}>
                                <div className="step-card">
                                    <span className="step-number">{step.number}</span>
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-desc">{step.description}</p>
                                </div>
                            </SectionReveal>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer
                    id="footer"
                    style={{
                        background: '#080808',
                        padding: 'clamp(64px, 8vw, 112px) clamp(24px, 6vw, 80px) 40px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: '5%',
                            right: '5%',
                            height: 1,
                            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)',
                        }}
                    />

                    <SectionReveal>
                        <div style={{ textAlign: 'center', marginBottom: 'clamp(56px, 7vw, 80px)' }}>
                            <h2
                                style={{
                                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                                    fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                                    fontWeight: 300,
                                    color: '#f0f0f0',
                                    lineHeight: 1.1,
                                    marginBottom: 20,
                                    letterSpacing: '0.01em',
                                }}
                            >
                                Ready to secure
                                <br />
                                <span style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>your memories?</span>
                            </h2>
                            <p
                                style={{
                                    fontFamily: '"DM Sans", sans-serif',
                                    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                                    color: 'rgba(255,255,255,0.45)',
                                    marginBottom: 36,
                                    maxWidth: 480,
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    lineHeight: 1.7,
                                }}
                            >
                                Join photographers who trust TheKingsVault to organize their work
                                and delight their clients.
                            </p>
                            <a
                                href={canRegister ? '/register' : '/login'}
                                className="cta-btn cta-btn--primary cta-btn--large"
                            >
                                Get Started Today
                            </a>
                        </div>
                    </SectionReveal>

                    <div
                        style={{
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            paddingTop: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 20,
                        }}
                    >
                        <div>
                            <span
                                style={{
                                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                                    fontSize: '1.15rem',
                                    fontWeight: 600,
                                    color: '#ffffff',
                                    display: 'block',
                                    marginBottom: 4,
                                    letterSpacing: '0.04em',
                                }}
                            >
                                TheKingsVault
                            </span>
                            <span
                                style={{
                                    fontFamily: '"DM Sans", sans-serif',
                                    fontSize: '0.78rem',
                                    color: 'rgba(255,255,255,0.3)',
                                    letterSpacing: '0.08em',
                                }}
                            >
                                Where Every Shot is Secured
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                            <a
                                href="#"
                                aria-label="Instagram"
                                style={{ color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}
                                onMouseEnter={(e) =>
                                    ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)')
                                }
                                onMouseLeave={(e) =>
                                    ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')
                                }
                            >
                                <Instagram size={18} strokeWidth={1.5} />
                            </a>
                            <a
                                href="#"
                                aria-label="Twitter / X"
                                style={{ color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}
                                onMouseEnter={(e) =>
                                    ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)')
                                }
                                onMouseLeave={(e) =>
                                    ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')
                                }
                            >
                                <Twitter size={18} strokeWidth={1.5} />
                            </a>
                            <a
                                href="mailto:hello@thekingsvault.com"
                                aria-label="Email"
                                style={{ color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}
                                onMouseEnter={(e) =>
                                    ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)')
                                }
                                onMouseLeave={(e) =>
                                    ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')
                                }
                            >
                                <Mail size={18} strokeWidth={1.5} />
                            </a>
                        </div>

                        <span
                            style={{
                                fontFamily: '"DM Sans", sans-serif',
                                fontSize: '0.75rem',
                                color: 'rgba(255,255,255,0.2)',
                            }}
                        >
                            {`© ${new Date().getFullYear()} TheKingsMedia. All rights reserved.`}
                        </span>
                    </div>
                </footer>
            </div>

            <ScrollIndicator sections={SECTIONS} />
        </>
    );
}
