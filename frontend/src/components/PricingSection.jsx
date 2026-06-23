import { CheckCircle2 } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["Basic conversion", "Suggestions", "Word guide", "Local use"]
  },
  {
    name: "Pro",
    price: "$9",
    features: ["Saved history", "Advanced suggestions", "Sentence generator", "Export options later"]
  },
  {
    name: "Business",
    price: "$29",
    features: ["Team usage", "API access later", "Bulk conversion later", "Priority support"]
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="section-container">
      <div className="section-heading">
        <p className="eyebrow">SaaS model</p>
        <h2>Pricing system for future monetization</h2>
        <p>This V1 includes frontend pricing flow. Real payment can be added later through Stripe, SSLCommerz, bKash, or Nagad using secure backend integration.</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.name} className="glass-card pricing-card">
            <h3>{plan.name}</h3>
            <strong>{plan.price}</strong>
            {plan.features.map((feature) => (
              <p key={feature}><CheckCircle2 size={16} /> {feature}</p>
            ))}
            <a className="primary-link" href="#converter">Choose plan</a>
          </div>
        ))}
      </div>
    </section>
  );
}
