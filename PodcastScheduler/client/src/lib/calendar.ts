import { WeekInfo } from "./types";
import { Day, DAYS, Note } from "@shared/schema";

// Returns months in Spanish
export function getMonthName(monthIndex: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[monthIndex];
}

// Calculates week information based on offset
export function getWeekInfo(weekOffset: number): WeekInfo {
  // Base date (current date, adjust to Monday of the current week)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate Monday of the current week
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const baseDate = new Date(now);
  baseDate.setDate(now.getDate() + mondayOffset);
  
  // Apply week offset
  const startDate = new Date(baseDate);
  startDate.setDate(baseDate.getDate() + (weekOffset * 7));
  
  // Calculate Friday (end of regular week)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 4);
  
  // Calculate Saturday
  const saturdayDate = new Date(startDate);
  saturdayDate.setDate(startDate.getDate() + 5);
  
  // Calculate Sunday
  const sundayDate = new Date(startDate);
  sundayDate.setDate(startDate.getDate() + 6);
  
  // Format display text
  const startMonth = getMonthName(startDate.getMonth());
  const endMonth = getMonthName(endDate.getMonth());
  
  let displayText = '';
  if (startMonth === endMonth) {
    displayText = `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
  } else {
    displayText = `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${startDate.getFullYear()}`;
  }
  
  // Generate days information
  const days = DAYS.map((day, index) => {
    let date;
    if (day === 'saturday') {
      date = new Date(saturdayDate);
    } else if (day === 'sunday') {
      date = new Date(sundayDate);
    } else {
      date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
    }
    
    return {
      name: day,
      date,
      day: day as Day
    };
  });
  
  return {
    startDate,
    endDate,
    weekOffset,
    displayText,
    days
  };
}

// Check if there are notes for Saturday
export function checkSaturdayEvents(notes: Note[]): boolean {
  return notes.some(note => note.day === 'saturday');
}

// Check if there are notes for Sunday
export function checkSundayEvents(notes: Note[]): boolean {
  return notes.some(note => note.day === 'sunday');
}

// Organize notes by day
export function groupNotesByDay(notes: Note[]) {
  const dayNotes: Record<Day, Note[]> = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  };
  
  notes.forEach(note => {
    if (dayNotes[note.day as Day]) {
      dayNotes[note.day as Day].push(note);
    }
  });
  
  // Sort notes by position
  Object.values(dayNotes).forEach(notes => {
    notes.sort((a, b) => a.position - b.position);
  });
  
  return dayNotes;
}
