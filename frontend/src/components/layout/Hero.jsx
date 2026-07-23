import { motion } from "framer-motion";
import Button from "../ui/Button";
import Container from "../ui/Container";
import DashboardPreview from "./DashboardPreview";
function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Background Blur Shapes */}

      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />

      <div className="absolute top-20 right-0 h-112 w-md rounded-full bg-indigo-300/15 blur-3xl" />

      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl" />
      <Container className="relative z-10">
        <div className="flex min-h-[calc(100vh-80px)] items-center py-20">
          {/* Left Side */}
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              🚀 Built for modern fleets
            </span>

            <h1
              className="mt-8 text-6xl font-bold leading-tight text-slate-900"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Intelligent Fleet
              <br />
              Operations Platform
            </h1>

            <p className="mt-8 text-lg leading-8 text-slate-600">
              Monitor, manage and optimize your fleet in real-time. Improve
              efficiency, reduce operational costs, and make smarter decisions
              with AI-powered insights.
            </p>

            <div className="mt-10 flex gap-4">
              <Button size="lg">Start Free Trial</Button>

              <Button variant="outline" size="lg">
                Request Demo
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap gap-6 text-sm text-slate-500">
              <span>📍 Real-time Tracking</span>

              <span>🤖 AI Insights</span>

              <span>🛡️ Secure & Reliable</span>
            </div>
          </motion.div>

          {/* Right Side */}
          <motion.div
            className="flex flex-1 items-center justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <DashboardPreview />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
