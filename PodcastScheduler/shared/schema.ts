import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  day: text("day").notNull(), // monday, tuesday, etc.
  category: text("category").notNull(), // task, presentation, celebration, birthday
  image: text("image"), // Base64 encoded image
  weekOffset: integer("week_offset").notNull().default(0),
  repeat: boolean("repeat").notNull().default(false),
  userId: integer("user_id").references(() => users.id),
  position: integer("position").notNull().default(0),
  color: text("color").default("default"), // Color personalizado para la nota
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

// Constants for days and categories
export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
export const CATEGORIES = ['task', 'presentation', 'celebration', 'birthday'] as const;
// Colores personalizables para notas
export const NOTE_COLORS = ['default', 'red', 'green', 'blue', 'yellow', 'purple', 'pink', 'orange'] as const;

export type Day = typeof DAYS[number];
export type Category = typeof CATEGORIES[number];
export type NoteColor = typeof NOTE_COLORS[number];

// Category display configuration
export const CATEGORY_CONFIG = {
  task: { name: 'Tarea', color: 'bg-red-600', borderColor: 'border-red-600' },
  presentation: { name: 'Exposición', color: 'bg-blue-600', borderColor: 'border-blue-600' },
  celebration: { name: 'Celebración', color: 'bg-purple-600', borderColor: 'border-purple-600' },
  birthday: { name: 'Cumpleaños', color: 'bg-amber-500', borderColor: 'border-amber-500' },
};

// Color configuration for notes
export const NOTE_COLOR_CONFIG = {
  default: { bgColor: 'bg-white', borderColor: 'border-gray-200', textColor: 'text-gray-800' },
  red: { bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-800' },
  green: { bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-800' },
  blue: { bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-800' },
  yellow: { bgColor: 'bg-amber-50', borderColor: 'border-amber-200', textColor: 'text-amber-800' },
  purple: { bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-800' },
  pink: { bgColor: 'bg-pink-50', borderColor: 'border-pink-200', textColor: 'text-pink-800' },
  orange: { bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-800' },
};

// Day display configuration
export const DAY_CONFIG = {
  monday: { name: 'Lunes', color: 'bg-[#4285F4]' },
  tuesday: { name: 'Martes', color: 'bg-[#4285F4]' },
  wednesday: { name: 'Miércoles', color: 'bg-[#4285F4]' },
  thursday: { name: 'Jueves', color: 'bg-[#4285F4]' },
  friday: { name: 'Viernes', color: 'bg-[#4285F4]' },
  saturday: { name: 'Sábado', color: 'bg-[#FBBC05]' },
  sunday: { name: 'Domingo', color: 'bg-[#FBBC05]' },
};
