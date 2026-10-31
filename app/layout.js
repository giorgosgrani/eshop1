import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Eshop1",
  description: "Eshop1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="el">
      <body>
        <Header />

        <main>{children}</main>

        <Footer/>
        
      </body>
    </html>
  );
}
