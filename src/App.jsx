import { useState } from "react";
import Swal from "sweetalert2";

function App() {
  const [archivo, setArchivo] = useState("");
  const apiKey = import.meta.env.VITE_API_KEY;
  const Urlbase = import.meta.env.VITE_API_BASE_URL

  console.log("api_key", apiKey)
  console.log("url", Urlbase)

  const handleDownload = async () => {
    if (!archivo) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor ingresa un nombre de archivo',
        confirmButtonColor: '#0666eb',
      });
      return;
    }

    // confirmacion
    const result = await Swal.fire({
      icon: 'question',
      title: 'Confirmar descarga',
      html: `
        <div style="text-align: left;">
          <p>El archivo que desea descargar es:</p>
          <p><strong>Nombre del archivo:</strong></p>
          <p style="background: #f8f9fa; padding: 10px; border-radius: 5px; border-left: 4px solid #0666eb; margin: 10px 0;">
            ${archivo}
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0666eb',
      cancelButtonColor: '#6c757d',
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    const s3_key = `digital/apps/total-secure/conciliaciones/processed/${archivo}`;
    const url = `${Urlbase}/digital/download/${s3_key}`;

    console.log("Enviando ruta:", s3_key);

    // cargando
    Swal.fire({
      title: 'Procesando...',
      text: 'Solicitando archivo, por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
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
            icon: 'success',
            title: 'Descarga iniciada',
            text: 'El archivo se está descargando en una nueva pestaña',
            confirmButtonColor: '#0666eb',
          });
        } else {
          throw new Error("No se pudo obtener el enlace de descarga");
        }
      } else if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.open(data.url, "_blank");
          Swal.fire({
            icon: 'success',
            title: 'Descarga iniciada',
            text: 'El archivo se está descargando en una nueva pestaña',
            confirmButtonColor: '#0666eb',
          });
        } else {
          throw new Error("Respuesta inesperada del servidor");
        }
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la descarga',
        text: err.message,
        confirmButtonColor: '#0666eb',
      });
    }
  };

  return (
    <div style={{ 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
      padding: "40px 20px",
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e9ecef"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#0666eb",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "24px",
            color: "white"
          }}>
            📥
          </div>
          <h2 style={{ 
            margin: "0 0 10px 0", 
            color: "#212529",
            fontSize: "28px",
            fontWeight: "600"
          }}>
            Descargar archivo de recaudador
          </h2>
          <p style={{ 
            color: "#6c757d", 
            margin: 0,
            fontSize: "16px"
          }}>
            Ingresa el nombre del archivo que deseas descargar
          </p>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "500",
            color: "#495057",
            fontSize: "14px"
          }}>
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
              transition: "border-color 0.2s, box-shadow 0.2s"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#0666eb";
              e.target.style.boxShadow = "0 0 0 2px rgba(6, 102, 235, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#ced4da";
              e.target.style.boxShadow = "none";
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
            transition: "background-color 0.2s, transform 0.1s",
            boxShadow: "0 2px 4px rgba(6, 102, 235, 0.3)"
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#0554c7";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#0666eb";
          }}
          onMouseDown={(e) => {
            e.target.style.transform = "scale(0.98)";
          }}
          onMouseUp={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        >
          Descargar Archivo
        </button>
      </div>
    </div>
  );
}

export default App;