'use client';
import { useRouter } from "next/navigation";
import { useState,useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';
import Link from "next/link";

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(()=>{
    //page cannot be accesed from already logged in users
      async function checkSession(){
        const supabase = createClient();
  
        const{data} = await supabase.auth.getSession();
        //console.log(data);
        if(data.session){
          router.replace("/");         
        }
      }    
      checkSession();
    },[router]);

    async function handleLogin(e){
      e.preventDefault();

      const supabase = createClient();

      const {data,error}= await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setMessage("Λάθος email ή κωδικός.");
        return;
     }
     setMessage("Επιτυχής σύνδεση.");
     router.replace("/"); 
    }

    function showMessage(text) {
      setMessage(text);

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }

  return (
  <main className="login-page">
    <div className="login-container">
      <h1>Καλώς ήρθες ξανά</h1>

      <span>
        Συνδέσου στον λογαριασμό σου για να συνεχίσεις τις αγορές σου.
      </span>

      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Κωδικός πρόσβασης"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="register-button">
          Σύνδεση
        </button>

        {message && <div className="login-message">{message}</div>}
      </form>

      <div className="login-register-link">
        Δεν έχεις λογαριασμό;{" "}
        <Link href="/register">Κάνε εγγραφή</Link>
      </div>
    </div>
  </main>
);

}