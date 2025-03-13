"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [wantsToPlay, setWantsToPlay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // Provjera je li korisnik već registriran
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");

    if (userId && storedUsername) {
      router.push("/me"); // Ako su podaci u localStorage, preusmjeravamo na /me
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null); // Resetiranje greške prije slanja zahtjeva

    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, wantsToPlay }),
      });

      const data = await response.json();

      if (response.ok) {
        // Spremanje userId i username u localStorage nakon uspješne registracije
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", username);

        router.push("/me"); // Preusmjeravanje na /me
      } else {
        setErrorMessage(data.error || "Nešto je pošlo po krivu!");
      }
    } catch (error) {
      setErrorMessage("Došlo je do pogreške. Pokušajte ponovo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registracija</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="wantsToPlay" className="flex items-center">
            <input
              type="checkbox"
              id="wantsToPlay"
              name="wantsToPlay"
              checked={wantsToPlay}
              onChange={(e) => setWantsToPlay(e.target.checked)}
              className="mr-2"
            />
            Želim sudjelovati
          </label>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {isSubmitting ? "Registriram..." : "Registriraj se"}
        </button>
      </form>

      {/* Error message */}
      {errorMessage && (
        <p className="mt-4 text-red-500 text-sm">{errorMessage}</p>
      )}
    </div>
  );
};

export default RegisterPage;
