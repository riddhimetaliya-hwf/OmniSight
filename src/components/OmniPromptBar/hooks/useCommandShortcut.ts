
import { useEffect } from 'react';
import { CommandShortcutOptions } from '../types';

export function useCommandShortcut(
  callback: () => void,
  options: CommandShortcutOptions
) {
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      const { key, ctrlKey, altKey, shiftKey, metaKey } = event;
      
      const matchesKey = key.toLowerCase() === options.key.toLowerCase();
      const matchesCtrl = options.ctrlKey !== undefined ? ctrlKey === options.ctrlKey : true;
      const matchesAlt = options.altKey !== undefined ? altKey === options.altKey : true;
      const matchesShift = options.shiftKey !== undefined ? shiftKey === options.shiftKey : true;
      const matchesMeta = options.metaKey !== undefined ? metaKey === options.metaKey : true;
      
      if (matchesKey && matchesCtrl && matchesAlt && matchesShift && matchesMeta) {
        event.preventDefault();
        callback();
      }
    };
    
    window.addEventListener('keydown', keyDownHandler);
    
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [callback, options]);
}
