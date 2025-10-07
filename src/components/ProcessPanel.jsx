import { useState } from "react";
import Swal from "sweetalert2";
import "./ProcessPanel.css";
import { FaGetPocket } from "react-icons/fa6";

function ProcessPanel() {
  const [tipo, setTipo] = useState("conciliacion");
  const [recaudador, setRecaudador] = useState("kashio");
  const [periodo, setPeriodo] = useState("DIA");
  const [fecha, setFecha] = useState("");

  const apiKey = import.meta.env.VITE_API_KEY;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const endpoints = {
    conciliacion: {
      kashio: "execute-getkashio",
      monnet: "execute-getmonnet",
      kushki: "execute-getkushki",
      niubiz: "execute-getniubiz",
      yape: "execute-getyape",
      nuvei: "execute-getnuvei",
      pagoefectivo: "execute-getpagoefectivo",
      safetypay: "execute-getsafetypay",
      tupay: "execute-gettupay",
    },
    liquidacion: {
      kashio: "execute-liqkashio",
    },
  };

  // === FORMATEADORES ===
  const formatearFecha = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}${String(
      d.getMonth() + 1
    ).padStart(2, "0")}${d.getFullYear()}`;
  };

  const formatearMes = (date) => {
    const [y, m] = date.split("-");
    return `${m}${y}`;
  };

  const calcularFechaAutomatica = () => {
    const hoy = new Date();
    const diasARestar = recaudador.toLowerCase() === "pagoefectivo" ? 2 : 1;
    hoy.setDate(hoy.getDate() - diasARestar);
    return hoy;
  };

  // === FUNCIoN PRINCIPAL ===
  const handleProcesar = async () => {
    const endpoint = endpoints[tipo]?.[recaudador.toLowerCase()];
    if (!endpoint) {
      Swal.fire({
        icon: "info",
        title: "No disponible",
        text: "Este recaudador aun no tiene endpoint configurado",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    let dateParam = "";
    let mensajeFecha = "";

    if (periodo === "MES") {
      if (!fecha) {
        Swal.fire({
          icon: "warning",
          title: "Fecha requerida",
          text: "Debe seleccionar un mes antes de continuar.",
          confirmButtonColor: "#dc2626",
        });
        return; // detener aqui
      }
      const fechaCompleta = `${fecha}-01`

      dateParam = formatearMes(fechaCompleta);
      console.log("dateparam para mes es: ", dateParam)

      const [año, mes] = fecha.split("-");
      const nombreMes = new Date(mes).toLocaleString("es-ES", {
        month: "long",
      });      
      mensajeFecha = `del mes de ${nombreMes} de ${año}`;
    }

    if (periodo === "DIA") {
        if (fecha) {
            // ✅ crear fecha local sin desfase UTC
            const [year, month, day] = fecha.split("-").map(Number);
            const d = new Date(year, month - 1, day); // <-- usa mes - 1
            console.log("enviando fecha con param de d", d);
            console.log("enviando fecha con param de dia", fecha);
            dateParam = formatearFecha(d);
            mensajeFecha = `del dia ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        } else {
            // ✅ solo si no se eligio fecha
            const d = calcularFechaAutomatica();
            console.log("enviando fecha sin param de d", d);
            console.log("enviando fecha sin param de dia", fecha);
            dateParam = formatearFecha(d);
            const mensajeExtra =
            recaudador.toLowerCase() === "pagoefectivo"
                ? " (descarga D-2 automatica)"
                : " (descarga D-1 automatica)";
            mensajeFecha = `del dia ${d.getDate()}/${
            d.getMonth() + 1
            }/${d.getFullYear()}${mensajeExtra}`;
        }

        console.log("dataparam para dia es: ", dateParam)
    }
    // Confirmacion antes de ejecutar
    const confirmacion = await Swal.fire({
      icon: "question",
      title: "Confirmar proceso",
      text: `Usted esta procesando ${mensajeFecha}. ¿Desea continuar?`,
      showCancelButton: true,
      confirmButtonText: "Si, ejecutar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#dc2626",
    });

    if (!confirmacion.isConfirmed) return;

    // Construir URL final
    const url = `${baseUrl}/digital/${endpoint}?period=${periodo}&date_param=${dateParam}`;
    console.log(`→ URL final: ${url}`);

    Swal.fire({
      title: "Procesando...",
      text: "Ejecutando proceso, por favor espere",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { "x-api-key": apiKey },
      });

      Swal.close();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Proceso completado",
          text: "El proceso se ejecuto correctamente",
          confirmButtonColor: "#2563eb",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Error ${res.status}: ${res.statusText}`,
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error de conexion",
        text: `No se pudo conectar al servidor: ${err}`,
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="process-panel">
      <div className="process-panel-header">
        <div className="process-panel-icon"><FaGetPocket /></div>
        <h2 className="process-panel-title">Procesos Automaticos</h2>
        <p className="process-panel-subtitle">
          Ejecuta procesos de conciliacion y liquidacion
        </p>
      </div>

      <div className="process-panel-body">
        <div className="form-group">
          <label className="form-label">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="form-select"
          >
            <option value="conciliacion">Conciliacion</option>
            <option value="liquidacion">Liquidacion</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Recaudador</label>
          <select
            value={recaudador}
            onChange={(e) => setRecaudador(e.target.value)}
            className="form-select"
          >
            {Object.keys(endpoints.conciliacion).map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Periodo</label>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="form-select"
          >
            <option value="DIA">Dia</option>
            <option value="MES">Mes</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Fecha / Mes</label>
          <input
            type={periodo === "DIA" ? "date" : "month"}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="form-input"
          />
        </div>

        <button
        onClick={handleProcesar}
        className="btn-secondary"
        disabled={periodo === "MES" && !fecha}
        style={{
            opacity: periodo === "MES" && !fecha ? 0.6 : 1,
            cursor: periodo === "MES" && !fecha ? "not-allowed" : "pointer",
        }}
        >
        Ejecutar Proceso
        </button>
      </div>
    </div>
  );
}

export default ProcessPanel;
