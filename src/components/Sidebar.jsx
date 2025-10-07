import { useState } from "react";
import "./Sidebar.css";
import Logo from "../assets/img/logo.jpg"
import { FaDownload } from "react-icons/fa6";
import { FaGetPocket } from "react-icons/fa6";

function Sidebar({ currentView, onViewChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    // { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "download", icon: <FaDownload />, label: "Descargas" },
    { id: "process", icon: <FaGetPocket />, label: "Procesos" },
    // { id: "reports", icon: "📄", label: "Reportes" },
    // { id: "settings", icon: "⚙️", label: "Configuracion" },
  ];

  const handleItemClick = (viewId) => {
    onViewChange(viewId);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            
                <img
                    alt="Logo"
                    src={Logo}
                    width="40"
                    className="d-inline-block align-top rounded-3 me-3 shadow-sm"
                />
            
            <div className="sidebar-logo-text">
              Apuesta <span className="sidebar-logo-accent">Total</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`sidebar-menu-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <span className="sidebar-menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>© 2025 Sistema Digital - Optimizacion Operativa</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;