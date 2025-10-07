import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import DownloadPanel from "./components/DownloadPanel";
import ProcessPanel from "./components/ProcessPanel";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("download");

  const renderContent = () => {
    switch (currentView) {
      // case "dashboard":
      //   return <Dashboard />;
      case "download":
        return (
          <div>
            <div className="app-header">
              <h1 className="app-title">
                Sistema de <span className="app-title-accent">Descarga</span>
              </h1>
              <p className="app-subtitle">
                Descarga archivos procesados de recaudadores
              </p>
            </div>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <DownloadPanel />
            </div>
          </div>
        );
      case "process":
        return (
          <div>
            <div className="app-header">
              <h1 className="app-title">
                Procesos <span className="app-title-accent">Automaticos</span>
              </h1>
              <p className="app-subtitle">
                Ejecuta procesos de conciliacion y liquidacion
              </p>
            </div>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <ProcessPanel />
            </div>
          </div>
        );
      // case "reports":
      //   return (
      //     <div className="app-header">
      //       <h1 className="app-title">
      //         <span className="app-title-accent">Reportes</span>
      //       </h1>
      //       <p className="app-subtitle">Seccion en desarrollo...</p>
      //     </div>
      //   );
      // case "settings":
      //   return (
      //     <div className="app-header">
      //       <h1 className="app-title">
      //         <span className="app-title-accent">Configuracion</span>
      //       </h1>
      //       <p className="app-subtitle">Seccion en desarrollo...</p>
      //     </div>
      //   );
      default:
        // return <Dashboard />;
        return <DownloadPanel />;
    }
  };

  return (
    <>
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="app-container">
        {renderContent()}
      </div>
    </>
  );
}

export default App;