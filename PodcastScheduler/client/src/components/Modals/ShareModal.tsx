import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share, Copy, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToImage } from "@/lib/export";
import { useCalendar } from "@/context/CalendarContext";

interface ShareModalProps {
  calendarRef: React.RefObject<HTMLDivElement>;
}

const ShareModal: React.FC<ShareModalProps> = ({ calendarRef }) => {
  const { toast } = useToast();
  const { showShareModal, setShowShareModal, setShareLink } = useCalendar();
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      // Generar una imagen y convertirla a una URL
      const imageUrl = await exportToImage(calendarRef);
      
      // Crear un ID único para compartir (en una implementación real, esto guardaría la imagen en un servidor)
      const shareId = `share-${Date.now()}`;
      
      // Crear una URL compartible
      const url = `${window.location.origin}/view?id=${shareId}`;
      setShareUrl(url);
      setShareLink(url); // Guardar en el contexto para acceso global
      
      toast({
        title: "¡Enlace generado!",
        description: "Comparte esta URL para que otros puedan ver tu calendario",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el enlace para compartir",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "¡Copiado!",
          description: "Enlace copiado al portapapeles",
        });
        
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "No se pudo copiar al portapapeles",
          variant: "destructive"
        });
      });
  };

  return (
    <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Calendario</DialogTitle>
          <DialogDescription>
            Genera un enlace para compartir tu calendario semanal
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-gray-500">
            Al generar un enlace, se creará una versión compartible de tu calendario actual que otros podrán ver sin necesidad de iniciar sesión.
          </p>
          
          {!shareUrl ? (
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
            >
              <Share className="mr-2 h-4 w-4" />
              {isGenerating ? "Generando..." : "Generar enlace para compartir"}
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Input 
                value={shareUrl}
                readOnly 
                className="flex-1 text-xs"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
              >
                {isCopied ? (
                  <CheckCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-start">
          <div className="text-xs text-gray-500">
            Este enlace permite ver el calendario sin opciones de edición.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;