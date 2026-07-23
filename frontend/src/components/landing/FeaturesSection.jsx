import {
  Truck,
  MapPinned,
  BarChart3,
  Bot,
  Wrench,
  ShieldCheck,
} from "lucide-react";

import Container from "../ui/Container";
import Section from "../ui/Section";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Truck,
    title: "Fleet Management",
    description:
      "Manage vehicles, drivers, and fleet operations from one centralized dashboard.",
  },
  {
    icon: MapPinned,
    title: "Live Tracking",
    description:
      "Monitor fleet activity in real time with accurate location tracking and trip visibility.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Visualize fleet utilization, trip performance, and operational metrics through interactive dashboards.",
  },
  {
    icon: Bot,
    title: "AI Fleet Assistant",
    description:
      "Receive intelligent recommendations for maintenance scheduling and operational efficiency.",
  },
  {
    icon: Wrench,
    title: "Maintenance Planning",
    description:
      "Track service history, upcoming maintenance, and reduce unexpected vehicle downtime.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "Secure authentication, role-based access control, and protected operational data.",
  },
];

function FeaturesSection() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            Features
          </span>

          <h2
            className="mt-6 text-4xl font-bold text-slate-900"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Everything you need to manage your fleet
          </h2>

          <p className="mt-6 text-lg text-slate-600">
            TransitOps combines fleet management, analytics, maintenance,
            tracking, and AI-powered insights into one modern platform.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default FeaturesSection;
