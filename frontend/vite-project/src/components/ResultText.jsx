import React from "react";

const ResultText = ({ prediction }) => {
  if (!prediction) return null;

  const isHealthy = prediction === "No Malaria";
  const isMalaria = prediction === "Malaria Detected";

  return (
    <div style={{
      padding: "2rem",
      borderRadius: "10px",
      borderLeft: "5px solid",
      background: isHealthy
        ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
        : isMalaria
        ? "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)"
        : "linear-gradient(135deg, #f5f5f5 0%, #f0f0f0 100%)",
      borderLeftColor: isHealthy ? "#10b981" : isMalaria ? "#dc2626" : "#9ca3af",
      animation: "slideUp 0.5s ease",
    }}>
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "1.5rem",
        marginBottom: "1.5rem",
      }}>
        <div style={{
          fontSize: "2.5rem",
          lineHeight: 1,
        }}>
          {isHealthy ? "✅" : isMalaria ? "⚠️" : "ℹ️"}
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            margin: "0 0 0.5rem 0",
            color: isHealthy ? "#166534" : isMalaria ? "#991b1b" : "#4b5563",
          }}>
            {prediction}
          </h3>
          <p style={{
            margin: "0 0 1rem 0",
            color: isHealthy ? "#4b7c59" : isMalaria ? "#7c2d2d" : "#6b7280",
            lineHeight: 1.6,
          }}>
            {isHealthy
              ? "Blood smear analysis complete. No malaria parasites detected in the sample."
              : isMalaria
              ? "Malaria parasites have been detected in the blood smear sample."
              : "Analysis encountered an issue. Please try again with a different image."}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div style={{
        background: "rgba(255, 255, 255, 0.7)",
        padding: "1.5rem",
        borderRadius: "8px",
      }}>
        <h4 style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          margin: "0 0 1rem 0",
          color: isHealthy ? "#166534" : isMalaria ? "#991b1b" : "#4b5563",
        }}>
          {isHealthy ? "✓ Recommendations" : isMalaria ? "⚠️ Recommended Actions" : "ℹ️ Information"}
        </h4>

        <ul style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}>
          {isHealthy ? (
            <>
              <li style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#4b7c59",
                fontSize: "0.95rem",
              }}>
                <span style={{ fontSize: "1.2rem" }}>✓</span>
                <span>Blood sample appears healthy with no malaria parasites detected</span>
              </li>
              <li style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#4b7c59",
                fontSize: "0.95rem",
              }}>
                <span style={{ fontSize: "1.2rem" }}>✓</span>
                <span>Continue regular health checkups and preventive measures</span>
              </li>
              <li style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#4b7c59",
                fontSize: "0.95rem",
              }}>
                <span style={{ fontSize: "1.2rem" }}>✓</span>
                <span>Maintain good hygiene and mosquito protection practices</span>
              </li>
            </>
          ) : isMalaria ? (
            <>
              <li style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#7c2d2d",
                fontSize: "0.95rem",
              }}>
                <span style={{ fontSize: "1.2rem" }}>⚠️</span>
                <span>
                  <strong>Consult a qualified healthcare professional immediately</strong>
                </span>
              </li>
              <li style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#7c2d2d",
                fontSize: "0.95rem",
              }}>
                <span style={{ fontSize: "1.2rem" }}>⚠️</span>
                <span>Get confirmed laboratory testing (blood culture, PCR if available)</span>
              </li>
              <li style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#7c2d2d",
                fontSize: "0.95rem",
              }}>
                <span style={{ fontSize: "1.2rem" }}>⚠️</span>
                <span>Start appropriate antimalarial treatment as prescribed</span>
              </li>
              <li style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#7c2d2d",
                fontSize: "0.95rem",
              }}>
                <span style={{ fontSize: "1.2rem" }}>⚠️</span>
                <span>Inform close contacts for preventive measures</span>
              </li>
            </>
          ) : (
            <>
              <li style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#6b7280",
                fontSize: "0.95rem",
              }}>
                <span style={{ fontSize: "1.2rem" }}>ℹ️</span>
                <span>Please try uploading the image again</span>
              </li>
              <li style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#6b7280",
                fontSize: "0.95rem",
              }}>
                <span style={{ fontSize: "1.2rem" }}>ℹ️</span>
                <span>Ensure the image is in PNG or JPG format</span>
              </li>
              <li style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#6b7280",
                fontSize: "0.95rem",
              }}>
                <span style={{ fontSize: "1.2rem" }}>ℹ️</span>
                <span>Check that the backend server is running</span>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: "1.5rem",
        padding: "1rem",
        background: "#fffbeb",
        border: "1px solid #fcd34d",
        borderRadius: "6px",
        fontSize: "0.85rem",
        color: "#92400e",
      }}>
        <strong>⚠️ Disclaimer:</strong> This system is a diagnostic aid tool. Results must be validated by qualified
        healthcare professionals. Always follow established clinical protocols for malaria diagnosis and treatment.
      </div>
    </div>
  );
};

export default ResultText;
