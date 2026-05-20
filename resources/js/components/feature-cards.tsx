import { Archive, CalendarCheck, CreditCard, Users } from 'lucide-react';
import SectionReveal from '@/components/section-reveal';

const features = [
    {
        icon: Archive,
        title: 'Organized File Vault',
        description:
            'Every photo shoot lives in its own secure vault. Effortlessly browse, sort, and deliver galleries to clients with precision.',
    },
    {
        icon: CalendarCheck,
        title: 'Smart Booking System',
        description:
            'Manage session bookings, dates, and client details from a single elegant dashboard. No double-bookings, ever.',
    },
    {
        icon: CreditCard,
        title: 'Payment Tracking',
        description:
            'Track deposits, balances, and full payments per client. Know exactly who has paid and what remains outstanding.',
    },
    {
        icon: Users,
        title: 'Client Portal',
        description:
            'Give clients their own portal to view, download, and approve their gallery — professional, private, and seamless.',
    },
];

export default function FeatureCards() {
    return (
        <section
            id="features"
            style={{
                background: '#0a0a0a',
                padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
            }}
        >
            {/* Section label */}
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
                    Built for photographers
                </p>
                <h2
                    style={{
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                        fontWeight: 300,
                        color: '#f0f0f0',
                        textAlign: 'center',
                        marginBottom: 'clamp(48px, 7vw, 80px)',
                        lineHeight: 1.15,
                        letterSpacing: '0.01em',
                    }}
                >
                    Everything you need,
                    <br />
                    <span
                        style={{
                            color: 'rgba(255,255,255,0.4)',
                            fontStyle: 'italic',
                        }}
                    >
                        nothing you don't.
                    </span>
                </h2>
            </SectionReveal>

            {/* Cards grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                    gap: 20,
                    maxWidth: 1100,
                    margin: '0 auto',
                }}
            >
                {features.map((feature, i) => {
                    const Icon = feature.icon;

                    return (
                        <SectionReveal key={feature.title} delay={i * 0.1}>
                            <div className="feature-card">
                                <div className="feature-card__icon-wrap">
                                    <Icon size={22} strokeWidth={1.5} />
                                </div>
                                <h3 className="feature-card__title">
                                    {feature.title}
                                </h3>
                                <p className="feature-card__desc">
                                    {feature.description}
                                </p>
                            </div>
                        </SectionReveal>
                    );
                })}
            </div>
        </section>
    );
}
