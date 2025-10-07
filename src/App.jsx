import DownloadPanel from "./components/DownloadPanel";
import ProcessPanel from "./components/ProcessPanel";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">
          Sistema de Gestion <span className="app-title-accent">Digital</span>
        </h1>
        <p className="app-subtitle">
          Plataforma unificada de descarga y procesamiento automatico
        </p>
      </div>
      
      <div className="panels-grid">
        <DownloadPanel />
        <ProcessPanel />
      </div>
    </div>
  );
}

export default App;