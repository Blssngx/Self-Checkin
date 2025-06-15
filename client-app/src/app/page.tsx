"use client";

import { useState, useEffect } from "react";
import SelfQRcodeWrapper, {
  SelfAppBuilder,
  type SelfApp,
} from "@selfxyz/qrcode";
import { v4 } from "uuid";
import { age } from "./config";

export default function Home() {
  // const [linkCopied, setLinkCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [isActive, setIsActive] = useState(true);

  const minimumAge = age;

  // Use useEffect to ensure code only executes on the client side
  useEffect(() => {
    try {
      const userId = v4();
      const app = new SelfAppBuilder({
        appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Self Checkin",
        scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "self-checkin",
        endpoint: `${process.env.NEXT_PUBLIC_SELF_ENDPOINT}/api/verify/`,
        logoBase64:
          "https://pluspng.com/img-png/good-technology-vector-png-pin-technology-clipart-graphic-vector-9-730.png",
        userId: userId,
        disclosures: {
          minimumAge,
        },
      }).build();

      setSelfApp(app);
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
    }
  }, []);

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSuccessfulVerification = () => {
    displayToast("Access Granted!");
    setIsActive(false);
    setTimeout(() => setIsActive(true), 3000);
  };

  const handleFingerprintTouch = () => {
    displayToast("Fingerprint scanner not available in web version");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 flex flex-col items-center justify-center p-4 relative">
      {/* Background door frame effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 via-transparent to-stone-200/30"></div>

      {/* Smart Lock Device */}
      <div className="relative z-10">
        {/* Device mounting shadow */}
        <div className="absolute -inset-2 bg-black/10 rounded-2xl blur-sm"></div>

        {/* Main device body */}
        <div className="relative bg-gradient-to-b from-gray-300 via-gray-200 to-gray-300 rounded-2xl p-1 shadow-2xl border border-gray-400/50">
          {/* Inner device frame */}
          <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl p-6 shadow-inner">
            {/* Status LED */}
            <div className="flex justify-center mb-6">
              <div
                className={`w-3 h-3 rounded-full ${
                  isActive ? "bg-blue-400" : "bg-green-400"
                } shadow-lg`}
              >
                <div
                  className={`w-full h-full rounded-full ${
                    isActive ? "bg-blue-500" : "bg-green-500"
                  } animate-pulse`}
                ></div>
              </div>
            </div>

            {/* Display Screen */}
            <div className="bg-black rounded-lg p-4 mb-6 shadow-inner border-2 border-gray-600">
              <div className="bg-white rounded p-4 min-h-[320px] flex flex-col items-center justify-center">
                {/* Screen header */}
                <div className="text-black font-bold text-lg mb-4 tracking-wider">
                  SCAN QR CODE
                </div>

                {/* QR Code area */}
                <div className="flex justify-center">
                  {selfApp ? (
                    <div className="scale-90">
                      <SelfQRcodeWrapper
                        selfApp={selfApp}
                        onSuccess={handleSuccessfulVerification}
                      />
                    </div>
                  ) : (
                    <div className="w-[230px] h-[230px] bg-gray-200 animate-pulse flex items-center justify-center rounded">
                      <p className="text-gray-500 text-sm">Loading...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fingerprint Scanner */}
            <div
              className="bg-gradient-to-b from-gray-800 to-black rounded-lg p-4 cursor-pointer hover:from-gray-700 hover:to-gray-900 transition-all duration-200 shadow-inner border border-gray-700"
              onClick={handleFingerprintTouch}
            >
              <div className="w-full h-16 bg-gradient-to-b from-gray-900 to-black rounded flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-gray-600 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-2.04-1.34-3.30 0-1.28.47-2.44 1.34-3.32.87-.87 2.04-1.34 3.30-1.34 1.28 0 2.44.47 3.32 1.34.87.87 1.34 2.04 1.34 3.30 0 1.28-.47 2.44-1.34 3.32-.09.1-.22.15-.35.15s-.26-.05-.35-.15c-.19-.19-.19-.51 0-.71.68-.68 1.05-1.58 1.05-2.54s-.37-1.85-1.05-2.54c-.68-.68-1.58-1.05-2.54-1.05s-1.85.37-2.54 1.05c-.68.68-1.05 1.58-1.05 2.54s.37 1.85 1.05 2.54c.19.2.19.51 0 .71-.09.1-.22.15-.35.15z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white py-3 px-6 rounded-lg shadow-xl animate-fade-in text-sm font-medium z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
