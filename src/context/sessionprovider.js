import React, { createContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "antd";

// Create Session Context
export const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const countdownValueRef = useRef(15);

  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const countdownRef = useRef(null);

  const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes inactivity
  const WARNING_TIME = 15 * 1000; // Show popup 15 seconds before timeout

  // ✅ Logout Function
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    clearTimeout(timeoutRef.current);
    clearTimeout(warningTimeoutRef.current);
    clearInterval(countdownRef.current);

    setShowPopup(false);
    navigate("/login"); // Redirect to login page
  };

  // ✅ Login Function
  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    resetTimer();
  };

  // ✅ Reset Timer on User Activity
  const resetTimer = () => {
    clearTimeout(timeoutRef.current);
    clearTimeout(warningTimeoutRef.current);
    clearInterval(countdownRef.current);

    warningTimeoutRef.current = setTimeout(() => {
      setShowPopup(true);
      setCountdown(15);
      countdownValueRef.current = 15;

      countdownRef.current = setInterval(() => {
        if (countdownValueRef.current <= 1) {
          clearInterval(countdownRef.current);
          logout();
        } else {
          countdownValueRef.current -= 1;
          setCountdown(countdownValueRef.current);
        }
      }, 1000);
    }, SESSION_TIMEOUT - WARNING_TIME);

    timeoutRef.current = setTimeout(() => {
      logout();
    }, SESSION_TIMEOUT);
  };

  // ✅ Check Session from Backend
  const checkSession = async () => {
    try {
      const response = await fetch("http://localhost/backend/includes/session.php");
      const data = await response.json();
      if (!data.success) {
        sessionStorage.removeItem("user");
        logout(); // Redirect to login page if session expired
      }
    } catch (error) {
      console.error("Session check failed:", error);
      logout();
    }
  };

  // ✅ Continue Session
  const handleContinue = () => {
    setShowPopup(false);
    clearInterval(countdownRef.current);
    resetTimer();
  };

  useEffect(() => {
    if (user) {
      resetTimer();
      checkSession();
      const sessionInterval = setInterval(checkSession, 5000); // Check session every 5 seconds

      // Add event listeners for user activity
      const events = ["mousemove", "keypress", "scroll", "click"];
      events.forEach((event) => window.addEventListener(event, resetTimer));

      return () => {
        clearTimeout(timeoutRef.current);
        clearTimeout(warningTimeoutRef.current);
        clearInterval(countdownRef.current);
        clearInterval(sessionInterval);
        events.forEach((event) => window.removeEventListener(event, resetTimer));
      };
    }
  }, [user]);

  return (
    <SessionContext.Provider value={{ user, login, logout }}>
      {children}

      {/* Popup Modal for Session Expiry Warning */}
      <Modal
        title="Session Expiring Soon"
        open={showPopup}
        onCancel={() => setShowPopup(false)}
        footer={[
          <Button key="logout" type="primary" danger onClick={logout}>
            Logout
          </Button>,
          <Button key="continue" onClick={handleContinue}>
            Continue ({countdown} sec)
          </Button>,
        ]}
      >
        <p>Your session will expire in <strong>{countdown} seconds</strong> due to inactivity.</p>
        <p>Do you want to continue?</p>
      </Modal>
    </SessionContext.Provider>
  );
};
