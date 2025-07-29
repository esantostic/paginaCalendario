import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, ChevronLeft, ChevronRight } from "lucide-react";
import { Note, DAYS, DAY_CONFIG } from "@shared/schema";
import { getWeekInfo, getMonthName, groupNotesByDay } from "@/lib/calendar";
import DayColumn from "@/components/Calendar/DayColumn";

const CalendarViewPage: React.FC = () => {
  const [_, setLocation] = useLocation();
  const calendarRef = useRef<HTMLDivElement>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const weekInfo = getWeekInfo(weekOffset);
  
  // Obtener el ID de la URL compartida
  const searchParams = new URLSearchParams(window.location.search);
  const shareId = searchParams.get('id');
  
  // En una implementación real, aquí obtendríamos los datos del calendario compartido
  // usando el ID compartido. Para esta demo, simplemente usamos los datos locales.
  
  // Fetch notes for the current week
  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ['/api/notes', weekOffset],
    queryFn: async () => {
      const res = await fetch(`/api/notes?weekOffset=${weekOffset}`);
      if (!res.ok) throw new Error('Error fetching notes');
      return res.json();
    }
  });

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    setLocation('/');
  };

  if (!shareId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Enlace inválido</h1>
          <p className="mb-6">El enlace para ver este calendario no es válido o ha expirado.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la página principal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-[#3C4043]">
      <header className="bg-white border-b border-[#E8EAED] shadow-sm print:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl md:text-2xl font-medium">Calendario Semanal Escolar</h1>
              <span className="ml-4 text-gray-600 font-medium">{weekInfo.displayText}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
              <Button variant="default" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex justify-center items-center space-x-4 py-3 bg-white border-b border-[#E8EAED] print:hidden">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setWeekOffset(weekOffset - 1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Semana anterior
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setWeekOffset(0)}
          disabled={weekOffset === 0}
        >
          Semana actual
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setWeekOffset(weekOffset + 1)}
        >
          Semana siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-4">
          <div ref={calendarRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <div className="animate-pulse flex space-x-4">
                  <div className="bg-gray-200 h-10 w-96 rounded"></div>
                </div>
              </div>
            ) : (
              DAYS.map(day => {
                const dayInfo = weekInfo.days.find(d => d.day === day);
                const formattedDate = dayInfo ? 
                  `${dayInfo.date.getDate()} de ${getMonthName(dayInfo.date.getMonth())}` : '';
                
                const notesByDay = groupNotesByDay(notes);
                const hasNotes = notesByDay[day]?.length > 0;
                
                // No mostrar sábado y domingo a menos que haya notas
                if ((day === 'saturday' || day === 'sunday') && !hasNotes) {
                  return null;
                }
                
                // Apply different height based on whether there are notes or not (for mobile)
                const heightClass = hasNotes 
                  ? "min-h-[200px]" 
                  : "min-h-[120px] sm:min-h-[200px]";
                
                return (
                  <DayColumn
                    key={day}
                    day={day}
                    name={DAY_CONFIG[day].name}
                    date={formattedDate}
                    notes={notesByDay[day] || []}
                    color={DAY_CONFIG[day].color}
                    className={heightClass}
                    readOnly={true}
                  />
                );
              })
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-[#E8EAED] py-3 text-center text-sm text-gray-500 print:hidden">
        <p>Esta es una vista de solo lectura del calendario escolar.</p>
        <p className="text-xs mt-1">Para realizar cambios, inicie sesión en la aplicación.</p>
      </footer>
    </div>
  );
};

export default CalendarViewPage;