import React from "react";

const ReportPost = ({ postId }) => {
  const handleReport = async () => {
    try {
      const response = await fetch("https://prod-11.westus.logic.azure.com:443/workflows/74f363c8f6274c2a994a1eca4d13f60f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=DjONCAfwp_JKQCkOfvbQfBxJGYRMuawsTO9oUQHzl4s", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postId,
          reportReason: "Contenido inapropiado", 
        }),
      });

      if (response.ok) {
        alert("¡Reporte enviado exitosamente!");
      } else {
        alert("Error al enviar el reporte.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al reportar la publicación.");
    }
  };

  return (
    <button onClick={handleReport} style={{ background: "red", color: "white" }}>
      Reportar
    </button>
  );
};

export default ReportPost;

