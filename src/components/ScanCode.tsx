import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const ScanQRCodePage = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (data: any) => {
    if (data) {
      setScanResult(data.text);
      console.log("Scanned URL/ID:", data.text);

      // Get user ID from localStorage
      const scannerId = localStorage.getItem("userId");

      // Check if scannerId exists
      if (!scannerId) {
        setError("No user ID found in localStorage.");
        return;
      }

      alert("scanned: " + data.text + " and scanner: " + scannerId);
      const scannedId = data.text; // ID of the scanned user

      console.log(data.text);

      try {
        // Make the fetch call
        const response = await fetch(`${scannedId}/${scannerId}`, {
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
          console.log(responseData.error);
          throw new Error(responseData.error || "An error occurred.");
        }

        console.log("Scan successful!", responseData);
        // You can do further actions here like updating state
      } catch (err) {
        console.log(err);
        setError((err as Error).message || "Error while sending scan data.");
      }
    }
  };

  const handleError = (err: any) => {
    console.error("Error scanning QR code:", err);
  };

  return (
    <div>
      <h1>Scan QR Code</h1>

      {/* Scanner Container with some styling */}
      <div id="qr-scanner-container" style={{ width: "100%", height: "400px" }}>
        <Scanner
          onScan={(res) => {
            alert("ALERTAN RES " + res);
            handleScan(res);
          }}
          onError={handleError}
        />
      </div>

      {scanResult && <p>Scanned URL/ID: {scanResult}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ScanQRCodePage;
