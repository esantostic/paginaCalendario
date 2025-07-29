import { Note, Day, Category, NoteColor } from "@shared/schema";

export interface DragItem {
  type: string;
  id: number;
  day: Day;
  index: number;
}

export interface NoteFormValues {
  id?: number;
  title: string;
  content: string;
  day: Day;
  category: Category;
  color?: NoteColor;
  image?: string;
  repeat: boolean;
  position?: number;
  weekOffset?: number;
}

export interface WeekInfo {
  startDate: Date;
  endDate: Date;
  weekOffset: number;
  displayText: string;
  days: Array<{
    name: string;
    date: Date;
    day: Day;
  }>;
}

export type DayNotes = Record<Day, Note[]>;
