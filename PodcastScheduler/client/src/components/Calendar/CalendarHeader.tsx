import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock, Download, Plus, ArrowLeft, ArrowRight, Share2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCalendar } from "@/context/CalendarContext";

interface CalendarHeaderProps {
  calendarRef: React.RefObject<HTMLDivElement>;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ calendarRef }) => {
  const { 
    weekOffset, 
    setWeekOffset, 
    weekInfo, 
    showSaturday,
    setShowSaturday,
    hasSaturdayEvents,
    showSunday, 
    setShowSunday, 
    hasSundayEvents,
    setSelectedNoteId,
    setShowExportModal,
    setShowShareModal
  } = useCalendar();

  const handlePrevWeek = () => {
    setWeekOffset(weekOffset - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  const handleAddNote = () => {
    setSelectedNoteId(0); // 0 means new note
  };

  const handleExport = () => {
    setShowExportModal(true);
  };
  
  const handleShare = () => {
    setShowShareModal(true);
  };

  return (
    <header className="bg-white border-b border-[#E8EAED] shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <CalendarClock className="text-[#4285F4] h-7 w-7 mr-2" />
            <h1 className="text-xl md:text-2xl font-medium">Calendario Semanal Escolar</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Week Navigation */}
            <div className="flex items-center mr-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePrevWeek}
                title="Semana anterior"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <span className="mx-2 font-medium">{weekInfo.displayText}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleNextWeek}
                title="Semana siguiente"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Weekend Toggles */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Label htmlFor="saturday-toggle" className="mr-2 text-sm">Sábado</Label>
                  <Switch 
                    id="saturday-toggle" 
                    checked={showSaturday} 
                    onCheckedChange={setShowSaturday}
                    className={hasSaturdayEvents ? "bg-amber-500" : ""}
                  />
                </div>
                
                <div className="flex items-center">
                  <Label htmlFor="sunday-toggle" className="mr-2 text-sm">Domingo</Label>
                  <Switch 
                    id="sunday-toggle" 
                    checked={showSunday} 
                    onCheckedChange={setShowSunday}
                    className={hasSundayEvents ? "bg-amber-500" : ""}
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Add Note Button */}
                <Button 
                  className="bg-[#4285F4] hover:bg-blue-600 text-white" 
                  onClick={handleAddNote}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Agregar</span>
                </Button>
                
                {/* Export Button */}
                <Button 
                  variant="outline" 
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Exportar</span>
                </Button>
                
                {/* Share Button */}
                <Button 
                  variant="outline" 
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Compartir</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;
