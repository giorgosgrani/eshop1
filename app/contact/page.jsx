
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  Clock3,
  Send,
  ChevronDown,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";

const contactEmail = "support@example.com";

const faqs = [
  {
    question: "Πώς μπορώ να παρακολουθήσω την παραγγελία μου;",
    answer:
      "Μετά την αποστολή της παραγγελίας σου, θα λάβεις ενημέρωση με τις πληροφορίες αποστολής.",
  },
  {
    question: "Μπορώ να επιστρέψω ένα προϊόν;",
    answer:
      "Οι επιστροφές πραγματοποιούνται σύμφωνα με την πολιτική επιστροφών του καταστήματος.",
  },
  {
    question: "Πώς μπορώ να επικοινωνήσω με την εξυπηρέτηση;",
    answer:
      "Μπορείς να συμπληρώσεις τη φόρμα επικοινωνίας ή να μας στείλεις email.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(form.subject);
    const body = encodeURIComponent(
      `Όνομα: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );

    window.location.href =
      `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="contact-page">
      <div className="contact-container">

        <div className="contact-heading">
          <span className="contact-eyebrow">
            ΕΞΥΠΗΡΕΤΗΣΗ ΠΕΛΑΤΩΝ
          </span>

          <h1>Επικοινώνησε μαζί μας</h1>

          <p>
            Έχεις κάποια ερώτηση σχετικά με τα προϊόντα ή
            την παραγγελία σου; Είμαστε εδώ για να σε βοηθήσουμε.
          </p>
        </div>

        <div className="contact-layout">

          <div className="contact-info">
            <span className="contact-small-label">
              ΕΠΙΚΟΙΝΩΝΙΑ
            </span>

            <h2>Πώς μπορούμε να βοηθήσουμε;</h2>

            <p className="contact-info-description">
              Για οποιαδήποτε απορία, μπορείς να μας στείλεις
              μήνυμα ή να επικοινωνήσεις απευθείας μαζί μας.
            </p>

            <div className="contact-methods">

              <div className="contact-method">
                <div className="contact-method-icon">
                  <Mail size={21} />
                </div>

                <div>
                  <h3>Email</h3>
                  <a href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </a>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-method-icon">
                  <Phone size={21} />
                </div>

                <div>
                  <h3>Τηλεφωνική εξυπηρέτηση</h3>
                  <p>
                    Τα στοιχεία τηλεφώνου θα ανακοινωθούν σύντομα.
                  </p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-method-icon">
                  <Clock3 size={21} />
                </div>

                <div>
                  <h3>Ώρες εξυπηρέτησης</h3>
                  <p>
                    Επικοινώνησε μαζί μας μέσω email
                    οποιαδήποτε στιγμή.
                  </p>
                </div>
              </div>

            </div>

            <div className="contact-help-box">
              <MessageCircle size={24} />

              <div>
                <h3>Χρειάζεσαι βοήθεια με μια παραγγελία;</h3>
                <p>
                  Συμπλήρωσε τον αριθμό παραγγελίας στο μήνυμά
                  σου για να μπορέσουμε να σε εξυπηρετήσουμε.
                </p>
              </div>
            </div>
          </div>

          <div className="contact-form-card">
            <div className="contact-form-heading">
              <h2>Στείλε μας μήνυμα</h2>
              <p>
                Συμπλήρωσε την παρακάτω φόρμα.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">

              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="contact-name">
                    Ονοματεπώνυμο *
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Το όνομά σου"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email">
                    Email *
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-subject">
                  Θέμα επικοινωνίας *
                </label>

                <select
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Επίλεξε θέμα</option>
                  <option value="Πληροφορίες προϊόντος">
                    Πληροφορίες προϊόντος
                  </option>
                  <option value="Παραγγελία">
                    Παραγγελία
                  </option>
                  <option value="Αποστολή και παράδοση">
                    Αποστολή και παράδοση
                  </option>
                  <option value="Επιστροφή προϊόντος">
                    Επιστροφή προϊόντος
                  </option>
                  <option value="Άλλο">
                    Άλλο
                  </option>
                </select>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-message">
                  Το μήνυμά σου *
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Γράψε εδώ το μήνυμά σου..."
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </div>

              <p className="contact-form-note">
                Με την υποβολή θα ανοίξει η εφαρμογή email
                σου για να επιβεβαιώσεις την αποστολή.
              </p>

              <button type="submit" className="contact-submit">
                Σύνταξη μηνύματος
                <Send size={17} />
              </button>

            </form>
          </div>
        </div>

        <section className="contact-faq">
          <div className="contact-faq-heading">
            <span className="contact-eyebrow">
              ΧΡΗΣΙΜΕΣ ΠΛΗΡΟΦΟΡΙΕΣ
            </span>

            <h2>Συχνές ερωτήσεις</h2>
            <p>Βρες απαντήσεις σε συνηθισμένες απορίες.</p>
          </div>

          <div className="contact-faq-list">
            {faqs.map((faq, index) => (
              <div className="contact-faq-item" key={index}>
                <button
                  type="button"
                  aria-expanded={openFaq === index}
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                >
                  {faq.question}

                  <ChevronDown
                    size={19}
                    className={
                      openFaq === index ? "faq-rotated" : ""
                    }
                  />
                </button>

                {openFaq === index && (
                  <p>{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="contact-bottom">
          <div>
            <h2>Ανακάλυψε τη συλλογή μας</h2>
            <p>
              Δες τα διαθέσιμα προϊόντα και τις νέες αφίξεις.
            </p>
          </div>

          <Link href="/products">
            Δες τα προϊόντα
            <ArrowUpRight size={19} />
          </Link>
        </div>

      </div>
    </main>
  );
}
