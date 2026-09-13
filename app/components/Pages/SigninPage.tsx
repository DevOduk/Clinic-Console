"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import { useUser } from "@/app/context/userContext";


function SigninPage() {
  const { setProfile } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const encodedRef = searchParams.get("to_url");
  const originalUrl = encodedRef ? decodeURIComponent(atob(encodedRef)) : "/";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 60
        }),
        credentials: "include",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to sign in.");
      }

      const profileResponse = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });
      const profileData = await profileResponse.json().catch(() => null);

      if (!profileResponse.ok) {
        throw new Error(profileData?.message || "Unable to load your profile.");
      }
      setSuccess(true);
      setProfile(profileData?.user ?? profileData);
      router.replace(originalUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-screen h-screen flex items-center bg-no-repeat bg-center bg-cover justify-center bg-black/60 bg-blend-multiply px-4"
      style={{
        backgroundImage:
          'url("https://plus.unsplash.com/premium_photo-1675808575920-8010494407e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-xl shadow-gray-600"
      >
        {error && (
          <div className="p-2 px-3 bg-red-100 border border-red-300 text-red-700 rounded-lg shadow font-semibold text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="p-2 px-3 bg-green-100 border border-green-300 text-green-700 rounded-lg shadow font-semibold text-center">
            Signin successful!{" "}
          </div>
        )}
        <div className="flex items-center justify-center gap-3 mx-auto">
          <div className="flex h-11 aspect-square items-center justify-center rounded-lg bg-(--orange) text-3xl font-bold text-(--teal-dark)">
            C
          </div>
          <p className="text text-teal-700 text-4xl font-bold leading-relaxed">Clinic</p>
        </div>

        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Username <span className="text-red-500">*</span>
            <input
              name="username"
              type="text"
              required
              onChange={(event) => setUsername(event.target.value)}
              value={username}
              autoComplete="username"
              placeholder="Enter username"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-100"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
            <span className="relative mt-1 block">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Enter password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-11 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-100"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </button>
            </span>
          </label>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="text-right text-blue-500">
            <Link href={"#"}>Forgot Password?</Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? "Signing in ..." : "Sign in"}
        </button>
        <div>
          Don't have an account yet? <Link href={"#"}>Sign up.</Link>
        </div>
      </form>
    </div>
  );
}

export default SigninPage;
