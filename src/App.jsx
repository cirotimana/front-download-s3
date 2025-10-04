import { useState } from "react";
import Swal from "sweetalert2";

function App() {
  const [archivo, setArchivo] = useState("");
  const [tipo, setTipo] = useState("conciliacion"); // conciliacion o liquidacion
  const [recaudador, setRecaudador] = useState("kashio");

  const apiKey = import.meta.env.VITE_API_KEY;
  const Urlbase = import.meta.env.VITE_API_BASE_URL;

  const handleDownload = async () => {
    if (!archivo) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor ingresa un nombre de archivo",
        confirmButtonColor: "#0666eb",
      });
      return;
    }

    // confirmacion
    const result = await Swal.fire({
      icon: "question",
      title: "Confirmar descarga",
      html: `
        <div style="text-align: left;">
          <p>El archivo que desea descargar es:</p>
          <p><strong>Tipo:</strong> ${tipo}</p>
          ${
            tipo === "liquidacion"
              ? `<p><strong>Recaudador:</strong> ${recaudador}</p>`
              : ""
          }
          <p><strong>Nombre del archivo:</strong></p>
          <p style="background: #f8f9fa; padding: 10px; border-radius: 5px; border-left: 4px solid #0666eb; margin: 10px 0;">
            ${archivo}
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#0666eb",
      cancelButtonColor: "#6c757d",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    // construir ruta segun el tipo
    let s3_key = "";
    if (tipo === "conciliacion") {
      s3_key = `digital/apps/total-secure/conciliaciones/processed/${archivo}`;
    } else {
      s3_key = `digital/collectors/${recaudador.toLowerCase()}/liquidations/processed/${archivo}`;
    }

    const url = `${Urlbase}/digital/download/${s3_key}`;
    console.log("Enviando ruta:", s3_key);

    Swal.fire({
      title: "Procesando...",
      text: "Solicitando archivo, por favor espere",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
        },
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
            text: "El archivo se esta descargando en una nueva pestaña",
            confirmButtonColor: "#0666eb",
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
            text: "El archivo se esta descargando en una nueva pestaña",
            confirmButtonColor: "#0666eb",
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
        confirmButtonColor: "#0666eb",
      });
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "40px 20px",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e9ecef",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#0666eb",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "24px",
              color: "white",
            }}
          >
            📥
          </div>
          <h2
            style={{
              margin: "0 0 10px 0",
              color: "#212529",
              fontSize: "28px",
              fontWeight: "600",
            }}
          >
            Sistema de Descarga
          </h2>
          <p
            style={{
              color: "#6c757d",
              margin: 0,
              fontSize: "16px",
            }}
          >
            Ingresa el nombre del archivo que deseas descargar
          </p>
        </div>

        {/* selector tipo */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#495057",
              fontSize: "14px",
            }}
          >
            Tipo:
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{
              padding: "12px 16px",
              width: "100%",
              border: "1px solid #ced4da",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          >
            <option value="conciliacion">Conciliacion</option>
            <option value="liquidacion">Liquidacion</option>
          </select>
        </div>

        {/* selector recaudador (solo si es liquidacion) */}
        {tipo === "liquidacion" && (
          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#495057",
                fontSize: "14px",
              }}
            >
              Recaudador:
            </label>
            <select
              value={recaudador}
              onChange={(e) => setRecaudador(e.target.value)}
              style={{
                padding: "12px 16px",
                width: "100%",
                border: "1px solid #ced4da",
                borderRadius: "8px",
                fontSize: "16px",
              }}
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

        {/* input archivo */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#495057",
              fontSize: "14px",
            }}
          >
            Nombre del archivo:
          </label>
          <input
            type="text"
            value={archivo}
            onChange={(e) => setArchivo(e.target.value)}
            placeholder="Ej: archivo_ejemplo.xlsx"
            style={{
              padding: "12px 16px",
              width: "100%",
              border: "1px solid #ced4da",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={handleDownload}
          style={{
            padding: "14px 30px",
            backgroundColor: "#0666eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            width: "100%",
          }}
        >
          Descargar Archivo
        </button>
      </div>
    </div>
  );
}

export default App;
