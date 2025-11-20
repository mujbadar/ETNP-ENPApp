import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import "./App.css";
import ContactFormModal from "./ContactFormModal";
import NeighborhoodMap from "./NeighborhoodMap";
import AboutUs from "./AboutUs";
import {
  ShieldCheck,
  PhoneCall,
  Car,
  Users,
  Calendar,
  CheckCircle2,
} from "lucide-react";

/**
 * West Inwood — Static Microsite (React, plain CSS)
 * ----------------------------------------------------------------
 * • Tailwind removed. Uses semantic classNames and the CSS at the bottom of this file.
 * • Copy the CSS between the === CSS START/END === markers into App.css (or index.css)
 * • Import that CSS once in your root (e.g., `import './App.css'`).
 */

// ------------------ CONFIG: Edit these values ------------------
const CONFIG = {
  orgName: "West Inwood",
  shortName: "West Inwood", // used in header/footer
  contactEmail: "westinwood75209@gmail.com",
  meetingNote: "Community Meeting — Next Meeting TBA",
  serviceArea: "West Inwood, Dallas, Texas",
  perks: [
    {
      icon: <PhoneCall className="icon" />,
      title: "Direct ENP Line",
      desc: "Contributing homes receive a private phone number to reach on-duty ENP officers during patrol hours.",
    },
    {
      icon: <Calendar className="icon" />,
      title: "Travel Watch",
      desc: "Let officers know when you’re out of town — they’ll keep an eye on your property during patrol blocks.",
    },
    {
      icon: <Car className="icon" />,
      title: "Dedicated Patrols",
      desc: "Off‑duty DPD officers in city vehicles patrol our streets on a set schedule.",
    },
  ],
  benefits: [
    {
      icon: <ShieldCheck className="icon" />,
      title: "Lower Crime",
      desc: "Neighborhood patrols are associated with meaningful reductions in thefts and break-ins.",
    },
    {
      icon: <Users className="icon" />,
      title: "Deterrence",
      desc: "Visible presence discourages bad actors and loitering.",
    },
    {
      icon: <PhoneCall className="icon" />,
      title: "Faster Help",
      desc: "Officers familiar with the area respond faster during their patrol hours.",
    },
  ],
  // Financial model inputs
  homesCount: 73, // update as your roster grows
};
// ---------------------------------------------------------------

function Navbar({ onOpenContactModal }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isAboutPage = location.pathname === "/about";
  const isHomePage = location.pathname === "/";

  const handleJoinClick = (e) => {
    if (isAboutPage) {
      e.preventDefault();
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLSdHCrrlZiFKjEp7Zy1HCX2KSqZhMziOFprR5_cjF-xWinqrtg/viewform?usp=header",
        "_blank"
      );
    } else if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById("join");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setOpen(false);
  };

  const handleSectionClick = (sectionId) => (e) => {
    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="navbar">
      <div className="container nav-row">
        <Link to="/" className="brand">
          <img
            src="/west-inwood-logo-full.svg"
            alt="West Inwood NA"
            height="80"
            width="95"
            style={{ borderRadius: "8px" }}
          />
        </Link>
        <nav className="nav-links">
          {/* <Link to="/#community" onClick={handleSectionClick("community")}>
            Community
          </Link> */}
          <Link to="/#patrol" onClick={handleSectionClick("patrol")}>
            Patrol
          </Link>
          <Link
            to="/#participation"
            onClick={handleSectionClick("participation")}
          >
            Participation
          </Link>
          <Link to="/#faq" onClick={handleSectionClick("faq")}>
            FAQ
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <button
            onClick={() => {
              window.location.href = "/patrol";
              setOpen(false);
            }}
            className="btn btn-patrol btn-sm"
          >
            ENP Portal
          </button>
          <button onClick={handleJoinClick} className="btn btn-primary btn-sm">
            Join Us
          </button>
        </nav>
        <button
          className="nav-burger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      {open && (
        <div className="nav-mobile">
          <div className="container mobile-grid">
            {[
              // ["Community", "#community"],
              ["Patrol", "#patrol"],
              ["Participation", "#participation"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="mobile-link"
                onClick={(e) => {
                  if (isHomePage) {
                    e.preventDefault();
                    const sectionId = href.replace("#", "");
                    const element = document.getElementById(sectionId);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                  setOpen(false);
                }}
              >
                {label}
              </a>
            ))}
            <Link
              to="/about"
              className="mobile-link"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            <button
              onClick={() => {
                window.location.href = "/patrol";
                setOpen(false);
              }}
              className="btn btn-patrol btn-sm"
            >
              ENP Portal
            </button>
            <button
              onClick={handleJoinClick}
              className="btn btn-primary"
              style={{ marginTop: "12px" }}
            >
              Join Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ onOpenContactModal }) {
  return (
    <section className="hero">
      <div className="container hero-layout">
        {/* Text column */}
        <div className="hero-text-block">
          <p className="hero-subtitle">West Inwood</p>
          <h1 className="hero-heading">Welcome to West Inwood</h1>
          <p className="hero-tagline">
            More than a collection of homes – we are front‑porch hellos,
            tree‑lined streets, block events, watchful neighbors, and a shared
            commitment to keeping West Inwood warm, safe, and connected.
          </p>
          <button
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/e/1FAIpQLSdHCrrlZiFKjEp7Zy1HCX2KSqZhMziOFprR5_cjF-xWinqrtg/viewform?usp=header",
                "_blank"
              )
            }
            className="btn btn-primary hero-cta-main"
          >
            JOIN US
          </button>
        </div>
        {/* Single large image */}
        <div className="hero-image-single">
          <img
            src="/community-party.png"
            alt="Neighbors gathered at a West Inwood community event with tables and pumpkins"
            className="hero-main-img"
          />
        </div>
      </div>

      {/* Community Values */}
      <div className="container hero-values" id="community">
        <div className="hero-values-grid">
          <div className="hero-value">
            <h3 className="hero-value-title">Community Events</h3>
            <p className="hero-value-text">Seasonal gatherings & meet-ups</p>
          </div>
          <div className="hero-value">
            <h3 className="hero-value-title">Shared Safety</h3>
            <p className="hero-value-text">
              Neighbors looking out for each other
            </p>
          </div>
          <div className="hero-value">
            <h3 className="hero-value-title">Open Communication</h3>
            <p className="hero-value-text">Timely updates & collaboration</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PatrolSection() {
  const benefits = [
    {
      icon: <ShieldCheck className="icon" />,
      title: "Lower Crime",
      desc: "Neighborhood Patrols are associated with meaningful reductions in thefts and break-ins.",
    },
    {
      icon: <Users className="icon" />,
      title: "Deterrence",
      desc: "Visible presence discourages bad actors and loitering.",
    },
    {
      icon: <PhoneCall className="icon" />,
      title: "Faster Help",
      desc: "Officers familiar with the area respond faster during their patrol hours.",
    },
  ];
  return (
    <section id="patrol" className="section section-alt">
      <div className="container">
        <h2 className="section-title">Extended Neighborhood Patrol (ENP)</h2>
        <p className="section-subtitle">
          A focused safety initiative: off‑duty DPD officers hired by and
          accountable to our neighborhood.
        </p>
        <div className="benefits-grid">
          {benefits.map((b, idx) => (
            <div key={idx} className="benefit-card">
              <div className="benefit-icon">{b.icon}</div>
              <h3 className="benefit-title">{b.title}</h3>
              <p className="benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      title: "Dedicated Patrols",
      desc: "Off-duty DPD officers in vehicles patrol our streets on a set schedule during patrol hours.",
    },
    {
      title: "Direct ENP Line",
      desc: "Contributing homes receive a phone number to reach on-duty ENP officers during patrol hours.",
    },
    {
      title: "Travel Watch",
      desc: "Officers know when you're out of town — they'll keep an eye on your property during patrol shifts.",
    },
    {
      title: "Members Only Website",
      desc: "Log into the Members only section to track when officers will be on duty and exclusive community info.",
    },
    {
      title: "Security & News Alerts",
      desc: "Through our ENP officers, you can receive timely updates on security issues or relevant news related to the neighborhood.",
    },
  ];

  return (
    <section id="services" className="section section-alt">
      <div className="container">
        <h2 className="section-title">Contributing Member Perks</h2>
        <p className="section-subtitle">
          Added peace of mind for neighbors who fund the ENP.
        </p>
        <div className="perks-grid">
          {services.map((service, idx) => (
            <div key={idx} className="perk-item">
              <div className="perk-check">
                <CheckCircle2 size={24} className="check-icon" />
              </div>
              <div className="perk-content">
                <h3 className="perk-title">{service.title}</h3>
                <p className="perk-desc">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Participation() {
  const total = CONFIG.homesCount;
  const [isMapOverlayOpen, setIsMapOverlayOpen] = useState(false);

  const openMapOverlay = () => setIsMapOverlayOpen(true);
  const closeMapOverlay = () => setIsMapOverlayOpen(false);

  return (
    <section id="participation" className="section section-white">
      <div className="container">
        <h2 className="section-title">Participation Snapshot</h2>
        <p className="section-subtitle">
          Snapshot of the ENP program participation
        </p>
        <div className="participation-content">
          <div className="participation-info">
            <p className="participation-details">
              Our neighborhood is surrounded by <strong>Lovers</strong> to the
              north, <strong>Mockingbird</strong> to the south,{" "}
              <strong>Inwood</strong> to the east, and <strong>Lemmon</strong>{" "}
              to the west.
            </p>
            <p className="participation-count">
              We currently have <strong>{total}</strong> participating homes.
            </p>
            <p className="participation-note">
              Thank you to our corporate sponsors:
            </p>
            <div className="sponsors">
              <div className="sponsor-logo">
                <img
                  src="/olerio.png"
                  alt="Olerio Homes"
                  className="sponsor-img"
                />
              </div>
              <div className="sponsor-logo">
                <img
                  src="/berk-walters.png"
                  alt="Berk Walters Homes"
                  className="sponsor-img"
                />
              </div>
            </div>
          </div>
          <div
            className="participation-map-wrapper"
            onClick={openMapOverlay}
            title="Click to view larger map"
          >
            <NeighborhoodMap className="participation-map" />
          </div>
        </div>
      </div>

      {/* Map Overlay */}
      {isMapOverlayOpen && (
        <div className="map-overlay" onClick={closeMapOverlay}>
          <div
            className="map-overlay-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="map-overlay-header">
              <h3>West Inwood Neighborhood Map</h3>
              <button
                className="overlay-close"
                onClick={closeMapOverlay}
                title="Close map"
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="map-overlay-body">
              <NeighborhoodMap className="overlay-map" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "WHO PATROLS THE NEIGHBORHOOD?",
      a: "Off‑duty Dallas Police officers, in uniform, using a city vehicle under the ENP program. They have the authority to enforce laws, make arrests, and respond to emergencies.",
    },
    {
      q: "WHAT DO MEMBERS GET?",
      a: "A direct phone line to on‑duty ENP officers during patrol hours, plus optional vacation watches through our contributor app and exclusive access to officers will be on duty.",
    },
    {
      q: "HOW ARE CONTRIBUTING FUNDS USED?",
      a: "90% of the funds are dedicated directly to the neighborhood patrol programs: officer pay, vehicle plan, and patrol scheduling. The remaining 10% is used for, essential administrative costs (website, phone plan, etc.) and community events.",
    },
  ];
  return (
    <section id="faq" className="section section-alt">
      <div className="container">
        <h2 className="section-title">FAQs</h2>
        <div className="faq-content">
          <div className="faq-image">
            <img
              src="/bird-street.png"
              alt="Beautiful tree-lined street in West Inwood neighborhood"
              className="faq-street-img"
            />
          </div>
          <div className="faq-list">
            {faqs.map((f, idx) => (
              <div key={idx} className="faq-item">
                <h3 className="faq-question">{f.q}</h3>
                <p className="faq-answer">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PatrolPortal() {
  return (
    <section id="patrol-portal" className="section section-alt">
      <div className="container">
        <h2 className="section-title">ENP Portal</h2>
        <p className="section-subtitle">
          Exclusive member access to real-time patrol information and direct
          officer communication.
        </p>

        {/* Member Benefits Showcase */}
        <div className="join-benefits-showcase">
          <div className="benefit-showcase-item">
            <div className="benefit-showcase-image">
              <img
                src="/portal-home.png"
                alt="Member portal dashboard showing real-time officer status and neighborhood patrol map"
                className="showcase-img showcase-primary"
              />
            </div>
            <div className="benefit-showcase-content">
              <h3 className="benefit-showcase-title">Officer Shift Tracking</h3>
              <p className="benefit-showcase-desc">
                Access your exclusive member portal to see when officers are on
                duty, track patrol status, and contact them directly during
                patrol hours.
              </p>
            </div>
          </div>

          <div className="benefit-showcase-item">
            <div className="benefit-showcase-image">
              <img
                src="/portal-calendar.png"
                alt="ENP patrol schedule calendar showing weekly officer duty times"
                className="showcase-img showcase-secondary"
              />
            </div>
            <div className="benefit-showcase-content">
              <h3 className="benefit-showcase-title">Patrol Schedule Access</h3>
              <p className="benefit-showcase-desc">
                View the complete ENP patrol schedule to know exactly when
                officers will be in the neighborhood and plan accordingly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Join({ onOpenContactModal }) {
  return (
    <section id="join" className="section section-white">
      <div className="container">
        <h2 className="section-title">Ready to join our ENP program?</h2>
        <p className="section-subtitle">
          Your participation helps build a stronger, safer neighborhood for
          everyone.
        </p>
        <div className="join-cta">
          <button
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/e/1FAIpQLSdHCrrlZiFKjEp7Zy1HCX2KSqZhMziOFprR5_cjF-xWinqrtg/viewform?usp=header",
                "_blank"
              )
            }
            className="btn btn-primary btn-large"
          >
            JOIN US
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-row">
          <div className="footer-contact">
            <div style={{ marginBottom: "32px" }}>
              <img
                src="/west-inwood-logo-trans.svg"
                alt="West Inwood NA"
                height="70"
                width="300"
              />
            </div>
            <h3>CONTACT US</h3>
            <ul className="footer-contact-list">
              <li>
                <a href={`mailto:${CONFIG.contactEmail}`}>
                  {CONFIG.contactEmail}
                </a>
              </li>
              {/* <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li> */}
            </ul>
          </div>
        </div>
        <div className="footer-copyright">
          <p>
            © {new Date().getFullYear()} {CONFIG.orgName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function Home({ onOpenContactModal }) {
  return (
    <>
      <Hero onOpenContactModal={onOpenContactModal} />
      <PatrolSection />
      <Services />
      <Participation />
      <PatrolPortal />
      <FAQ />
      <Join onOpenContactModal={onOpenContactModal} />
    </>
  );
}

export default function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    <Router>
      <div className="page">
        <Navbar onOpenContactModal={openContactModal} />
        <Routes>
          <Route
            path="/"
            element={<Home onOpenContactModal={openContactModal} />}
          />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
        <Footer />
        <ContactFormModal
          isOpen={isContactModalOpen}
          onClose={closeContactModal}
        />
      </div>
    </Router>
  );
}
