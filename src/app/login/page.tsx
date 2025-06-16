'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic';

const SlButton = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlButton), { ssr: false });

const SlInput = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlInput), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  useEffect(() => {
    if (emailRef.current) {
      const nativeInput = emailRef.current.shadowRoot.querySelector('input');
      if (nativeInput) {
        setEmail(nativeInput.value);
      }
    }
    if (passwordRef.current) {
      const nativeInput = passwordRef.current.shadowRoot.querySelector('input');
      if (nativeInput) {
        setEmail(nativeInput.value);
      }
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    console.log(email,password)
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      setError("Ocorreu um erro ao fazer login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{color: 'var(--text-expresso)'}}>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <SlInput
            ref={emailRef}
              type="email"
              label="Email"
              value={email}
              onSlInput={(e: any) => setEmail(e.target.value)}
              required
              autocomplete="email"
              id="login-email-input"
            />
          </div>

          <div>
            <SlInput
            ref={passwordRef}
              type="password"
              label="Senha"
              value={password}
              onSlInput={(e: any) => setPassword(e.target.value)}
              required
              autocomplete="current-password"
              id="login-password-input"
            />
          </div>

          <SlButton type="submit" variant="primary" className="w-full">
            Entrar
          </SlButton>
        </form>
      </div>
    </div>
  );
} 