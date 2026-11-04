import { notFound } from "next/navigation";
const validTypes = ["shipping", "returns", "terms", "privacy", "cookies"];

export default async function ExtrasPage({ searchParams }) {
   const { type } = await searchParams;

  if (!validTypes.includes(type)) {
    notFound();
  }

  return (
    <main className="extras-page">

      {type === "shipping" && (
        <section>
          <h1>Έξοδα Αποστολής</h1>
          <p>Πληροφορίες σχετικά με τα έξοδα αποστολής.</p>
        </section>
      )}

      {type === "returns" && (
        <section>
          <h1>Επιστροφές</h1>
          <p>Πληροφορίες για τις επιστροφές προϊόντων.</p>
        </section>
      )}

      {type === "terms" && (
        <section>
          <h1>Όροι Χρήσης</h1>
          <p>Οι όροι χρήσης του ηλεκτρονικού καταστήματος.</p>
        </section>
      )}

      {type === "privacy" && (
        <section>
          <h1>Πολιτική Απορρήτου</h1>
          <p>Πληροφορίες για την προστασία προσωπικών δεδομένων.</p>
        </section>
      )}

      {type === "cookies" && (
        <section>
          <h1>Πολιτική Cookies</h1>
          <p>Πληροφορίες σχετικά με τη χρήση cookies.</p>
        </section>
      )}

    </main>
  );
}