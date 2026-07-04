"use client";


import BaseButton from "../ui/BaseButton";

// 1. Core Comparison Features Matrix Data Array
const COMPARISON_FEATURES = [
  {
    id: "feat-lessons-count",
    name: "Number of lessons that can be created",
    freeValue: "Up to 5 Lessons",
    premiumValue: "Unlimited Lessons",
    isPremiumHighlight: true,
  },
  {
    id: "feat-premium-create",
    name: "Premium lesson creation access",
    freeValue: false,
    premiumValue: true,
    isPremiumHighlight: false,
  },
  {
    id: "feat-ad-free",
    name: "Ad-free experience",
    freeValue: false,
    premiumValue: true,
    isPremiumHighlight: false,
  },
  {
    id: "feat-priority",
    name: "Priority listing in public lessons",
    freeValue: false,
    premiumValue: true,
    isPremiumHighlight: false,
  },
  {
    id: "feat-premium-view",
    name: "Access to premium content from other users",
    freeValue: false,
    premiumValue: true,
    isPremiumHighlight: false,
  },
  {
    id: "feat-badge",
    name: "Community badge / verified status",
    freeValue: "Standard",
    premiumValue: "Premium ⭐ Badge",
    isPremiumHighlight: true,
  },
];

export default function PricingComparison({ onUpgradeClick, className = "", isPremiumUser = false }) {

  // Reusable Access Render Indicators
  const renderStatus = (val) => {
    if (typeof val === "string") {
      return <span className="font-medium text-sm sm:text-base">{val}</span>;
    }
    if (val === true) {
      return (
        <div className="text-success flex justify-center" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.14-.082l4-5.6Z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    return (
      <div className="text-muted/40 flex justify-center" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
        </svg>
      </div>
    );
  };

  return (
    <section className={`w-full transition-colors duration-300 ${className}`}>
      <div className="max-w-7xl mx-auto">

        {/* Section Typography Intro Wrapper */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            Compare Features & Tiers
          </h2>
          <p className="mt-4 text-base lg:text-lg text-muted max-w-2xl mx-auto">
            See exactly what you unlock when moving from our standard tier up to lifelong Premium membership access.
          </p>
        </div>

        {/* 🚨 DESKTOP LAYOUT (Visible from md viewports up) */}
        <div className="hidden md:block overflow-hidden border border-border rounded-2xl bg-card shadow-sm transition-colors duration-300">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-surface/50 transition-colors duration-300">
                <th scope="col" className="p-6 text-sm font-semibold text-foreground uppercase tracking-wider w-2/5">
                  Platform Core Features
                </th>
                <th scope="col" className="p-6 text-sm font-semibold text-muted uppercase tracking-wider text-center w-1/5">
                  Free Tier
                </th>
                <th scope="col" className="p-6 text-sm font-semibold text-secondary uppercase tracking-wider text-center w-2/5 bg-surface transition-colors duration-300 relative">
                  <div className="absolute top-0 inset-x-0 h-1 bg-secondary" />
                  Premium Tier
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {COMPARISON_FEATURES.map((feature) => (
                <tr key={feature.id} className="hover:bg-surface/30 transition-colors duration-150">
                  <td className="p-6 text-muted text-base">
                    {feature.name}
                  </td>
                  <td className="p-6 text-center text-muted text-base">
                    <span className="sr-only">Free: </span>
                    {renderStatus(feature.freeValue)}
                  </td>
                  <td className={`p-6 text-center text-base bg-surface/40 transition-colors duration-300 font-semibold ${feature.isPremiumHighlight ? "text-secondary" : "text-foreground"}`}>
                    <span className="sr-only">Premium: </span>
                    {renderStatus(feature.premiumValue)}
                  </td>
                </tr>
              ))}

              {/* Call to Action Row */}
              <tr>
                <td className="p-6 bg-transparent" />
                <td className="p-6 text-center text-sm font-medium text-muted bg-transparent">
                  Your Current Active Tier
                </td>
                <td className="p-6 text-center bg-surface relative">
                  {isPremiumUser ? (
                    <div className="text-secondary font-bold text-lg flex items-center justify-center gap-1.5">
                      Premium Active ⭐
                    </div>
                  ) : (
                    <div>
                      <form action="/api/checkout_sessions" method="POST">
                        <section>
                          <BaseButton
                            type="submit"
                            role="link"
                            animated
                            animatedSpanOne={'animate-ping'}
                            onClick={onUpgradeClick}
                            className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold tracking-wide transition-all duration-200 transform active:scale-[0.98] shadow-md shadow-primary/10 cursor-pointer"
                          >
                            Upgrade to Premium (৳1500)
                          </BaseButton>
                        </section>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 📱 MOBILE RESPONSIVE STACK (Visible only on small mobile screen viewports) */}
        <div className="block md:hidden space-y-6">
          <div className="space-y-4">
            {COMPARISON_FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="border border-border bg-card rounded-xl p-5 space-y-4 shadow-sm transition-colors duration-300"
              >
                <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
                  {feature.name}
                </h3>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted block">
                      Free
                    </span>
                    <div className="text-muted flex items-center">
                      {renderStatus(feature.freeValue)}
                    </div>
                  </div>
                  <div className="space-y-1 border-l border-border pl-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-secondary block">
                      Premium
                    </span>
                    <div className={`flex items-center font-bold ${feature.isPremiumHighlight ? "text-secondary" : "text-foreground"}`}>
                      {renderStatus(feature.premiumValue)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Sticky Mobile Upgrade CTA Box */}
          <div className="border border-secondary/30 bg-surface rounded-xl p-5 text-center relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 inset-x-0 h-1 bg-secondary" />
            <h4 className="text-lg font-bold text-foreground mb-1">Lifetime Premium Access</h4>
            <p className="text-sm text-muted mb-4">One-time payments of ৳1500 gives full access forever.</p>
            {isPremiumUser ? (
              <div className="py-3 text-secondary font-bold border border-secondary/20 rounded-xl bg-card">
                Premium Active ⭐
              </div>
            ) : (
              <div>
                <form action="/api/checkout_sessions" method="POST">
                  <section>
                    <BaseButton
                      type="submit"
                      role="link"
                      animated
                      animatedSpanOne={'animate-ping'}
                      onClick={onUpgradeClick}
                      className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold tracking-wide transition-all duration-200 transform active:scale-[0.98] shadow-md shadow-primary/10 cursor-pointer"
                    >
                      Upgrade to Premium (৳1500)
                    </BaseButton>
                  </section>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}