import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCalendar } from "@/context/CalendarContext";
import WeeklyCalendar from "@/components/Calendar/WeeklyCalendar";
import CalendarHeader from "@/components/Calendar/CalendarHeader";
import NoteModal from "@/components/Modals/NoteModal";
import ImageModal from "@/components/Modals/ImageModal";
import ExportModal from "@/components/Modals/ExportModal";
import ShareModal from "@/components/Modals/ShareModal";
import { Note } from "@shared/schema";
import { checkSaturdayEvents, checkSundayEvents } from "@/lib/calendar";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CalendarPage: React.FC = () => {
  const { 
    weekOffset,
    setHasSaturdayEvents,
    setHasSundayEvents,
    selectedNoteId, 
    showExportModal,
    showShareModal,
  } = useCalendar();
  const calendarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch notes for the current week
  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ['/api/notes', weekOffset],
    queryFn: async () => {
      const res = await fetch(`/api/notes?weekOffset=${weekOffset}`);
      if (!res.ok) throw new Error('Error fetching notes');
      return res.json();
    }
  });

  // Check if there are Saturday and Sunday events
  useEffect(() => {
    if (notes && notes.length > 0) {
      setHasSaturdayEvents(checkSaturdayEvents(notes));
      setHasSundayEvents(checkSundayEvents(notes));
    } else {
      setHasSaturdayEvents(false);
      setHasSundayEvents(false);
    }
  }, [notes, setHasSaturdayEvents, setHasSundayEvents]);

  // Handle drag and drop
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside a droppable area
    if (!destination) return;
    
    // Same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    try {
      // Extract note ID and new day
      const noteId = parseInt(result.draggableId);
      const sourceDay = source.droppableId;
      const targetDay = destination.droppableId;
      
      // Find the note
      const note = notes.find(note => note.id === noteId);
      if (!note) return;
      
      // Update note in backend
      await apiRequest('PATCH', `/api/notes/${noteId}`, {
        day: targetDay,
        position: destination.index
      });
      
      // Invalidate query cache to refresh data
      await queryClient.invalidateQueries({ queryKey: ['/api/notes', weekOffset] });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo mover la nota",
        variant: "destructive"
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-[#3C4043]">
        <CalendarHeader calendarRef={calendarRef} />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-4">
            <WeeklyCalendar ref={calendarRef} notes={notes} isLoading={isLoading} />
          </div>
        </main>
        
        {/* Modals */}
        {selectedNoteId !== null && <NoteModal />}
        <ImageModal />
        {showExportModal && <ExportModal calendarRef={calendarRef} />}
        {showShareModal && <ShareModal calendarRef={calendarRef} />}
      </div>
    </DragDropContext>
  );
};

export default CalendarPage;
