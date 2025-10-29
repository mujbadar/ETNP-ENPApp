import React, { useMemo, useState } from "react";
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
  MapPin,
  DollarSign,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";

// West Inwood Community Partnership Logo Component (Icon only)
const WestInwoodLogoIcon = ({ size = 40, className = "", style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    style={{ display: "inline-block", ...style }}
  >
    {/* Rounded square background */}
    <rect
      x="5"
      y="5"
      width="90"
      height="90"
      rx="20"
      ry="20"
      fill="currentColor"
    />

    {/* Community figures forming heart shape - all in white */}
    <g fill="white">
      {/* Top center person */}
      <circle cx="50" cy="28" r="3.5" />
      <path d="M 50 32 L 47 35 L 47 42 L 53 42 L 53 35 Z" />

      {/* Left top person (left lobe of heart) */}
      <circle cx="35" cy="33" r="3.5" />
      <path d="M 35 37 L 32 40 L 32 47 L 38 47 L 38 40 Z" />

      {/* Right top person (right lobe of heart) */}
      <circle cx="65" cy="33" r="3.5" />
      <path d="M 65 37 L 62 40 L 62 47 L 68 47 L 68 40 Z" />

      {/* Left middle person */}
      <circle cx="28" cy="45" r="3" />
      <path d="M 28 48.5 L 25.5 51 L 25.5 57 L 30.5 57 L 30.5 51 Z" />

      {/* Right middle person */}
      <circle cx="72" cy="45" r="3" />
      <path d="M 72 48.5 L 69.5 51 L 69.5 57 L 74.5 57 L 74.5 51 Z" />

      {/* Left lower middle person */}
      <circle cx="37" cy="55" r="3" />
      <path d="M 37 58.5 L 34.5 61 L 34.5 67 L 39.5 67 L 39.5 61 Z" />

      {/* Right lower middle person */}
      <circle cx="63" cy="55" r="3" />
      <path d="M 63 58.5 L 60.5 61 L 60.5 67 L 65.5 67 L 65.5 61 Z" />

      {/* Left lower person */}
      <circle cx="43" cy="65" r="2.8" />
      <path d="M 43 68 L 40.8 70 L 40.8 75 L 45.2 75 L 45.2 70 Z" />

      {/* Right lower person */}
      <circle cx="57" cy="65" r="2.8" />
      <path d="M 57 68 L 54.8 70 L 54.8 75 L 59.2 75 L 59.2 70 Z" />

      {/* Bottom center person (point of heart) */}
      <circle cx="50" cy="74" r="2.8" />
      <path d="M 50 77 L 47.8 79 L 47.8 84 L 52.2 84 L 52.2 79 Z" />
    </g>
  </svg>
);

// Full West Inwood Logo with Text
const WestInwoodLogo = ({ height = 60, className = "", style = {} }) => {
  return (
    <svg
      height={height}
      viewBox="0 0 400 100"
      className={className}
      style={{ display: "inline-block", ...style }}
      preserveAspectRatio="xMinYMid meet"
    >
      {/* Icon with white outline */}
      <g transform="translate(0, 0)">
        {/* White outline */}
        <rect
          x="8"
          y="8"
          width="84"
          height="84"
          rx="18"
          ry="18"
          fill="none"
          stroke="white"
          strokeWidth="3"
        />
        {/* Navy background */}
        <rect
          x="12"
          y="12"
          width="76"
          height="76"
          rx="15"
          ry="15"
          fill="currentColor"
        />
        {/* People figures in white */}
        <g fill="white">
          <circle cx="50" cy="28" r="3.5" />
          <path d="M 50 32 L 47 35 L 47 42 L 53 42 L 53 35 Z" />
          <circle cx="35" cy="33" r="3.5" />
          <path d="M 35 37 L 32 40 L 32 47 L 38 47 L 38 40 Z" />
          <circle cx="65" cy="33" r="3.5" />
          <path d="M 65 37 L 62 40 L 62 47 L 68 47 L 68 40 Z" />
          <circle cx="28" cy="45" r="3" />
          <path d="M 28 48.5 L 25.5 51 L 25.5 57 L 30.5 57 L 30.5 51 Z" />
          <circle cx="72" cy="45" r="3" />
          <path d="M 72 48.5 L 69.5 51 L 69.5 57 L 74.5 57 L 74.5 51 Z" />
          <circle cx="37" cy="55" r="3" />
          <path d="M 37 58.5 L 34.5 61 L 34.5 67 L 39.5 67 L 39.5 61 Z" />
          <circle cx="63" cy="55" r="3" />
          <path d="M 63 58.5 L 60.5 61 L 60.5 67 L 65.5 67 L 65.5 61 Z" />
          <circle cx="43" cy="65" r="2.8" />
          <path d="M 43 68 L 40.8 70 L 40.8 75 L 45.2 75 L 45.2 70 Z" />
          <circle cx="57" cy="65" r="2.8" />
          <path d="M 57 68 L 54.8 70 L 54.8 75 L 59.2 75 L 59.2 70 Z" />
          <circle cx="50" cy="74" r="2.8" />
          <path d="M 50 77 L 47.8 79 L 47.8 84 L 52.2 84 L 52.2 79 Z" />
        </g>
      </g>

      {/* Text - "West" in regular, "Inwood" in italic */}
      <text
        x="110"
        y="55"
        fontFamily="Georgia, serif"
        fontSize="40"
        fontWeight="400"
        fill="white"
      >
        West
      </text>
      <text
        x="110"
        y="90"
        fontFamily="Georgia, serif"
        fontSize="40"
        fontWeight="400"
        fontStyle="italic"
        fill="white"
      >
        Inwood
      </text>
    </svg>
  );
};

/**
 * West Inwood Community Partnership — Static Microsite (React, plain CSS)
 * ----------------------------------------------------------------
 * • Tailwind removed. Uses semantic classNames and the CSS at the bottom of this file.
 * • Copy the CSS between the === CSS START/END === markers into App.css (or index.css)
 * • Import that CSS once in your root (e.g., `import './App.css'`).
 */

// ------------------ CONFIG: Edit these values ------------------
const CONFIG = {
  orgName: "West Inwood Community Partnership",
  shortName: "West Inwood", // used in header/footer
  contactEmail: "etnp.neighborhoodpatrol@gmail.com",
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
  duesOptions: [400, 600, 700, 800],
  officerHourly: 65.0, // $/hr
  vehiclePlanA: {
    monthlyCar: 420, // $/mo
    monthlyMDT: 217, // $/mo
    hourly: 0.62, // $/hr while patrolling
  },
};
// ---------------------------------------------------------------

function SectionHeading({ kicker, title, subtitle }) {
  return (
    <div className="section-heading">
      {kicker && <p className="kicker">{kicker}</p>}
      <h2 className="h2">{title}</h2>
      {subtitle && <p className="subtle">{subtitle}</p>}
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="pill">
      <CheckCircle2 className="icon-sm accent" />
      {children}
    </span>
  );
}

function Navbar({ onOpenContactModal }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isAboutPage = location.pathname === "/about";
  const isHomePage = location.pathname === "/";

  const handleJoinClick = (e) => {
    if (isAboutPage) {
      e.preventDefault();
      onOpenContactModal();
    } else if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById("join");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
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
          <WestInwoodLogo height={60} style={{ color: "var(--navy-dark)" }} />
        </Link>
        <nav className="nav-links">
          <Link to="/#benefits" onClick={handleSectionClick("benefits")}>
            Benefits
          </Link>
          <Link to="/#services" onClick={handleSectionClick("services")}>
            Services
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
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/patrol";
            }}
            className="nav-link"
            style={{ marginRight: "8px" }}
          >
            Member Login
          </a>
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
              ["Benefits", "#benefits"],
              ["Services", "#services"],
              ["Participation", "#participation"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="mobile-link"
                onClick={() => setOpen(false)}
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
            <a href="/patrol" className="mobile-link">
              Member Login
            </a>
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
      <div className="container hero-grid">
        <div className="hero-content">
          <p className="hero-subtitle">Extended Neighborhood Patrol</p>
          <h1 className="h1">
            A community-driven initiative connecting neighbors and promoting
            safety.
          </h1>
          <div className="hero-images-mobile">
            <img
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop"
              alt="Community gathering"
              className="hero-img-mobile"
            />
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
              alt="Neighborhood street"
              className="hero-img-mobile"
            />
          </div>
          <button
            onClick={onOpenContactModal}
            className="btn btn-primary btn-large"
          >
            JOIN US
          </button>
        </div>
        <div className="hero-images-desktop">
          <img
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=500&fit=crop"
            alt="Community gathering"
            className="hero-img"
          />
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=500&fit=crop"
            alt="Neighborhood street"
            className="hero-img"
          />
        </div>
      </div>
    </section>
  );
}

function Benefits() {
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
    <section id="benefits" className="section section-white">
      <div className="container">
        <h2 className="section-title">Extended Neighborhood Patrol</h2>
        <p className="section-subtitle">
          A volunteer-based program that hires off-duty DPD officers to patrol
          our streets.
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

function Testimonials() {
  const testimonials = [
    {
      company: "INWOOD RESIDENT",
      text: "The West Inwood Community Partnership has transformed our neighborhood. Knowing we have dedicated officers patrolling our streets gives us real peace of mind.",
    },
    {
      company: "MOCKINGBIRD RESIDENT",
      text: "We've seen a noticeable decrease in suspicious activity since the ENP program started. The officers are professional and truly care about our community.",
    },
    {
      company: "LEMMON RESIDENT",
      text: "Being able to contact an officer directly when we're traveling has been invaluable. The travel watch service alone is worth the investment in our neighborhood's safety.",
    },
  ];

  return (
    <section className="section blue-primary">
      <div className="container">
        <SectionHeading title="What our community says about us" />
        <div className="testimonials-grid">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="testimonial-item">
              <p className="testimonial-company">{testimonial.company}</p>
              <p className="testimonial-text">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkShowcase() {
  const workItems = [
    {
      title: "Community Safety",
      desc: "Regular patrols and neighborhood watch programs have created a safer environment for families.",
      img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop",
    },
    {
      title: "Neighborhood Events",
      desc: "We organize community gatherings that bring neighbors together and strengthen our bonds.",
      img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    },
    {
      title: "Active Engagement",
      desc: "Our members actively participate in making West Inwood a better place to live for everyone.",
      img: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop",
    },
  ];

  return (
    <section id="work" className="section blue-primary">
      <div className="container">
        <SectionHeading title="Our Work" />
        <div className="work-grid">
          {workItems.map((item, idx) => (
            <div key={idx} className="work-item">
              <img
                src={item.img}
                alt={item.title}
                className="work-img"
                onError={(e) => {
                  e.target.style.display = "none";
                  const placeholder = document.createElement("div");
                  placeholder.className = "img-placeholder";
                  placeholder.style.height = "280px";
                  placeholder.textContent = item.title;
                  e.target.parentNode.insertBefore(placeholder, e.target);
                }}
              />
              <div className="work-content">
                <h3 className="h3">{item.title}</h3>
                <p>{item.desc}</p>
                <button className="btn btn-secondary">Learn More</button>
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
          Our neighborhood in West Inwood is backed by {CONFIG.serviceArea}
        </p>
        <div className="participation-content">
          <div className="participation-info">
            <p className="participation-text">
              This is NOT representative of what I'm trying to show.
            </p>
            <p className="participation-details">
              Our neighborhood in <strong>West Inwood</strong> to the east,{" "}
              <strong>Mockingbird</strong> to the south, and{" "}
              <strong>Lemmon</strong> to the West.
            </p>
            <p className="participation-count">
              We currently have <strong>{total}</strong> participating homes.
            </p>
            <p className="participation-note">
              Thank you to our corporate sponsors:
            </p>
            <div className="sponsors">
              <div className="sponsor-badge">OLERO HOMES</div>
              <div className="sponsor-badge">PARTNERS</div>
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

function dollars(x) {
  return x.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function Budget() {
  const fixedAnnual =
    (CONFIG.vehiclePlanA.monthlyCar + CONFIG.vehiclePlanA.monthlyMDT) * 12; // 7,644
  const hourly = CONFIG.officerHourly + CONFIG.vehiclePlanA.hourly; // 65.62

  const data = useMemo(() => {
    return CONFIG.duesOptions.map((dues) => {
      const totalBudget = CONFIG.homesCount * dues;
      const available = Math.max(0, totalBudget - fixedAnnual);
      const hours = available / hourly;
      const shifts = hours / 4;
      return {
        dues,
        totalBudget,
        hours: Number(hours.toFixed(1)),
        shifts: Number(shifts.toFixed(1)),
      };
    });
  }, [fixedAnnual, hourly]);

  return (
    <section id="budget" className="section alt">
      <SectionHeading
        kicker="Coverage"
        title="Budget → Patrol Hours"
        subtitle="How annual dues translate into coverage with Officer + City Vehicle Plan A."
      />
      <div className="container two-wide">
        <div className="panel">
          <h4 className="h4">
            <DollarSign className="icon accent" /> Patrol Hours by Dues
          </h4>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dues" tickFormatter={(v) => `$${v}`} />
                <YAxis />
                <Tooltip
                  formatter={(v, n) =>
                    n === "hours"
                      ? `${v} hrs`
                      : n === "shifts"
                      ? `${v} shifts`
                      : dollars(v)
                  }
                  labelFormatter={(l) => `Dues: $${l}`}
                />
                <Legend />
                <ReferenceLine
                  y={416}
                  stroke="#16a34a"
                  strokeDasharray="6 3"
                  label="≈ 2 shifts/week (416 hrs)"
                />
                <Bar dataKey="hours" name="Hours / yr" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="muted small">
            Assumes {CONFIG.homesCount} homes. Fixed vehicle cost{" "}
            {dollars(fixedAnnual)}/yr + {CONFIG.vehiclePlanA.hourly.toFixed(2)}
            /hr. Officer {dollars(CONFIG.officerHourly)}/hr.
          </p>
        </div>
        <div className="panel">
          <h4 className="h4">Quick Table</h4>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Dues</th>
                  <th>Total Budget</th>
                  <th>Hours</th>
                  <th>4‑hr Shifts</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.dues}>
                    <td>
                      ${"{"}row.dues{"}"}
                    </td>
                    <td>{dollars(row.totalBudget)}</td>
                    <td>{row.hours}</td>
                    <td>{row.shifts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="callout">
            <strong>:</strong> Target <strong>$600</strong> for ~2–3 patrol
            shifts/week and a buffer for rate changes.
          </div>
        </div>
      </div>
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
      a: "100% of funds are dedicated to neighborhood safety: officer pay, vehicle plan, patrol scheduling, communications, and essential administrative costs.",
    },
  ];
  return (
    <section id="faq" className="section section-alt">
      <div className="container">
        <h2 className="section-title">FAQs</h2>
        <div className="faq-list">
          {faqs.map((f, idx) => (
            <div key={idx} className="faq-item">
              <h3 className="faq-question">{f.q}</h3>
              <p className="faq-answer">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Join({ onOpenContactModal }) {
  return (
    <section id="join" className="section section-white">
      <div className="container">
        <h2 className="section-title">Ready to join our community?</h2>
        <p className="section-subtitle">
          Your participation helps build a stronger, safer neighborhood for
          everyone.
        </p>
        <div className="join-cta">
          <button
            onClick={onOpenContactModal}
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
              <WestInwoodLogo
                height={70}
                style={{ color: "var(--navy-dark)" }}
              />
            </div>
            <h3>CONTACT US</h3>
            <ul className="footer-contact-list">
              <li>
                <a href={`mailto:${CONFIG.contactEmail}`}>
                  {CONFIG.contactEmail}
                </a>
              </li>
              <li>
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
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: "white", marginBottom: "24px" }}>
              OUR LOCATIONS
            </h3>
            <div className="footer-locations">
              <div className="location-item">
                <h4>PO Box XXX</h4>
                <p>5600 W. Lovers Lane, Suite 116</p>
                <p>Dallas, TX 75209</p>
              </div>
            </div>
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
      <Benefits />
      <Services />
      <Participation />
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
