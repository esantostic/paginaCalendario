import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Note, DAYS, CATEGORIES, CATEGORY_CONFIG, DAY_CONFIG, NOTE_COLORS, NOTE_COLOR_CONFIG } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { NoteFormValues } from "@/lib/types";
import { ImagePlus, X, Palette } from "lucide-react";
import { useCalendar } from "@/context/CalendarContext";

interface NoteFormProps {
  defaultValues?: Note;
  onSubmit: (data: NoteFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const noteFormSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  content: z.string().min(1, "El contenido es requerido"),
  day: z.enum(DAYS as [string, ...string[]]),
  category: z.enum(CATEGORIES as [string, ...string[]]),
  color: z.enum(NOTE_COLORS as [string, ...string[]]).default("default"),
  image: z.string().optional(),
  repeat: z.boolean().default(false),
  position: z.number().optional(),
  weekOffset: z.number().optional(),
});

const NoteForm: React.FC<NoteFormProps> = ({ 
  defaultValues, 
  onSubmit, 
  onCancel,
  isSubmitting 
}) => {
  const { weekOffset } = useCalendar();
  const [previewImage, setPreviewImage] = React.useState<string | null>(defaultValues?.image || null);
  
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: defaultValues || {
      title: "",
      content: "",
      day: "monday",
      category: "task",
      color: "default",
      repeat: false,
      weekOffset: weekOffset,
      position: 0
    }
  });
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewImage(base64String);
      form.setValue("image", base64String);
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = () => {
    setPreviewImage(null);
    form.setValue("image", undefined);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Día</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un día" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      {DAY_CONFIG[day].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {CATEGORY_CONFIG[category].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem key="default" value="default">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-white border border-gray-200"></div>
                        <span>Predeterminado</span>
                      </div>
                    </SelectItem>
                    <SelectItem key="red" value="red">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-red-50 border border-red-200"></div>
                        <span>Rojo</span>
                      </div>
                    </SelectItem>
                    <SelectItem key="green" value="green">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-green-50 border border-green-200"></div>
                        <span>Verde</span>
                      </div>
                    </SelectItem>
                    <SelectItem key="blue" value="blue">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-blue-50 border border-blue-200"></div>
                        <span>Azul</span>
                      </div>
                    </SelectItem>
                    <SelectItem key="yellow" value="yellow">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-amber-50 border border-amber-200"></div>
                        <span>Amarillo</span>
                      </div>
                    </SelectItem>
                    <SelectItem key="purple" value="purple">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-purple-50 border border-purple-200"></div>
                        <span>Morado</span>
                      </div>
                    </SelectItem>
                    <SelectItem key="pink" value="pink">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-pink-50 border border-pink-200"></div>
                        <span>Rosa</span>
                      </div>
                    </SelectItem>
                    <SelectItem key="orange" value="orange">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-orange-50 border border-orange-200"></div>
                        <span>Naranja</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título de la nota" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detalles de la nota" 
                  rows={3} 
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>Imagen (opcional)</FormLabel>
          <div className="flex items-center">
            <label className="flex items-center justify-center px-4 py-2 bg-[#E8EAED] hover:bg-[#3C4043] hover:text-white rounded cursor-pointer w-full">
              <ImagePlus className="mr-2 h-4 w-4" />
              <span>Seleccionar imagen</span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload}
              />
            </label>
          </div>
          
          {previewImage && (
            <div className="mt-2">
              <div className="relative">
                <img 
                  src={previewImage} 
                  alt="Vista previa" 
                  className="max-h-48 rounded mx-auto"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <FormField
          control={form.control}
          name="repeat"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                Repetir cada semana
              </FormLabel>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NoteForm;
