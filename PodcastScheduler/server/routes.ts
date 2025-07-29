import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertNoteSchema, DAYS, CATEGORIES } from "@shared/schema";
import multer from "multer";

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Notes API Routes
  // Get all notes for a specific week
  app.get("/api/notes", async (req, res) => {
    try {
      const weekOffset = parseInt(req.query.weekOffset as string) || 0;
      const notes = await storage.getNotes(weekOffset);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving notes" });
    }
  });

  // Get note by ID
  app.get("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const note = await storage.getNoteById(id);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving note" });
    }
  });

  // Create new note
  app.post("/api/notes", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertNoteSchema.parse(req.body);
      
      // Create the note
      const newNote = await storage.createNote(validatedData);
      res.status(201).json(newNote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      
      res.status(500).json({ message: "Error creating note" });
    }
  });

  // Handle image upload with note
  app.post("/api/notes/with-image", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image provided" });
      }

      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      
      const noteData = JSON.parse(req.body.noteData);
      
      // Validate note data
      const validatedData = insertNoteSchema.parse({
        ...noteData,
        image: base64Image
      });
      
      // Create the note with image
      const newNote = await storage.createNote(validatedData);
      res.status(201).json(newNote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      
      res.status(500).json({ message: "Error creating note with image" });
    }
  });

  // Update note
  app.patch("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if note exists
      const existingNote = await storage.getNoteById(id);
      if (!existingNote) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      // Validate update data
      const validUpdateSchema = insertNoteSchema.partial();
      const validatedData = validUpdateSchema.parse(req.body);
      
      // Update the note
      const updatedNote = await storage.updateNote(id, validatedData);
      res.json(updatedNote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      
      res.status(500).json({ message: "Error updating note" });
    }
  });

  // Delete note
  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if note exists
      const existingNote = await storage.getNoteById(id);
      if (!existingNote) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      // Delete the note
      const success = await storage.deleteNote(id);
      
      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete note" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting note" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
