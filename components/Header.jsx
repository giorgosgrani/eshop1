"use client"

import Link from "next/link";
import { usePathname,useSearchParams  } from "next/navigation";
import {
  Search,
  UserRound,
  Heart,
  ShoppingCart,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase/client";


export default function Header(){
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openCategories,setOpenCategories]= useState(false);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [categories,setCategories]= useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [user, setUser] = useState(null);
  const [signOff,setSignOff]=useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();

      setUser(user);
      }

      checkUser();

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }, []); 



  useEffect(() => {
  async function loadCat() {
    const { data, error } = await supabase
      .from("categories")
      .select("*");

    if (error) {
      console.error("Error retrieving categories:", error);
      return;
    }

    setCategories(data ?? []);
  }

  loadCat();
}, []);

    useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    setFavoritesCount(favorites.length);
  }, []);

  useEffect(() => {
    function updateFavoritesCount() {
      const favorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );

      setFavoritesCount(favorites.length);
    }

    updateFavoritesCount();

    window.addEventListener("favoritesChanged", updateFavoritesCount);

    return () => {
      window.removeEventListener("favoritesChanged", updateFavoritesCount);
    };
  }, []);

    useEffect(() => {
      setOpenCategories(false);
      setMenuOpen(false);
    }, [pathname, searchParams]);

  const firstLetter = user?.user_metadata?.first_name
  ?.charAt(0)
  .toUpperCase();

  async function handleLogOut(){
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
    return;
    }
    setSignOff(false);
  }

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
              {categories.map((category)=>
                (<Link key = {category.id } onClick={() => setOpenCategories(false)} href={`/products?category=${category.slug}`}>{category.name}</Link>))}
              
              
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
        {user && firstLetter && (
          <div className="account-wrapper">

            <button
              type="button"
              className="user-avatar"
              onClick={() => setSignOff(x => !x)}
              aria-expanded={signOff}
            >
              {firstLetter}
            </button>

            {signOff && (
              <div className="signOff-drop">
                <button type="button"
                  onClick={handleLogOut}
                >
                  Αποσύνδεση
                </button>
              </div>
            )}

          </div>
        )}

        {!user && (<div className="accountdrop-wrapper">
          <div
            className={`header-action ${
              pathname === "/register" || pathname === "/login" ? "selected" : ""
            }`}
            onClick={() => setAccountOpen(x => !x)}
          >
          <UserRound size={22} />
          <span>Λογαριασμός</span>
        </div>
        <div className={`account-drop ${accountOpen ? "account-open" : ""}`}>
          <Link href="/login">Σύνδεση</Link>
          <Link href="/register">Εγγραφή</Link>
        </div>
        </div>)}

        <Link href="/favorites" className={pathname === "/favorites" ? "selected" : "header-action"}>
          <Heart size={22} />
          <span>Αγαπημένα ({favoritesCount})</span>
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