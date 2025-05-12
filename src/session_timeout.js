import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionTimeout = ({ timeout = 600000 }) => { // Default: 10 min (600,000 ms)
    const navigate = useNavigate();

    useEffect(() => {
        const logout = () => {
            alert("Your session has expired. You will be logged out.");
            localStorage.removeItem("authToken"); // Clear auth token (if used)
            navigate("/login"); // Redirect to login page
        };

        // Set session timeout
        const timer = setTimeout(logout, timeout);

        // Reset timer on user activity
        const resetTimer = () => {
            clearTimeout(timer);
            setTimeout(logout, timeout);
        };

        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
        };
    }, [navigate, timeout]);

    return null; // This component does not render anything
};

export default SessionTimeout;
