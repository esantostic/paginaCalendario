import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCalendar } from "@/context/CalendarContext";
import NoteForm from "@/components/Notes/NoteForm";
import { Note } from "@shared/schema";
import { NoteFormValues } from "@/lib/types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const NoteModal: React.FC = () => {
  const { selectedNoteId, setSelectedNoteId, weekOffset } = useCalendar();
  const [note, setNote] = useState<Note | undefined>(undefined);
  const { toast } = useToast();
  const isNewNote = selectedNoteId === 0;
  
  // Fetch note data if editing an existing note
  const { data, isLoading: isFetchingNote } = useQuery<Note>({
    queryKey: [`/api/notes/${selectedNoteId}`],
    queryFn: async () => {
      const res = await fetch(`/api/notes/${selectedNoteId}`);
      if (!res.ok) throw new Error('Error fetching note');
      return res.json();
    },
    enabled: !isNewNote && selectedNoteId !== null,
  });
  
  // Update note when data is available
  useEffect(() => {
    if (data) {
      setNote(data);
    }
  }, [data]);
  
  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: NoteFormValues) => {
      return apiRequest('POST', '/api/notes', noteData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/notes', weekOffset] });
      setSelectedNoteId(null);
      toast({
        title: "Nota creada",
        description: "La nota ha sido creada correctamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la nota",
        variant: "destructive",
      });
    }
  });
  
  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async (noteData: NoteFormValues) => {
      return apiRequest('PATCH', `/api/notes/${selectedNoteId}`, noteData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/notes', weekOffset] });
      setSelectedNoteId(null);
      toast({
        title: "Nota actualizada",
        description: "La nota ha sido actualizada correctamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la nota",
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = (formData: NoteFormValues) => {
    // Ensure weekOffset is set
    formData.weekOffset = weekOffset;
    
    if (isNewNote) {
      createNoteMutation.mutate(formData);
    } else {
      updateNoteMutation.mutate(formData);
    }
  };
  
  // Handle closing the modal
  const handleClose = () => {
    setSelectedNoteId(null);
  };
  
  return (
    <Dialog open={selectedNoteId !== null} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isNewNote ? "Agregar Nota" : "Editar Nota"}
          </DialogTitle>
        </DialogHeader>
        
        {(isNewNote || note) && (
          <NoteForm
            defaultValues={isNewNote ? undefined : note}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isSubmitting={createNoteMutation.isPending || updateNoteMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NoteModal;
