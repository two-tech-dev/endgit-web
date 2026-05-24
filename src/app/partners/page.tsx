import { Handshake, ExternalLink, Mail } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners - EndGit",
  description:
    "Our partners help power the Endstone plugin ecosystem. Learn about our partners and how to become one.",
};

const PARTNERS = [
  {
    name: "SparkedHost",
    logo: "/partners/SparkedHost.svg",
    url: "https://sparkedhost.com",
    description:
      "Premium game server hosting with dedicated support for Endstone servers. Fast, reliable, and developer-friendly.",
  },
];

const BENEFITS = [
  {
    title: "Brand Visibility",
    description:
      "Your logo featured on our home page, partner page, and across the EndGit ecosystem.",
  },
  {
    title: "Community Reach",
    description:
      "Access to the growing Endstone developer community building the next generation of Bedrock plugins.",
  },
  {
    title: "Co-marketing",
    description:
      "Joint announcements, featured integrations, and cross-promotion opportunities.",
  },
  {
    title: "Early Access",
    description:
      "Preview upcoming features and APIs before public release. Shape the platform roadmap.",
  },
];

export default function PartnersPage() {
  return (
    <div className="container py-10 lg:py-16">
      <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
        <Handshake size={40} className="text-brand mx-auto mb-4" />
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary mb-3">
          Our Partners
        </h1>
        <p className="text-text-secondary text-base lg:text-lg">
          These organizations help power the Endstone plugin ecosystem. Together
          we&apos;re building the future of Bedrock server plugins.
        </p>
      </div>

      <section className="mb-16 lg:mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PARTNERS.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-6 flex flex-col items-center text-center gap-4 hover:border-brand/30 transition-all group"
            >
              <div className="h-24 flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-48 object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-lg flex items-center justify-center gap-2">
                  {partner.name}
                  <ExternalLink size={14} className="text-text-muted" />
                </h3>
                <p className="text-sm text-text-muted mt-2">
                  {partner.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mb-16 lg:mb-20">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
          Partnership Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="border border-border rounded-xl p-5 bg-surface-card"
            >
              <h3 className="font-semibold text-text-primary mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-text-muted">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center border border-border rounded-xl p-8 lg:p-12 bg-surface-card max-w-2xl mx-auto">
        <h2 className="text-xl lg:text-2xl font-bold text-text-primary mb-3">
          Become a Partner
        </h2>
        <p className="text-text-secondary mb-6">
          Interested in partnering with EndGit? We&apos;re looking for
          organizations that share our vision of empowering the Endstone
          ecosystem.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:partners@endgit.dev"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Mail size={16} /> Contact Us
          </a>
          <Link
            href="/"
            className="btn inline-flex items-center gap-2 border border-border bg-surface-secondary text-text-primary"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
