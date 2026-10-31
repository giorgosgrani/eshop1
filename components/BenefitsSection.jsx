"use client"

import {
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
} from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      id: 1,
      icon: Truck,
      title: "Γρήγορη αποστολή",
      description: "Παράδοση σε όλη την Ελλάδα",
    },
    {
      id: 2,
      icon: ShieldCheck,
      title: "Ασφαλείς αγορές",
      description: "Προστατευμένες συναλλαγές",
    },
    {
      id: 3,
      icon: RefreshCw,
      title: "Εύκολες επιστροφές",
      description: "Απλή διαδικασία επιστροφής",
    },
    {
      id: 4,
      icon: Headphones,
      title: "Εξυπηρέτηση πελατών",
      description: "Είμαστε εδώ για βοήθεια",
    },
  ];

  return (
    <section className="benefits-section">
      {benefits.map((benefit) => {
        const Icon = benefit.icon;

        return (
          <div className="benefit-card" key={benefit.id}>
            <Icon size={28} strokeWidth={1.6} />

            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>
        );
      })}
    </section>
  );
}