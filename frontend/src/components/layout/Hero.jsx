import Button from "../ui/Button";
import DashboardPreview from "./DashboardPreview";
function Hero() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 py-20">
        {/* Left Side */}
        <div className="max-w-xl">
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
        </div>

        {/* Right Side */}
        <div className="flex flex-1 items-center justify-center">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}

export default Hero;
