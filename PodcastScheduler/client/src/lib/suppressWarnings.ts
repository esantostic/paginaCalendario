// Suprimir warnings específicos de react-beautiful-dnd
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;
  
  // Función para verificar si es el warning de react-beautiful-dnd
  const isReactBeautifulDndWarning = (args: any[]) => {
    if (args.length === 0) return false;
    
    const message = String(args[0] || '');
    const secondArg = String(args[1] || '');
    
    return message.includes('Support for defaultProps will be removed from memo components') ||
           message.includes('%s: Support for defaultProps will be removed') ||
           secondArg.includes('Connect(Droppable)');
  };
  
  console.warn = function(...args: any[]) {
    if (isReactBeautifulDndWarning(args)) {
      return; // Suprimir este warning
    }
    originalWarn.apply(console, args);
  };
  
  console.error = function(...args: any[]) {
    if (isReactBeautifulDndWarning(args)) {
      return; // Suprimir este warning
    }
    originalError.apply(console, args);
  };
}