"use client"

import Link from "next/link";

import {
  ArrowRight,
  ShieldCheck,
  CreditCard
} from "lucide-react";

import {
  FaInstagram,
  FaFacebookF
} from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              ESHOP<span>.</span>
            </Link>

            <p>
              Ανακάλυψε μοναδικά προϊόντα,
              σύγχρονο στυλ και μια ξεχωριστή
              εμπειρία online αγορών.
            </p>

            <div className="footer-socials">
              <a href="https://instagram.com" aria-label="Instagram"
                 target="_blank" rel="noopener noreferrer">
                <FaInstagram  size={19} />
              </a>

              <a href="https://facebook.com" aria-label="Facebook"
                 target="_blank" rel="noopener noreferrer">
                <FaFacebookF  size={19} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="footer-column">
            <h3>Κατάστημα</h3>

            <Link href="/">Αρχική</Link>
            <Link href="/products">Προϊόντα</Link>
            <Link href="/categories">Κατηγορίες</Link>
            <Link href="/discounts">Προσφορές</Link>
            <Link href="/contact">Επικοινωνία</Link>
          </div>

          {/* Customer service */}
          <div className="footer-column">
            <h3>Εξυπηρέτηση</h3>

            <Link href="/shipping">Τρόποι Αποστολής</Link>
            <Link href="/returns">Επιστροφές</Link>
            <Link href="/terms">Όροι Χρήσης</Link>
            <Link href="/privacy">Πολιτική Απορρήτου</Link>
            <Link href="/cookies">Πολιτική Cookies</Link>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h3>Μείνε ενημερωμένος</h3>

            <p>
              Μάθε πρώτος για νέα προϊόντα,
              συλλογές και προσφορές.
            </p>

            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Το email σου"
                aria-label="Email newsletter"
                required
              />

              <button type="submit" aria-label="Εγγραφή">
                <ArrowRight size={20} />
              </button>
            </form>

            <span className="newsletter-note">
              Χωρίς spam. Μόνο ενδιαφέρουσες ενημερώσεις.
            </span>
          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© {year} ESHOP. All rights reserved.</p>

          <div className="footer-bottom-right">
            <span>
              <ShieldCheck size={17} />
              Ασφαλείς αγορές
            </span>

            <span>
              <CreditCard size={17} />
              Πληρωμές online
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
