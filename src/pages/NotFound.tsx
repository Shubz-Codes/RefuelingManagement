import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e0e7ff 0%, #fff 50%, #e0e7ff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* Logo at top left */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginBottom: "-2rem",
        }}
      >
        <img
          src="/assets/logo.png"
          alt="Logo"
          style={{
            height: "112px",
            marginLeft: "0.5rem",
            marginTop: "0.5rem",
          }}
        />
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: "32rem",
          margin: "0 auto",
          textAlign: "center",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            color: "#192133",
            marginBottom: "1.5rem",
            letterSpacing: "0.05em",
            textAlign: "center",
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#192133",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Page Not Found
        </h2>
        <p
          style={{
            color: "#22305b",
            fontSize: "1.125rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Sorry, the page you are looking for does not exist.
        </p>
        <a
          href="/"
          style={{
            background: "#192133",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "0.5rem",
            padding: "1rem 2rem",
            fontSize: "1.25rem",
            textDecoration: "none",
            margin: "0 auto",
            display: "inline-block",
          }}
        >
          Go Home
        </a>
      </div>
      <footer
        style={{
          width: "100%",
          textAlign: "center",
          padding: "1.5rem 0",
          marginTop: "3rem",
          fontSize: "1rem",
          color: "#192133",
          fontWeight: 500,
          borderTop: "1px solid #22305b20",
          background: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Repos Energy Pvt. Ltd. All Rights Reserved.
      </footer>
    </div>
  );
};

export default NotFound;
