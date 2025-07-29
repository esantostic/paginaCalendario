import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/context/CalendarContext";

const ImageModal: React.FC = () => {
  const { selectedImageUrl, setSelectedImageUrl } = useCalendar();
  
  const handleClose = () => {
    setSelectedImageUrl(null);
  };
  
  return (
    <Dialog open={selectedImageUrl !== null} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 bg-transparent border-none shadow-none">
        <div className="flex justify-end mb-2">
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="bg-black bg-opacity-50 rounded-lg p-2">
          {selectedImageUrl && (
            <img
              src={selectedImageUrl}
              alt="Imagen ampliada"
              className="max-w-full max-h-[80vh] mx-auto rounded"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
