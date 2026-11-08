"use client"
import { useRouter } from "next/navigation";
import { useState,useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';

export default function Register(){
  const [formData,setFormData]=useState({
    first_name:"",
    last_name:"",
    email:"",
    password:"",
    confirmPassword:"",
  });

  const [popUp,setPopup]=useState("");

  function showMessage(text) {
    setPopup(text);

    setTimeout(() => {
      setPopup("");
    }, 2000);
  }
  async function handleSubmit(e){
   e.preventDefault();

   if (formData.password !== formData.confirmPassword) {
      showMessage("Οι κωδικοί δεν ταιριάζουν.");
      return;
    }

    const supabase = createClient();
    
    const{data,error}=await supabase.auth.signUp({
      email:formData.email,
      password:formData.password,
      options:{
        data:{
          first_name:formData.first_name,
          last_name:formData.last_name,
        },
      },
    })

      if (error) {
    console.error(error.message);
    showMessage(error.message);
    return;
  }

  showMessage("Η εγγραφή ολοκληρώθηκε. Ελέγξτε το email σας για επιβεβαίωση.");


  }

  function handleChange(e){
    const{value,name}= e.target;
    setFormData((previous)=>(
      {
        ...previous,
        [name]:value,
      }
    ));
  }

  return(
    <main className="form-container">
        <div className="form-page">
        <h2>Κάνε την εγγραφή σου</h2>
        <span>Συμπληρώστε τα στοιχεία σας για την εγγραφή σας στο ηλεκτρονικό μας κατάστημα.</span>
        <form 
          className="register-form"
          onSubmit={handleSubmit}
          > 
          <div className="form-row">
            <label >Όνομα
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </label>

            <label >Επίθετο
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label >email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label >Κωδικός
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                autoComplete="new-password"
                required
              />
            </label>

            <label >Επιβεβαίωση κωδικού
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <button
            className="register-button"
            type="submit"
          >
            Δημιουργία λογαριασμού
          </button>
          <div>{popUp}</div>
        </form>

        </div>

    </main>
  );

}