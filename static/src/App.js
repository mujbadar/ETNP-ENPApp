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

// West Inwood Community Partnership Logo Component
const WestInwoodLogo = ({ size = 40, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    style={{ display: "inline-block" }}
  >
    {/* Rounded rectangle background */}
    <rect
      x="10"
      y="10"
      width="80"
      height="80"
      rx="12"
      ry="12"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
    />

    {/* Heart shape */}
    <g transform="translate(50, 25)">
      <path
        d="M0,15 C0,10 -8,5 -12,10 C-12,5 -20,5 -20,15 C-20,25 0,35 0,35 C0,35 20,25 20,15 C20,5 12,5 12,10 C8,5 0,10 0,15 Z"
        fill="white"
        transform="scale(0.8)"
      />

      {/* Community figures inside heart */}
      <g fill="currentColor" transform="scale(0.6)">
        {/* Top figure */}
        <circle cx="0" cy="-5" r="3" />
        <rect x="-2" y="-2" width="4" height="6" rx="1" />

        {/* Left figure */}
        <circle cx="-8" cy="2" r="2.5" />
        <rect x="-9.5" y="4" width="3" height="5" rx="1" />

        {/* Right figure */}
        <circle cx="8" cy="2" r="2.5" />
        <rect x="6.5" y="4" width="3" height="5" rx="1" />

        {/* Bottom left figure */}
        <circle cx="-5" cy="8" r="2" />
        <rect x="-6" y="10" width="2" height="4" rx="1" />

        {/* Bottom right figure */}
        <circle cx="5" cy="8" r="2" />
        <rect x="4" y="10" width="2" height="4" rx="1" />
      </g>
    </g>
  </svg>
);

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
      // On home page, prevent Link navigation and scroll directly
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    // On about page, let the Link navigate normally to home page with hash
  };

  return (
    <header className="navbar">
      <div className="container nav-row">
        <Link to="/" className="brand">
          <WestInwoodLogo size={32} className="accent" />
          <span className="brand-name">{CONFIG.shortName}</span>
        </Link>
        <nav className="nav-links">
          <Link to="/#benefits" onClick={handleSectionClick("benefits")}>
            Benefits
          </Link>
          <Link to="/#perks" onClick={handleSectionClick("perks")}>
            Member Perks
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
            About Us
          </Link>
          <a href="/patrol" className="btn btn-secondary btn-sm">
            ENP Patrol App
          </a>
          <Link
            to="/#join"
            className="btn btn-primary btn-sm"
            onClick={handleJoinClick}
          >
            Join
          </Link>
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
              ["Member Perks", "#perks"],
              ["Participation", "#participation"],
              ["Budget", "#budget"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="mobile-link">
                {label}
              </a>
            ))}
            <Link to="/about" className="mobile-link">
              About Us
            </Link>
            <a href="#join" className="btn btn-primary">
              Join
            </a>
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
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <WestInwoodLogo
              size={64}
              className="accent"
              style={{ marginRight: "16px" }}
            />
            <div>
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
                West Inwood
              </h2>
              <p style={{ margin: 0, fontSize: "16px", color: "var(--muted)" }}>
                Community Partnership
              </p>
            </div>
          </div>
          <Pill>Community‑led • Safety‑focused</Pill>
          <h1 className="h1">
            Keep {CONFIG.serviceArea} safe with{" "}
            <span className="accent-text">Community Partnership</span>
          </h1>
          <p className="lead">
            A community-driven initiative connecting neighbors, promoting
            safety, and building stronger relationships throughout West Inwood
            through collaboration and shared resources.
          </p>
          <div className="btn-row">
            <button onClick={onOpenContactModal} className="btn btn-primary">
              Join Our Community
            </button>
            <a href="#participation" className="btn btn-ghost">
              See coverage
            </a>
          </div>
          <p className="note">
            <Info className="icon-sm" /> {CONFIG.meetingNote}
          </p>
        </div>
        <div className="visual-card">
          {/* <div className="map-container">
            <NeighborhoodMap className="neighborhood-map" />
          </div> */}
          <div className="visual-badges">
            <div className="badge">
              <MapPin className="icon accent" />
              <p className="badge-text">Our Neighborhood</p>
            </div>
            <div className="badge">
              <Users className="icon accent" />
              <p className="badge-text">Community Focused</p>
            </div>
            <div className="badge">
              <ShieldCheck className="icon accent" />
              <p className="badge-text">Safety Partnership</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section id="benefits" className="section">
      <SectionHeading
        kicker="Why ENP"
        title="Neighborhood Patrol Benefits"
        subtitle="Evidence‑based safety measures that work for residential blocks."
      />
      <div className="container cards-3">
        {CONFIG.benefits.map((b) => (
          <div key={b.title} className="card">
            <div className="avatar accent-bg">{b.icon}</div>
            <h3 className="h3">{b.title}</h3>
            <p className="muted">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Perks() {
  return (
    <section id="perks" className="section alt">
      <SectionHeading
        kicker="Membership"
        title="Contributing Member Perks"
        subtitle="Added peace of mind for neighbors who fund the ENP."
      />
      <div className="container cards-3">
        {CONFIG.perks.map((p) => (
          <div key={p.title} className="card">
            <div className="avatar accent-bg">{p.icon}</div>
            <h3 className="h3">{p.title}</h3>
            <p className="muted">{p.desc}</p>
          </div>
        ))}
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
    <section id="participation" className="section">
      <SectionHeading
        kicker="Neighbors In"
        title="Participation Snapshot"
        subtitle="A quick look at streets that have raised their hand so far."
      />
      <div className="container two-col">
        <div className="panel">
          <h4 className="h4 row-title">
            <Users className="icon accent" /> Contributing Streets
          </h4>
          {/* <ul className="street-list">
            {CONFIG.streets.map((s) => (
              <li key={s.name} className="street-item">
                <span>{s.name}</span>
                <span className="muted">{s.homes} homes</span>
              </li>
            ))}
          </ul> */}
          <p className="muted mt">
            This is a preview list. We currently have <strong>{total}</strong>{" "}
            interested homes overall.
          </p>
          <div className="callout">
            <p>Current contributions get us:</p>
            <h4 className="shift-text">3 shifts/week (416 hrs)</h4>
            <p classname="small">+19 additional seasonal shifts!</p>
          </div>
        </div>
        <div className="panel">
          <h4 className="h4 row-title">
            <MapPin className="icon accent" /> Service Area
          </h4>
          <p className="muted">
            {CONFIG.serviceArea}. Detailed patrol routes are planned with DPD to
            focus on high‑traffic and vulnerable blocks.
          </p>
          <div
            className="participation-map-container interactive-map"
            onClick={openMapOverlay}
            title="Click to view larger map"
          >
            <NeighborhoodMap className="participation-map" />
            <div className="map-overlay-hint">
              <MapPin size={16} />
              <span>Click to enlarge</span>
            </div>
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
      q: "Who patrols the neighborhood?",
      a: "Off‑duty Dallas Police officers, in uniform, using a city vehicle under the ENP program. They have the authority to enforce laws, make arrests, and respond to emergencies.",
    },
    {
      q: "What do members get?",
      a: "A direct phone line to on‑duty ENP officers during patrol hours, plus optional vacation watches through our contributor app.",
    },
    {
      q: "How are funds used?",
      a: "100% for safety: officer pay, vehicle plan, patrol scheduling, and essential admin.",
    },
  ];
  return (
    <section id="faq" className="section">
      <SectionHeading kicker="Questions" title="FAQ" />
      <div className="container faq-grid">
        {faqs.map((f) => (
          <div key={f.q} className="panel">
            <h4 className="h4">{f.q}</h4>
            <p className="muted">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Join({ onOpenContactModal }) {
  return (
    <section id="join" className="join">
      <div className="container join-grid">
        <div>
          <SectionHeading
            title="Ready to join our community?"
            subtitle="Join West Inwood Community Partnership. Your participation helps build a stronger, safer neighborhood for everyone."
          />
          <div className="btn-row">
            <button onClick={onOpenContactModal} className="btn btn-primary">
              Join Now
            </button>
            <a href={`mailto:${CONFIG.contactEmail}`} className="btn btn-ghost">
              Email us
            </a>
          </div>
          <p className="note">Questions about dues?</p>
          <p className="muted">
            Email us at{" "}
            <a href={`mailto:${CONFIG.contactEmail}`} className="blue-link">
              {CONFIG.contactEmail}
            </a>
          </p>
        </div>
        <div className="stats">
          <div className="stat">
            <p className="stat-value">{CONFIG.homesCount}</p>
            <p className="stat-label">Homes interested</p>
          </div>
          <div className="stat">
            <p className="stat-value">$600</p>
            <p className="stat-label">Annual pledge</p>
            <p className="small">
              * More contributions are welcome if you are willing.
            </p>
          </div>
          <div className="stat stat-wide">
            <p className="small">
              <PhoneCall className="icon-sm" /> Direct ENP line for contributing
              homes
            </p>
            <p className="small">
              <Calendar className="icon-sm" /> Optional vacation watch
              notifications
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-row">
        <div className="brand">
          <ShieldCheck className="icon accent" />
          <span className="brand-name">{CONFIG.shortName}</span>
        </div>
        <div className="foot-text">
          <p>{CONFIG.orgName}</p>
          <p>{CONFIG.serviceArea}</p>
          <p>
            Contact:{" "}
            <a href={`mailto:${CONFIG.contactEmail}`}>{CONFIG.contactEmail}</a>
          </p>
        </div>
        <div className="foot-text">
          <p>
            © {new Date().getFullYear()} {CONFIG.shortName}. All rights
            reserved.
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
      <Perks />
      <Participation />
      {/* <Budget /> */}
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
