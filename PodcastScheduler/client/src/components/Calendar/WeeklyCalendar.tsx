import React, { forwardRef } from "react";
import DayColumn from "./DayColumn";
import { Note, DAYS, DAY_CONFIG } from "@shared/schema";
import { useCalendar } from "@/context/CalendarContext";
import { groupNotesByDay } from "@/lib/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { getMonthName } from "@/lib/calendar";

interface WeeklyCalendarProps {
  notes: Note[];
  isLoading: boolean;
  readOnly?: boolean;
}

const WeeklyCalendar = forwardRef<HTMLDivElement, WeeklyCalendarProps>(
  ({ notes, isLoading, readOnly = false }, ref) => {
    const { showSaturday, showSunday, weekInfo } = useCalendar();
    
    // Group notes by day
    const notesByDay = groupNotesByDay(notes);
    
    // Calculate total number of visible days
    const totalVisibleDays = 5 + (showSaturday ? 1 : 0) + (showSunday ? 1 : 0);
    
    // Filter days based on showSaturday and showSunday state
    const visibleDays = DAYS.filter(day => 
      (day !== 'saturday' && day !== 'sunday') || 
      (day === 'saturday' && showSaturday) || 
      (day === 'sunday' && showSunday)
    );

    if (isLoading) {
      return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-${totalVisibleDays} gap-4`}>
          {visibleDays.map((day) => (
            <div key={day} className="bg-white rounded-lg shadow border border-[#E8EAED] overflow-hidden">
              <Skeleton className="h-16 w-full" />
              <div className="p-3 space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Calculate responsive grid columns based on visible days
    let gridColsClass;
    if (totalVisibleDays <= 5) {
      gridColsClass = `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${totalVisibleDays}`;
    } else {
      gridColsClass = `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-${totalVisibleDays} 2xl:grid-cols-${totalVisibleDays}`;
    }

    return (
      <div 
        ref={ref}
        className={`grid ${gridColsClass} gap-4`}
      >
        {visibleDays.map((day) => {
          const dayInfo = weekInfo.days.find(d => d.day === day);
          const formattedDate = dayInfo ? 
            `${dayInfo.date.getDate()} de ${getMonthName(dayInfo.date.getMonth())}` : '';
          
          const hasNotes = notesByDay[day]?.length > 0;
          
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
              notes={notesByDay[day]}
              color={DAY_CONFIG[day].color}
              className={heightClass}
              readOnly={readOnly}
            />
          );
        })}
      </div>
    );
  }
);

WeeklyCalendar.displayName = "WeeklyCalendar";

export default WeeklyCalendar;
