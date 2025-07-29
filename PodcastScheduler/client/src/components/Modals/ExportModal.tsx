import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { File, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/context/CalendarContext";
import { exportToImage, exportToPDF } from "@/lib/export";
import { useToast } from "@/hooks/use-toast";

interface ExportModalProps {
  calendarRef: React.RefObject<HTMLDivElement>;
}

const ExportModal: React.FC<ExportModalProps> = ({ calendarRef }) => {
  const { showExportModal, setShowExportModal } = useCalendar();
  const { toast } = useToast();
  
  const handleClose = () => {
    setShowExportModal(false);
  };
  
  const handleExportPDF = async () => {
    const success = await exportToPDF(calendarRef);
    
    if (success) {
      toast({
        title: "Exportación exitosa",
        description: "El calendario ha sido exportado como PDF"
      });
    } else {
      toast({
        title: "Error",
        description: "Hubo un problema al exportar el PDF",
        variant: "destructive"
      });
    }
    
    handleClose();
  };
  
  const handleExportImage = async () => {
    const success = await exportToImage(calendarRef);
    
    if (success) {
      toast({
        title: "Exportación exitosa",
        description: "El calendario ha sido exportado como imagen"
      });
    } else {
      toast({
        title: "Error",
        description: "Hubo un problema al exportar la imagen",
        variant: "destructive"
      });
    }
    
    handleClose();
  };
  
  return (
    <Dialog open={showExportModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar Calendario</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Selecciona el formato para exportar tu calendario semanal:
          </p>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full flex justify-between items-center p-6"
              onClick={handleExportPDF}
            >
              <div className="flex items-center">
                <File className="h-5 w-5 text-[#EA4335] mr-3" />
                <span>Archivo PDF</span>
              </div>
              <span className="text-xl">→</span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full flex justify-between items-center p-6"
              onClick={handleExportImage}
            >
              <div className="flex items-center">
                <Image className="h-5 w-5 text-[#4285F4] mr-3" />
                <span>Imagen PNG</span>
              </div>
              <span className="text-xl">→</span>
            </Button>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button variant="ghost" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
