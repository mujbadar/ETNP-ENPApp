import React from "react";
import { Users, Target, Heart, Mail, Phone } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div
            className="about-hero-content"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <img
              src="/west-inwood-logo.svg"
              alt="West Inwood Logo"
              style={{
                width: "150px",
                height: "150px",
                marginBottom: "2rem",
              }}
            />
            <h1 className="h1">About West Inwood Neighborhood Association</h1>
            <p className="lead">
              Building stronger, safer neighborhoods through community
              collaboration and partnership.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2 className="h2">Our Mission</h2>
          </div>
          <div className="mission-content">
            <div className="mission-card">
              <Heart className="mission-icon" />
              <div className="mission-text">
                <h3 className="h3">Community First</h3>
                <p>
                  To foster a strong, connected community in West Inwood where
                  neighbors know and support each other, creating lasting
                  relationships that enhance our quality of life and
                  neighborhood safety.
                </p>
              </div>
            </div>
            {/* Community Image */}
            <div
              style={{
                marginTop: "2rem",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src="/IMG_3642-preview.jpg"
                alt="West Inwood community gathering"
                style={{
                  transform: "scaleX(-1)",
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            </div>
            <div className="mission-statement">
              <p className="mission-quote">
                "We believe that strong communities are built on trust,
                communication, and shared responsibility. By working together,
                we create a neighborhood where families can thrive, children can
                play safely, and everyone feels a sense of belonging."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="section alt">
        <div className="container">
          <div className="section-heading">
            <h2 className="h2">Our Objectives</h2>
            <p className="subtle">
              Working together toward common goals that benefit our entire
              community
            </p>
          </div>
          <div className="objectives-grid">
            <div className="objective-card">
              <div className="objective-icon">
                <Users className="icon" />
              </div>
              <h3 className="h3">Community Engagement</h3>
              <p>
                Organize regular community events, meetings, and activities that
                bring neighbors together and strengthen our social fabric.
              </p>
            </div>
            <div className="objective-card">
              <div className="objective-icon">
                <Target className="icon" />
              </div>
              <h3 className="h3">Safety & Security</h3>
              <p>
                Coordinate with local law enforcement and establish neighborhood
                watch programs to enhance safety and security for all residents.
              </p>
            </div>
            <div className="objective-card">
              <div className="objective-icon">
                <Heart className="icon" />
              </div>
              <h3 className="h3">Neighborhood Improvement</h3>
              <p>
                Advocate for infrastructure improvements, beautification
                projects, and quality-of-life enhancements throughout West
                Inwood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board Members */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2 className="h2">Board Members</h2>
            <p className="subtle">
              Dedicated community leaders working to make West Inwood a better
              place for everyone
            </p>
          </div>
          <div className="board-grid">
            <div className="board-member">
              <div className="member-avatar">
                <Users className="icon" />
              </div>
              <div className="member-info">
                <h3 className="h3">Muj Badar</h3>
                <p className="member-title">President</p>
                <p className="member-bio">
                  West Inwood resident for 2 years. Passionate about community
                  safety.
                </p>
              </div>
            </div>

            <div className="board-member">
              <div className="member-avatar">
                <Users className="icon" />
              </div>
              <div className="member-info">
                <h3 className="h3">Amna Badar</h3>
                <p className="member-title">Vice President</p>
                <p className="member-bio">
                  West Inwood resident for 2 years. Passionate about community
                  safety.
                </p>
              </div>
            </div>

            <div className="board-member">
              <div className="member-avatar">
                <Users className="icon" />
              </div>
              <div className="member-info">
                <h3 className="h3">Alice Hefner</h3>
                <p className="member-title">Treasurer</p>
                <p className="member-bio">
                  West Inwood resident for 8 years. Passionate about community
                  safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section alt">
        <div className="container">
          <div className="section-heading">
            <h2 className="h2">Get Involved</h2>
            <p className="subtle">
              Ready to make a difference in your community?
            </p>
          </div>
          <div className="contact-info">
            <div className="contact-card">
              <Mail className="contact-icon" />
              <h3 className="h3">General Information</h3>
              <p>westinwood75209@gmail.com</p>
            </div>
            <div className="contact-card">
              <Mail className="contact-icon" />
              <h3 className="h3">Mailing Address</h3>
              <p>
                5600 W Lovers Ln Suite 116
                <br />
                PO Box 537
                <br />
                Dallas, TX 75209
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
