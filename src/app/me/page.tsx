"use client";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import ScanQRCode from "@/components/ScanCode";

const MePage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState<boolean>(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");

    if (storedUserId && storedUsername) {
      setUserId(storedUserId);
      setUsername(storedUsername);
    } else {
      window.location.href = "/potvrdi-dolazak"; // Ako nema podataka, preusmjeri na početnu stranicu
    }
  }, []);

  const handleScanButtonClick = () => {
    // Logika za otvaranje kamere i skeniranje QR koda
    setShowScanner((prev) => !prev);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Welcome, {username}
      </h2>

      <div className="text-center mb-6">
        {userId && (
          <QRCodeSVG value={`localhost:3000/api/scan/${userId}`} size={200} />
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleScanButtonClick}
          className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Scan QR Code
        </button>
      </div>
      {showScanner && <ScanQRCode />}
    </div>
  );
};

export default MePage;
