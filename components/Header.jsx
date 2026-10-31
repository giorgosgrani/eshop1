"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  UserRound,
  Heart,
  ShoppingCart,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function Header(){
   const pathname = usePathname();
   const [menuOpen, setMenuOpen] = useState(false);
   const [openCategories,setOpenCategories]= useState(false);


  return(
    <header className="site-header">
      <div className="header-container">

        <Link className="logo" href="/">Eshop logo</Link>

        <nav id="main-navigation" className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <Link href="/" className={pathname === "/" ? "selected" : ""}>Αρχική</Link>
          <Link href="/products" className={`
              ${pathname === "/products" ? "selected" : ""}
            `}>Όλα τα προϊόντα</Link>

          <div className="categories-wrapper">
            <button
              type="button"
              className={`categories-trigger ${
                pathname === "/categories" ? "selected" : ""
              }`}
              onClick={() => setOpenCategories(!openCategories)}
              aria-expanded={openCategories}
            >
              Κατηγορίες
            </button>

            <div
              className={`categoriesDrop ${
                openCategories ? "openCategoriesMenu" : ""
              }`}
            >
              <Link href="/products?category=clothes">Ρούχα</Link>
              <Link href="/products?category=shoes">Παπούτσια</Link>
              <Link href="/products?category=bags">Τσάντες</Link>
              <Link href="/products?category=accessories">Αξεσουάρ</Link>
            </div>
          </div>
          <Link href="/discounts" className={pathname === "/discounts" ? "selected" : ""}>Προσφορές</Link>
          <Link href="/contact" className={pathname === "/contact" ? "selected" : ""}>Επικοινωνία</Link>
        </nav>

       <div className="header-search">
        <Search size={20} className="search-icon" />

        <input
          type="search"
          placeholder="Αναζήτηση προϊόντων..."
          aria-label="Αναζήτηση προϊόντων"
        />
      </div>

        
      <div className="header-actions">
        <Link href="/account"  className={pathname === "/account" ? "selected" : "header-action"}>
          <UserRound size={22} />
          <span>Λογαριασμός</span>
        </Link>

        <Link href="/favorites" className={pathname === "/favorites" ? "selected" : "header-action"}>
          <Heart size={22} />
          <span>Αγαπημένα</span>
        </Link>

        <Link href="/cart" className={pathname === "/cart" ? "selected" : "header-action"}>
          <ShoppingCart size={22} />
          <span>Καλάθι (0)</span>
        </Link>
      </div>
      
      <button
        type="button"
        className="mobile-menu-button"
        aria-label={menuOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      </div>
    </header>
  );
}