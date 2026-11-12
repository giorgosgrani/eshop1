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
import { useState, useEffect, useRef  } from "react";
import { createClient } from "../lib/supabase/client";
import { useRouter } from "next/navigation";


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
  const router = useRouter();
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [search,setSearch]=useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(()=>{
    async function searchProducts(){
      const { data, error } = await supabase
        .rpc("search_products", {
          search_term: search
      });

      if (error) {
        console.error(error);
        return;
      } 
      setSearchResults(data ?? []); 
    }
    if (search.trim()) {
    searchProducts();
    } else {
    setSearchResults([]);
    }
  },[search]);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = Math.max(0, window.scrollY);
      const difference = currentScrollY - lastScrollY.current;

      if (currentScrollY < 80) {
        setHeaderVisible(true);
      } else if (difference > 5) {
        setHeaderVisible(false);
      } else if (difference < -5) {
        setHeaderVisible(true);
      }

      if (Math.abs(difference) > 5) {
        lastScrollY.current = currentScrollY;
      }
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    async function updateFavoritesCount() {
      if(!user){
      const favorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );

      setFavoritesCount(favorites.length);
    }
    else{
      const {data,error}= await supabase
        .from("favorites")
        .select("*")
        .eq("user_id",user.id);

      if(error){
      console.log("error retieve favorites",error);
      return;
    }
    setFavoritesCount(data.length);  
    }
    
    }

    updateFavoritesCount();

    window.addEventListener("favoritesChanged", updateFavoritesCount);

    return () => {
      window.removeEventListener("favoritesChanged", updateFavoritesCount);
    };
  }, [user?.id]);

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
    router.replace("/");
  }

  return(
    <header
      className={`site-header ${headerVisible ? "" : "header-hidden"}`}
    >
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
          onChange={(e)=>setSearch(e.target.value)}
        />
        {search &&
        <div className="search-dropdown" >
          {searchResults.map((result) =>(
            <div className="result-row" key={result?.id}>
              <Link 
                href={`/products`}
                >
                  {result.name}  <b>{result.price} €</b>
              </Link>
              <img
                src={result.image}
                alt={result.name}
              />
            </div>
          ))}
        </div>}
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