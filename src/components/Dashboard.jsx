import "./Dashboard.css";

function Dashboard() {
  const stats = [
    { icon: "📥", label: "Descargas Hoy", value: "127", color: "#dc2626" },
    { icon: "⚙️", label: "Procesos Activos", value: "8", color: "#1f2937" },
    { icon: "✅", label: "Completados", value: "95%", color: "#10b981" },
    { icon: "📊", label: "Total Archivos", value: "1,234", color: "#3b82f6" },
  ];

  const recentActivity = [
    { action: "Descarga completada", file: "Kashio_20250103.xlsx", time: "Hace 5 min" },
    { action: "Proceso ejecutado", file: "Conciliacion Nuvei", time: "Hace 12 min" },
    { action: "Descarga completada", file: "Monnet_Liquidacion.xlsx", time: "Hace 23 min" },
    { action: "Proceso ejecutado", file: "Conciliacion Kushki", time: "Hace 1 hora" },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Panel de Control</h2>
        <p className="dashboard-subtitle">Resumen de actividades del sistema</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="activity-section">
        <h3 className="activity-title">Actividad Reciente</h3>
        <div className="activity-list">
          {recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">📄</div>
              <div className="activity-details">
                <p className="activity-action">{activity.action}</p>
                <p className="activity-file">{activity.file}</p>
              </div>
              <div className="activity-time">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;