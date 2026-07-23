import Container from "../ui/Container";
import Logo from "../ui/Logo";
const quickLinks = ["Features", "Solutions", "Pricing", "About"];

const resources = ["Documentation", "Support", "Contact"];

const legal = ["Privacy Policy", "Terms of Service"];

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo size="md" showTagline dark />

            <p className="mt-6 max-w-sm leading-7 text-slate-400">
              A modern fleet management platform built to simplify
              transportation operations through analytics, automation, and
              AI-powered insights.
            </p>

            <div className="mt-8 flex gap-6 text-sm font-medium">
              <a
                href="https://github.com/Hari-preetham-B/TransitOps"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                GitHub
              </a>

              <a href="#" className="transition hover:text-white">
                LinkedIn
              </a>

              <a
                href="mailto:contact@transitops.com"
                className="transition hover:text-white"
              >
                Email
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-semibold text-white">Quick Links</h3>

            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li
                  key={item}
                  className="cursor-pointer transition hover:text-white"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-semibold text-white">Resources</h3>

            <ul className="space-y-3">
              {resources.map((item) => (
                <li
                  key={item}
                  className="cursor-pointer transition hover:text-white"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-semibold text-white">Legal</h3>

            <ul className="space-y-3">
              {legal.map((item) => (
                <li
                  key={item}
                  className="cursor-pointer transition hover:text-white"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
          © 2026 TransitOps. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
