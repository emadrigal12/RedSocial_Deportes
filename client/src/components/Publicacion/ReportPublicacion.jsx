import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast"

const ReportPublicacion = ({ postId, closeReport }) => {
  const [isReported, setIsReported] = useState(false);
  const { toast } = useToast();
  const sendReport = async () => {
    try {
      const response = await fetch(
        "https://prod-11.westus.logic.azure.com:443/workflows/74f363c8f6274c2a994a1eca4d13f60f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=DjONCAfwp_JKQCkOfvbQfBxJGYRMuawsTO9oUQHzl4s",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: postId,
            reportReason: "Contenido inapropiado",
          }),
        }
      );

      if (response.ok) {
        console.log("Reporte enviado exitosamente");
        setIsReported(true); 
        setTimeout(() => {
          closeReport();
        }, 3000); 
      } else {
        console.log("Error al enviar el reporte.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleReport = async (postId) => {
    const userId = auth.currentUser.uid;
    const reason = "Contenido inapropiado";
    
    const result = await reportPost(postId, userId, reason);
    if (result.success) {
      await sendReport();
      toast({
        variant: "outline",
        title: "Éxito",
        description: `Publicación reportada con éxito`
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error al reportar publicación`
      });
    }
  };

  return (
    <div className="relative">
      {isReported && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2">
          <span className="text-xl">✔️</span>
          <span className="text-white">Reporte enviado exitosamente</span>
        </div>
      )}

      {!isReported && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 p-6 rounded-lg shadow-lg text-center z-50">
          <h3 className="text-sm font-semibold mb-4">Reportar Publicación</h3>
          <p className="mb-4">¿Estás seguro de que deseas reportar esta publicación?</p>
          <button
            onClick={handleReport}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-red-600"
          >
            Reportar
          </button>
          <button
            onClick={closeReport}
            className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportPublicacion;

