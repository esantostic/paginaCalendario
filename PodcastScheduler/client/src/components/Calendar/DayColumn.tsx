import React from "react";
import { Day, Note, CATEGORY_CONFIG, NOTE_COLOR_CONFIG } from "@shared/schema";
import NoteComponent from "@/components/Notes/Note";
import { Droppable } from "react-beautiful-dnd";
import { cn } from "@/lib/utils";

interface DayColumnProps {
  day: Day;
  name: string;
  date: string;
  notes: Note[];
  color: string;
  className?: string;
  readOnly?: boolean;
}

const DayColumn: React.FC<DayColumnProps> = ({ day, name, date, notes, color, className, readOnly = false }) => {
  const isEmpty = notes.length === 0;
  
  return (
    <div 
      className={cn(
        "day-column bg-white rounded-lg shadow border border-[#E8EAED] overflow-hidden",
        className
      )}
      data-day={day}
      data-empty={isEmpty}
    >
      <div className={`${color} text-white p-3 sticky top-0 z-10`}>
        <h2 className="font-medium text-center">{name}</h2>
        <p className="text-sm text-center">{date}</p>
      </div>
      
{readOnly ? (
        // Versión de solo lectura (sin drag and drop)
        <div 
          className={cn(
            "p-3 space-y-3", 
            isEmpty ? "min-h-[80px] sm:min-h-[150px]" : 
              notes.length === 1 ? "min-h-[150px] sm:min-h-[200px]" :
              notes.length === 2 ? "min-h-[220px] sm:min-h-[270px]" : 
              "min-h-[300px] sm:min-h-[400px]"
          )}
        >
          {isEmpty && (
            <div className="text-center text-gray-400 text-sm py-2 italic">
              Sin actividades
            </div>
          )}
          
          {notes.map((note, index) => (
            <div
              key={note.id}
              className={cn(
                "note border-l-4 rounded shadow-sm p-3 mb-3",
                note.color ? NOTE_COLOR_CONFIG[note.color as keyof typeof NOTE_COLOR_CONFIG].bgColor : "bg-white",
                note.color ? NOTE_COLOR_CONFIG[note.color as keyof typeof NOTE_COLOR_CONFIG].borderColor : "border-gray-200"
              )}
            >
              <div className="flex justify-between mb-2">
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
                  {CATEGORY_CONFIG[note.category as keyof typeof CATEGORY_CONFIG].name}
                </span>
              </div>
              
              <h3 className="font-medium">{note.title}</h3>
              <p className="text-sm mt-1">{note.content}</p>
              
              {note.image && (
                <div className="mt-2">
                  <img
                    src={note.image}
                    alt={note.title}
                    className="w-full h-auto rounded image-preview"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Versión editable (con drag and drop)
        <Droppable droppableId={day}>
          {(provided, snapshot) => (
            <div 
              className={cn(
                "p-3 space-y-3", 
                isEmpty ? "min-h-[80px] sm:min-h-[150px]" : 
                  notes.length === 1 ? "min-h-[150px] sm:min-h-[200px]" :
                  notes.length === 2 ? "min-h-[220px] sm:min-h-[270px]" : 
                  "min-h-[300px] sm:min-h-[400px]",
                snapshot.isDraggingOver ? "bg-[#F1F3F4]" : ""
              )}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {isEmpty && (
                <div className="text-center text-gray-400 text-sm py-2 italic">
                  Sin actividades
                </div>
              )}
              
              {notes.map((note, index) => (
                <NoteComponent
                  key={note.id}
                  note={note}
                  index={index}
                  readOnly={readOnly}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

export default DayColumn;
