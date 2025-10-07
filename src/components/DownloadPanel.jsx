import { useState } from "react";
import Swal from "sweetalert2";
import "./DownloadPanel.css";

function DownloadPanel() {
  const [archivo, setArchivo] = useState("");
  const [tipo, setTipo] = useState("conciliacion");
  const [recaudador, setRecaudador] = useState("kashio");

  const apiKey = import.meta.env.VITE_API_KEY;
  const Urlbase = import.meta.env.VITE_API_BASE_URL;

  const handleDownload = async () => {
    if (!archivo) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor ingresa un nombre de archivo",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "question",
      title: "Confirmar descarga",
      html: `
        <div style="text-align: left;">
          <p style="margin-bottom: 8px; color: #4b5563;"><strong>Tipo:</strong> ${tipo}</p>
          ${
            tipo === "liquidacion"
              ? `<p style="margin-bottom: 8px; color: #4b5563;"><strong>Recaudador:</strong> ${recaudador}</p>`
              : ""
          }
          <p style="margin-bottom: 8px; color: #4b5563;"><strong>Archivo:</strong></p>
          <div style="background: #fef2f2; padding: 12px; border-radius: 8px; border-left: 4px solid #dc2626;">
            <p style="margin: 0; font-weight: 600; color: #991b1b; word-break: break-all;">${archivo}</p>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Descargar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    let s3_key = "";
    if (tipo === "conciliacion") {
      s3_key = `digital/apps/total-secure/conciliaciones/processed/${archivo}`;
    } else {
      s3_key = `digital/collectors/${recaudador.toLowerCase()}/liquidations/processed/${archivo}`;
    }

    const url = `${Urlbase}/digital/download/${s3_key}`;

    Swal.fire({
      title: "Procesando...",
      text: "Solicitando archivo, por favor espere",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "x-api-key": apiKey },
        redirect: "manual",
      });

      Swal.close();

      if (response.status === 302 || response.status === 307) {
        const presignedUrl = response.headers.get("Location");
        if (presignedUrl) {
          window.open(presignedUrl, "_blank");
          Swal.fire({
            icon: "success",
            title: "Descarga iniciada",
            text: "El archivo se esta descargando",
            confirmButtonColor: "#dc2626",
          });
        } else {
          throw new Error("No se pudo obtener el enlace de descarga");
        }
      } else if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.open(data.url, "_blank");
          Swal.fire({
            icon: "success",
            title: "Descarga iniciada",
            text: "El archivo se esta descargando",
            confirmButtonColor: "#dc2626",
          });
        } else {
          throw new Error("Respuesta inesperada del servidor");
        }
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error en la descarga",
        text: err.message,
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="download-panel">
      <div className="download-panel-header">
        <div className="download-panel-icon">📥</div>
        <h2 className="download-panel-title">Sistema de Descarga</h2>
        <p className="download-panel-subtitle">
          Ingresa el nombre del archivo que deseas descargar
        </p>
      </div>

      <div className="download-panel-body">
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

        {tipo === "liquidacion" && (
          <div className="form-group">
            <label className="form-label">Recaudador</label>
            <select
              value={recaudador}
              onChange={(e) => setRecaudador(e.target.value)}
              className="form-select"
            >
              <option value="Kashio">Kashio</option>
              <option value="Monnet">Monnet</option>
              <option value="Kushki">Kushki</option>
              <option value="Nuvei">Nuvei</option>
              <option value="Niubiz">Niubiz</option>
              <option value="Yape">Yape</option>
              <option value="PagoEfectivo">PagoEfectivo</option>
              <option value="Safetypay">Safetypay</option>
              <option value="Tupay">Tupay</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Nombre del Archivo</label>
          <input
            type="text"
            value={archivo}
            onChange={(e) => setArchivo(e.target.value)}
            placeholder="archivo_ejemplo.xlsx"
            className="form-input"
          />
        </div>

        <button onClick={handleDownload} className="btn-primary">
          Descargar Archivo
        </button>
      </div>
    </div>
  );
}

export default DownloadPanel;