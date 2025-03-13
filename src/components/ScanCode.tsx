import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const ScanQRCodePage = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if camera permission is granted
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        // If we reach this point, camera permission is granted
        console.log("Camera permission granted");
      } catch (err) {
        console.error("Camera permission denied", err);
        alert("Camera permission is required to scan QR codes.");
      }
    };

    checkCameraPermission();
  }, []);

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

      const scannedId = data.text; // ID of the scanned user

      try {
        // Make the fetch call
        const response = await fetch(`/api/scan/${scannedId}/${scannerId}`, {
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
          throw new Error(responseData.error || "An error occurred.");
        }

        console.log("Scan successful!", responseData);
        // You can do further actions here like updating state
      } catch (err) {
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
        <Scanner onScan={handleScan} onError={handleError} />
      </div>

      {scanResult && <p>Scanned URL/ID: {scanResult}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ScanQRCodePage;
