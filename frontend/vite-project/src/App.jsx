import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ImagePreview from "./components/ImagePreview";
import ConfettiEffect from "./components/ConfettiEffect";
import ResultText from "./components/ResultText";
import Avatar3D from "./components/Avatar3D";


const App = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState("analysis");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (prediction === "No Malaria") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [prediction]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageLoaded(false);
      setFadeOut(false);
    }
  };

  const handleReset = () => {
    setFadeOut(true);
    setTimeout(() => {
      setFile(null);
      setPrediction("");
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 400);
  };

  const handleUpload = async () => {
  if (!file) {
    alert("Please select an image");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  setIsProcessing(true);

  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "";
    if (!API_BASE_URL) {
      console.error("VITE_API_URL is not set — cannot reach the backend.");
      alert("Backend URL is not configured. Set VITE_API_URL and rebuild the frontend.");
      setIsProcessing(false);
      return;
    }
    const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 30000,
    });

    console.log("Response:", response.data);
    setPrediction(response.data.prediction);
  } catch (error) {
    console.error("Error:", error);
    const message =
      error.response?.data?.error ||
      (error.code === "ECONNABORTED"
        ? "Request timed out. The backend may be waking up — try again in a few seconds."
        : "Could not reach the backend. Please try again.");
    alert(message);
    setPrediction("Error");
  } finally {
    setIsProcessing(false);
  }
};
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🔬</div>
            <h1>MalariaDetect Pro</h1>
            <p className="tagline">AI-Powered Malaria Parasite Detection System</p>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "analysis" ? "active" : ""}`}
          onClick={() => setActiveTab("analysis")}
        >
          <span className="tab-icon">📊</span>
          Analysis
        </button>
        <button
          className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          <span className="tab-icon">ℹ️</span>
          Project Info
        </button>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Analysis Tab */}
        {activeTab === "analysis" && (
          <div className="analysis-tab">
            <div className="analysis-container">
              {/* Left Panel - Avatar & Controls */}
              <div className="left-panel">
                <div className="avatar-container">
                  <Avatar3D predictionResult={prediction} />
                </div>
                <div className="controls-section">
                  <div className="file-upload-area">
                    <label htmlFor="file-input" className="file-label">
                      <div className="upload-icon">📸</div>
                      <p className="upload-text">Upload Blood Smear Image</p>
                      <p className="upload-subtext">PNG, JPG up to 10MB</p>
                    </label>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="file-input"
                    />
                  </div>

                  {file && (
                    <div className="file-info">
                      <p className="file-name">{file.name}</p>
                      <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  )}

                  <div className="action-buttons">
                    <button
                      onClick={handleUpload}
                      className="btn btn-predict"
                      disabled={!file || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner"></span>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <span>🔍</span>
                          Predict
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleReset}
                      className="btn btn-reset"
                      disabled={!file && !prediction}
                    >
                      <span>↻</span>
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel - Results */}
              <div className="right-panel">
                <div className="results-container">
                  <div className="image-analysis">
                    <h3 className="section-title">Sample Image</h3>
                    <div className="image-display-wrapper">
                      <ImagePreview
                        imagePreview={imagePreview}
                        onLoad={() => setImageLoaded(true)}
                        loaded={imageLoaded}
                        fadeOut={fadeOut}
                      />
                    </div>

                  </div>

                  {/* Prediction Result Card */}
                  {prediction && (
                    <div className={`result-card result-${prediction.toLowerCase().replace(/\s+/g, "-")}`}>
                      <ResultText prediction={prediction} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <ConfettiEffect show={showConfetti} />
          </div>
        )}

        {/* Info Tab */}
        {activeTab === "info" && (
          <div className="info-tab">
            <div className="info-container">
              {/* Project Overview */}
              <section className="info-section">
                <div className="section-header">
                  <h2>Project Overview</h2>
                </div>
                <div className="info-content">
                  <p className="info-text">
                    <strong>MalariaDetect Pro</strong> is an advanced AI-powered diagnostic system designed for the
                    rapid and accurate detection of malaria parasites in thin blood smear images. Leveraging state-of-the-art
                    deep learning models and explainable AI techniques, this system assists healthcare professionals in
                    making faster, more accurate diagnostic decisions.
                  </p>
                </div>
              </section>

              {/* Model Information */}
              <section className="info-section">
                <div className="section-header">
                  <h2>Model Architecture</h2>
                </div>
                <div className="model-grid">
                  <div className="model-card">
                    <div className="card-icon">🧠</div>
                    <h3>Base Model</h3>
                    <p><strong>EfficientNetV2-S</strong></p>
                    <p className="card-description">Lightweight, high-efficiency convolutional neural network for image classification</p>
                  </div>

                  <div className="model-card">
                    <div className="card-icon">🎯</div>
                    <h3>Task Type</h3>
                    <p><strong>Binary Classification</strong></p>
                    <p className="card-description">Malaria Detected vs. No Malaria (Healthy Sample)</p>
                  </div>

                  <div className="model-card">
                    <div className="card-icon">📊</div>
                    <h3>Input</h3>
                    <p><strong>Thin Blood Smear Images</strong></p>
                    <p className="card-description">High-resolution microscopy images of blood samples stained with Giemsa</p>
                  </div>

                  <div className="model-card">
                    <div className="card-icon">⚡</div>
                    <h3>Inference</h3>
                    <p><strong>Fast & Lightweight</strong></p>
                    <p className="card-description">Optimized for quick, low-resource predictions</p>
                  </div>
                </div>
              </section>

              {/* Key Features */}
              <section className="info-section">
                <div className="section-header">
                  <h2>Key Features</h2>
                </div>
                <div className="features-list">
                  <div className="feature-item">
                    <div className="feature-bullet">✓</div>
                    <div className="feature-text">
                      <h4>High Accuracy</h4>
                      <p>EfficientNetV2-S model trained on thousands of annotated blood smear images</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-bullet">✓</div>
                    <div className="feature-text">
                      <h4>Simple Results</h4>
                      <p>Clear, direct malaria detection results for quick review</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-bullet">✓</div>
                    <div className="feature-text">
                      <h4>Fast Processing</h4>
                      <p>Real-time analysis of blood smear images with sub-second inference time</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-bullet">✓</div>
                    <div className="feature-text">
                      <h4>User-Friendly Interface</h4>
                      <p>Intuitive medical-grade UI designed for healthcare professionals and researchers</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-bullet">✓</div>
                    <div className="feature-text">
                      <h4>Clinical Grade</h4>
                      <p>Built following medical software standards for reliability and data security</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-bullet">✓</div>
                    <div className="feature-text">
                      <h4>Batch Processing</h4>
                      <p>Support for analyzing multiple samples with comprehensive reporting</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Technology Stack */}
              <section className="info-section">
                <div className="section-header">
                  <h2>Technology Stack</h2>
                </div>
                <div className="tech-grid">
                  <div className="tech-item">
                    <strong>Frontend:</strong>
                    <p>React.js, Three.js, Axios</p>
                  </div>
                  <div className="tech-item">
                    <strong>Backend:</strong>
                    <p>Python, Flask, PyTorch</p>
                  </div>
                  <div className="tech-item">
                    <strong>Model:</strong>
                    <p>EfficientNetV2-S</p>
                  </div>
                </div>
              </section>

              {/* Medical Context */}
              <section className="info-section">
                <div className="section-header">
                  <h2>Medical Context</h2>
                </div>
                <div className="info-content">
                  <p className="info-text">
                    Malaria is a life-threatening parasitic disease transmitted by Anopheles mosquitoes. Early and accurate
                    diagnosis is crucial for effective treatment. The gold standard for malaria diagnosis is microscopy examination
                    of blood smears stained with Giemsa. This system augments traditional microscopy by providing AI-assisted
                    analysis for faster and more consistent detection of malaria parasites.
                  </p>
                </div>
              </section>

              {/* Disclaimer */}
              <section className="info-section disclaimer-section">
                <div className="section-header">
                  <h2>Disclaimer</h2>
                </div>
                <div className="info-content">
                  <p className="info-text disclaimer">
                    ⚠️ This system is designed as a <strong>diagnostic aid</strong> and should not replace professional medical judgment.
                    All results must be validated by qualified healthcare professionals. This tool is intended for research and educational purposes.
                    Always follow established clinical protocols and guidelines for malaria diagnosis and treatment.
                  </p>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2024 MalariaDetect Pro | Advanced AI Diagnostic System for Malaria Detection</p>
      </footer>

      {/* Global Styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background: linear-gradient(135deg, #f0f4f8 0%, #e9f0f7 100%);
          color: #1f2937;
          line-height: 1.6;
        }

        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #f0f4f8 0%, #e9f0f7 100%);
        }

        /* Header */
        .app-header {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 3rem 2rem;
          box-shadow: 0 10px 30px rgba(30, 64, 175, 0.2);
          text-align: center;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .logo-icon {
          font-size: 3rem;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
        }

        .app-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-bottom: 0.5rem;
        }

        .tagline {
          font-size: 1.1rem;
          opacity: 0.95;
          font-weight: 300;
        }

        /* Tab Navigation */
        .tab-navigation {
          display: flex;
          gap: 1rem;
          padding: 2rem 2rem 0;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          border-bottom: 2px solid rgba(30, 64, 175, 0.1);
          background: white;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          color: #6b7280;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          position: relative;
          bottom: -2px;
        }

        .tab-btn:hover {
          color: #1e40af;
        }

        .tab-btn.active {
          color: #1e40af;
          border-bottom-color: #1e40af;
        }

        .tab-icon {
          font-size: 1.2rem;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        /* Analysis Tab */
        .analysis-tab {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .analysis-container {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 2rem;
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        /* Left Panel */
        .left-panel {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .avatar-container {
          width: 100%;
          height: 300px;
          background: linear-gradient(135deg, #f0f4f8 0%, #e9f0f7 100%);
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #e5e7eb;
        }

        /* File Upload */
        .file-upload-area {
          border: 2px dashed #3b82f6;
          border-radius: 10px;
          padding: 2rem;
          text-align: center;
          background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .file-upload-area:hover {
          border-color: #1e40af;
          background: linear-gradient(135deg, #e0eeff 0%, #e8f4ff 100%);
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.1);
        }

        .file-label {
          cursor: pointer;
          display: block;
        }

        .upload-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .upload-text {
          font-weight: 600;
          color: #1e40af;
          margin-bottom: 0.25rem;
        }

        .upload-subtext {
          font-size: 0.9rem;
          color: #6b7280;
        }

        .file-input {
          display: none;
        }

        .file-info {
          padding: 1rem;
          background: #f3f4f6;
          border-radius: 8px;
          border-left: 4px solid #10b981;
        }

        .file-name {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .file-size {
          font-size: 0.9rem;
          color: #6b7280;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 1rem;
          flex-direction: column;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-predict {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
        }

        .btn-predict:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
        }

        .btn-reset {
          background: #f3f4f6;
          color: #1f2937;
          border: 2px solid #d1d5db;
        }

        .btn-reset:hover:not(:disabled) {
          background: #e5e7eb;
          border-color: #9ca3af;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Right Panel */
        .right-panel {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .results-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .image-analysis {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .image-display-wrapper {
  border-radius: 10px;
  overflow: visible;
  border: 1px solid #e5e7eb;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
}

        /* Result Card */
        .result-card {
          padding: 1.5rem;
          border-radius: 10px;
          border-left: 5px solid;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .result-malaria-detected {
          border-left-color: #dc2626;
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        }

        .result-no-malaria {
          border-left-color: #10b981;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        }

        /* Info Tab */
        .info-tab {
          animation: fadeIn 0.3s ease;
        }

        .info-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .info-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 3px solid #1e40af;
        }

        .section-header h2 {
          font-size: 1.8rem;
          color: #1e40af;
          font-weight: 700;
        }

        .info-text {
          color: #4b5563;
          font-size: 1rem;
          line-height: 1.8;
        }

        /* Model Grid */
        .model-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .model-card {
          background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
          border: 2px solid #bfdbfe;
          border-radius: 10px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .model-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(30, 64, 175, 0.15);
          border-color: #3b82f6;
        }

        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .model-card h3 {
          color: #1e40af;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .model-card p {
          color: #4b5563;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .card-description {
          font-size: 0.85rem;
          color: #6b7280;
          margin-top: 0.5rem;
        }

        /* Features List */
        .features-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .feature-item {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 4px solid #10b981;
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          background: #f3f4f6;
          transform: translateX(4px);
        }

        .feature-bullet {
          font-size: 1.5rem;
          font-weight: 700;
          color: #10b981;
          flex-shrink: 0;
        }

        .feature-text h4 {
          color: #1f2937;
          margin-bottom: 0.25rem;
          font-weight: 700;
        }

        .feature-text p {
          color: #6b7280;
          font-size: 0.95rem;
        }

        /* Tech Grid */
        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .tech-item {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .tech-item strong {
          color: #1e40af;
          display: block;
          margin-bottom: 0.5rem;
        }

        .tech-item p {
          color: #6b7280;
          font-size: 0.95rem;
        }

        .disclaimer-section {
          background: linear-gradient(135deg, #fef3c7 0%, #fef08a 100%);
          border-left: 5px solid #f59e0b;
        }

        .disclaimer-section .section-header {
          border-bottom-color: #f59e0b;
        }

        .disclaimer-section .section-header h2 {
          color: #d97706;
        }

        .disclaimer {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #f59e0b;
        }

        /* Footer */
        .app-footer {
          background: #1f2937;
          color: white;
          text-align: center;
          padding: 2rem;
          margin-top: 3rem;
          font-size: 0.95rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .analysis-container {
            grid-template-columns: 1fr;
          }

          .app-header h1 {
            font-size: 1.8rem;
          }

          .model-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .logo-section {
            flex-direction: column;
          }

          .logo-icon {
            font-size: 2rem;
          }

          .app-header h1 {
            font-size: 1.5rem;
          }

          .tagline {
            font-size: 0.95rem;
          }

          .tab-navigation {
            padding: 1rem;
          }

          .tab-btn {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }

          .main-content {
            padding: 1rem;
          }

          .analysis-container {
            padding: 1rem;
          }

          .model-grid,
          .tech-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 1rem;
          }

          .info-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
