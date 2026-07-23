import Button from "../ui/Button";
import Container from "../ui/Container";
import Section from "../ui/Section";

function CTASection() {
  return (
    <Section className="bg-linear-to-r from-blue-600 to-indigo-700 text-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="text-4xl font-bold"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Ready to modernize your fleet operations?
          </h2>

          <p className="mt-6 text-lg text-blue-100">
            Join organizations using TransitOps to streamline fleet management,
            improve efficiency, and gain real-time operational insights.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg">Get Started</Button>

            <Button variant="outline" size="lg">
              Request Demo
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default CTASection;
