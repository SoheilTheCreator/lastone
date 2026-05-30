"use client";

import React, { useState } from "react";
import FormBlock from "../components/ui/FormBlock";
import FormSubmit from "../components/ui/FormSubmit";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { apiRequest } from "../api/request";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // reset error

    const formData = new FormData(e.currentTarget);

    const username = (formData.get("username") as string) || "";
    const password = (formData.get("password") as string) || "";
    // Login API junction 
    try{
      const payload = await apiRequest(
        'http://polemis.runflare.run/api/login', // API LINK GOES HERE literally All you need to change
        {
          username: username, // make sure these work
          password: password
        },'POST');

      const loginData = {
        token: payload.token,
        userId: payload.user.id,
        screenName: payload.user.screen_name 
      }

      login(loginData);        // save data in context
      router.push("/dashboard"); // redirect to dashboard
      // console.table(payload)
    } catch (err) {
      setError("err");
    }

    //junction end

    // -------- -------- -------- ------ remove this part beneath 
    //API SIMULATOR - USE WHEN NO SERVER IS CONNECTED
    // simple fake validation
    // if (username !== "admin" || password !== "1234") {
    //   setError("نام کاربری یا گذرواژه اشتباه است.");
    //   return;
    // }
    

    // // fake successful API response
    // const payload = {
    //   username,
    //   screenName: "S. R. Bachay",
    //   userId: "001",
    //   token: "XXXX-XXXX-XXXX-XX",
    // };

    // login(payload);        // save data in context
    // router.push("/dashboard"); // redirect to dashboard
    //API SIMULATOR - USE WHEN NO SERVER IS CONNECTED
    // -------- -------- -------- ------ remove this part above 
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className="bg-[var(--ternary)]/40 shadow-2xl rounded-2xl p-8">
        <div>

          <FormBlock
            label="نام کاربری"
            name="username"
            type="text"
          />

          <FormBlock
            label="گذرواژه"
            name="password"
            type="password"
          />

          {/* ------- Error Message (visible between inputs & button) ------- */}
          {error && (
            <p
              style={{
                marginTop: "10px",
                marginBottom: "5px",
                color: "red",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </p>
          )}
          {/* -------------------------------------------------------------- */}

          <br />

          <FormSubmit value="ورود" />
        </div>
      </form>
    </section>
  );
}
