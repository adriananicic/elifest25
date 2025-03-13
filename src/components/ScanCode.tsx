import { useEffect, useState } from "react";
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
      // Make the fetch call
      const response = await fetch(`/api/scan`, {
        method: "POST", // Assuming you're using POST, can change to GET if needed
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
        alert(responseData.error);
        throw new Error(responseData.error || "An error occurred.");
      }

      console.log("Scan successful!", responseData);
      // You can do further actions here like updating state
    } catch (err) {
      alert(err);
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
            alert(res[0].rawValue);
            handleScan(res[0].rawValue);
          }}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ScanQRCodePage;
