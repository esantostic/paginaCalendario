import React from "react";
import { Note, CATEGORY_CONFIG, NOTE_COLOR_CONFIG } from "@shared/schema";
import { useCalendar } from "@/context/CalendarContext";
import { Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface NoteProps {
  note: Note;
  index: number;
  readOnly?: boolean;
}

const NoteComponent: React.FC<NoteProps> = ({ note, index, readOnly = false }) => {
  const { setSelectedNoteId, setSelectedImageUrl, weekOffset } = useCalendar();
  const { toast } = useToast();
  
  const categoryConfig = CATEGORY_CONFIG[note.category as keyof typeof CATEGORY_CONFIG];
  const noteColor = note.color || 'default';
  const colorConfig = NOTE_COLOR_CONFIG[noteColor as keyof typeof NOTE_COLOR_CONFIG];
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNoteId(note.id);
  };
  
  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await apiRequest('DELETE', `/api/notes/${note.id}`, undefined);
      await queryClient.invalidateQueries({ queryKey: ['/api/notes', weekOffset] });
      
      toast({
        title: "Nota eliminada",
        description: "La nota ha sido eliminada correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la nota",
        variant: "destructive"
      });
    }
  };
  
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (note.image) {
      setSelectedImageUrl(note.image);
    }
  };
  
  return (
    <Draggable draggableId={String(note.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "note border-l-4 rounded shadow-sm p-3",
            colorConfig.bgColor,
            colorConfig.borderColor,
            colorConfig.textColor,
            snapshot.isDragging ? "opacity-50" : ""
          )}
          data-note-id={note.id}
          data-color={noteColor}
        >
          <div className="flex justify-between items-start mb-2">
            <span 
              className={`text-xs font-bold text-white px-3 py-1 rounded-full shadow-sm`}
              style={{
                backgroundColor: 
                  note.category === 'task' ? '#dc2626' : 
                  note.category === 'presentation' ? '#2563eb' : 
                  note.category === 'celebration' ? '#9333ea' : 
                  note.category === 'birthday' ? '#f59e0b' : '#4b5563'
              }}
            >
              {categoryConfig.name}
            </span>
            {!readOnly && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-gray-500 hover:text-primary"
                  onClick={handleEditClick}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-gray-500 hover:text-[#EA4335]"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          
          <h3 className="font-medium">{note.title}</h3>
          <p className="text-sm mt-1">{note.content}</p>
          
          {note.image && (
            <div className="mt-2">
              <img
                src={note.image}
                alt={note.title}
                className="w-full h-auto rounded image-preview cursor-pointer hover:scale-105 transition-transform"
                onClick={handleImageClick}
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default NoteComponent;
