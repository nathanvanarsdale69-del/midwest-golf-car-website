import Image from "next/image";

export default function Home() {
  return (
    <>
      <nav>
        <div className="wrap">
          <a href="/" className="logo">
            <Image
              src="/logo.png"
              alt="Midwest Golf Car"
              width={160}
              height={120}
              priority
            />
          </a>
          <ul className="nav-links">
            <li><a href="#services">Services</a></li>
            <li><a href="#fleet">Fleet</a></li>
            <li><a href="#hours">Hours</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a href="tel:+16187972278" className="nav-phone">618-797-CART</a>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap">
          <div className="hero-eyebrow">Granite City, IL · Est. Local</div>
          <h1>Rent it. Buy it. <em>Keep it running.</em></h1>
          <p>Your neighborhood source for golf cart rental, sales, and service — gas, lead acid, or lithium ion, we've got a cart for the job.</p>
          <div className="hero-ctas">
            <a href="tel:+16187972278" className="btn-primary">Call 618-797-CART</a>
            <a href="#fleet" className="btn-secondary">View the Fleet</a>
          </div>
        </div>
        <div className="plate-strip"></div>
      </header>

      <section className="section" id="services">
        <div className="wrap">
          <div className="section-eyebrow">What we do</div>
          <h2 className="section-title">Three ways we keep you moving.</h2>
          <div className="tags-grid">
            <div className="spec-tag">
              <div className="punch"></div>
              <h3>Rental</h3>
              <p>Daily, weekend, weekly, or monthly rentals — delivered right to your driveway.</p>
              <div className="spec-line"><span>TYPE: RENTAL</span><span>STATUS: OPEN</span></div>
            </div>
            <div className="spec-tag">
              <div className="punch"></div>
              <h3>Sales</h3>
              <p>New and pre-owned carts across every classification, from 2-seaters to full utility rigs.</p>
              <div className="spec-line"><span>TYPE: DEALER</span><span>STATUS: OPEN</span></div>
            </div>
            <div className="spec-tag">
              <div className="punch"></div>
              <h3>Service</h3>
              <p>Battery swaps, tune-ups, and repairs — bring in any make or model, not just ours.</p>
              <div className="spec-line"><span>TYPE: SHOP</span><span>STATUS: OPEN</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="fleet" style={{ background: "#fff" }}>
        <div className="wrap">
          <div className="section-eyebrow">The lineup</div>
          <h2 className="section-title">A cart for every job.</h2>
          <div className="fleet-grid">
            <div className="fleet-card">
              <div className="fleet-img-placeholder">Photo coming soon<br />2 Seater</div>
              <div className="fleet-card-body"><h4>2 Seater</h4><p>Quick trips, easy parking.</p></div>
            </div>
            <div className="fleet-card">
              <div className="fleet-img-placeholder">Photo coming soon<br />4 Seater</div>
              <div className="fleet-card-body"><h4>4 Seater</h4><p>The everyday favorite.</p></div>
            </div>
            <div className="fleet-card">
              <div className="fleet-img-placeholder">Photo coming soon<br />6 Seater</div>
              <div className="fleet-card-body"><h4>6 Seater</h4><p>Bring the whole crew.</p></div>
            </div>
            <div className="fleet-card">
              <div className="fleet-img-placeholder">Photo coming soon<br />Utility</div>
              <div className="fleet-card-body"><h4>Utility</h4><p>Built to haul, not just cruise.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="hours">
        <div className="wrap">
          <div className="section-eyebrow">Find us</div>
          <h2 className="section-title">Hours & location.</h2>
          <div className="hours-wrap">
            <div className="hours-tag">
              <div className="punch"></div>
              <div className="hours-row"><span>Mon – Fri</span><span>8:00 AM – 5:00 PM</span></div>
              <div className="hours-row"><span>Saturday</span><span>9:00 AM – 2:00 PM</span></div>
              <div className="hours-row"><span>Sunday</span><span>Closed</span></div>
              <div className="hours-row"><span>Address</span><span>904 Thorngate Rd</span></div>
              <div className="hours-row"><span>City</span><span>Granite City, IL</span></div>
            </div>
            <div className="map-placeholder">
              Map embed goes here<br />904 Thorngate Rd, Granite City, IL
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="wrap">
          <h2>Ready to roll?</h2>
          <p>Give us a call or stop by — we'll get you set up with the right cart for the job.</p>
          <div className="contact-links">
            <a href="tel:+16187972278" className="btn-primary">Call 618-797-CART</a>
            <a href="mailto:info@midwestgolfcar.com" className="btn-secondary">Email Us</a>
          </div>
        </div>
      </section>

      <footer>
        MIDWEST GOLF CAR · 904 THORNGATE RD, GRANITE CITY, IL · © 2026
        <div style={{ marginTop: "8px" }}>
          <a
            href="https://admin.midwestgolfcar.com"
            style={{ color: "inherit", opacity: 0.6, textDecoration: "underline", fontSize: "0.85em" }}
          >
            Employee Login
          </a>
        </div>
      </footer>
    </>
  );
}
