import React, { createContext, useContext, useState } from "react";
import { Note, Day } from "@shared/schema";
import { WeekInfo } from "@/lib/types";
import { getWeekInfo } from "@/lib/calendar";

interface CalendarContextType {
  weekOffset: number;
  setWeekOffset: (offset: number) => void;
  showSaturday: boolean;
  setShowSaturday: (show: boolean) => void;
  showSunday: boolean;
  setShowSunday: (show: boolean) => void;
  weekInfo: WeekInfo;
  hasSaturdayEvents: boolean;
  setHasSaturdayEvents: (hasEvents: boolean) => void;
  hasSundayEvents: boolean;
  setHasSundayEvents: (hasEvents: boolean) => void;
  selectedNoteId: number | null;
  setSelectedNoteId: (id: number | null) => void;
  selectedImageUrl: string | null;
  setSelectedImageUrl: (url: string | null) => void;
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
  showShareModal: boolean;
  setShowShareModal: (show: boolean) => void;
  shareLink: string | null;
  setShareLink: (link: string | null) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [showSaturday, setShowSaturday] = useState(false);
  const [showSunday, setShowSunday] = useState(false);
  const [hasSaturdayEvents, setHasSaturdayEvents] = useState(false);
  const [hasSundayEvents, setHasSundayEvents] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const weekInfo = getWeekInfo(weekOffset);

  return (
    <CalendarContext.Provider
      value={{
        weekOffset,
        setWeekOffset,
        showSaturday,
        setShowSaturday,
        showSunday,
        setShowSunday,
        weekInfo,
        hasSaturdayEvents,
        setHasSaturdayEvents,
        hasSundayEvents,
        setHasSundayEvents,
        selectedNoteId,
        setSelectedNoteId,
        selectedImageUrl,
        setSelectedImageUrl,
        showExportModal,
        setShowExportModal,
        showShareModal,
        setShowShareModal,
        shareLink,
        setShareLink
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
