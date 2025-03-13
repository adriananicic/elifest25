import { Scanner } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";

const ScanQRCodePage = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (data: any) => {
    if (data) {
      setScanResult(data.text);
      console.log("Skeniran URL/ID:", data.text);

      // Dohvati ID korisnika iz localStorage
      const scannerId = localStorage.getItem("userId");

      // Provjeri je li scannerId prisutan
      if (!scannerId) {
        setError("Nema spremljenog korisničkog ID-a.");
        return;
      }

      const scannedId = data.text; // ID korisnika koji je skeniran

      try {
        // Pravljenje fetch poziva
        const response = await fetch(`/api/scan/${scannedId}/${scannerId}`, {
          method: "POST", // Pretpostavljamo da koristiš POST, možeš promijeniti u GET ako je potrebno
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scannerId,
            scannedId,
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.error || "Došlo je do pogreške.");
        }

        console.log("Scan uspješan!", responseData);
        // Ovdje možeš postaviti bilo koju akciju, kao što je ažuriranje stanja
      } catch (err) {
        setError(
          (err as Error).message || "Došlo je do pogreške pri slanju skena."
        );
      }
    }
  };

  const handleError = (err: any) => {
    console.error("Greška pri skeniranju QR koda:", err);
  };

  return (
    <div>
      <h1>Scan QR kod</h1>
      <Scanner onScan={handleScan} onError={handleError} />

      {scanResult && <p>Skeniran URL/ID: {scanResult}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ScanQRCodePage;
