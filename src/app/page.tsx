"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const validatePhone = (phoneNumber: string): boolean => {
    // Remove spaces and dashes
    const cleaned = phoneNumber.replace(/[\s\-]/g, "");
    // Turkish mobile: 10 digits starting with 5, or with +90/0090 prefix
    const turkishMobileRegex = /^(\+90|0090|0)?5[0-9]{9}$/;
    return turkishMobileRegex.test(cleaned);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    // Validate phone number format
    if (!validatePhone(phone)) {
      setStatus("error");
      setMessage("Geçerli bir telefon numarası girin (örn: 5XX XXX XXXX)");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, website: honeypot }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        setName("");
        setPhone("");
      } else {
        setStatus("error");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <main className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.jpg"
            alt="Urban Roastery"
            width={200}
            height={200}
            priority
            className="h-auto w-48"
          />
        </div>

        {/* Title */}
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-black">
          Catan Turnuvası
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Turnuvaya katılmak için kayıt olun
        </p>

        {/* Success Message */}
        {status === "success" && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center">
            <p className="font-medium text-green-800">{message}</p>
          </div>
        )}

        {/* Error Message */}
        {status === "error" && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center">
            <p className="font-medium text-red-800">{message}</p>
          </div>
        )}

        {/* Form */}
        {status !== "success" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot field - hidden from humans, bots will fill it */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-black"
              >
                İsim
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={status === "loading"}
                placeholder="İsminizi girin"
                className="w-full rounded-lg border-2 border-black bg-[#faf8f5] px-4 py-3 text-black placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-black"
              >
                Telefon Numarası
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={status === "loading"}
                placeholder="Telefon numaranızı girin"
                className="w-full rounded-lg border-2 border-black bg-[#faf8f5] px-4 py-3 text-black placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-lg bg-black px-4 py-3 font-bold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? "Kaydediliyor..." : "Kayıt Ol"}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Caferağa, Şevki Bey Sk. No:2/A, 34710 Kadıköy
        </p>
      </main>
    </div>
  );
}
