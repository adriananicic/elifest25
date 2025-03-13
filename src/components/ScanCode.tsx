import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const ScanQRCodePage = () => {
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (scannedId: any) => {
    // Get user ID from localStorage
    const scannerId = localStorage.getItem("userId");

    // Check if scannerId exists
    if (!scannerId) {
      setError("No user ID found in localStorage.");
      return;
    }

    try {
      const response = await fetch(`/api/scan/${scannedId}/${scannerId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scannerId,
          scannedId,
        }),
      });

      // Check if response is empty before parsing
      const text = await response.text();
      if (!text) {
        throw new Error("Empty response from server.");
      }

      const responseData = JSON.parse(text); // Manually parse JSON

      if (!response.ok) {
        throw new Error(responseData.error || "An error occurred.");
      }

      console.log("Scan successful!", responseData);
    } catch (err) {
      setError((err as Error).message || "Error while sending scan data.");
    }
  };

  return (
    <div>
      <h1>Scan QR Code</h1>

      {/* Scanner Container with some styling */}
      <div id="qr-scanner-container" style={{ width: "100%", height: "400px" }}>
        <Scanner
          onScan={(res) => {
            handleScan(res[0].rawValue);
          }}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ScanQRCodePage;
