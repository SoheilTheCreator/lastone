'use client'

import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--font-clr)] px-4">
     <div className="bg-[var(--bg)] lg:w-2/6 w-5/6 p-4 rounded-xl text-[var(--font-clr)]">
      <h1 className="p-4 text-center font-bold">welcome to CafeMon</h1>
      <br />
        <LoginForm />
      </div>
    </main>
  );
}
