
import { Widget } from "../../types";

export const getWidgetSizeClass = (widget: Widget): string => {
  // Add responsive classes to prevent widgets from being cut off
  let colSpan = '';
  let rowSpan = widget.rowSpan > 1 ? `row-span-${widget.rowSpan}` : '';
  
  // Make sure widgets don't exceed the grid on smaller screens
  if (widget.columnSpan === 3) {
    colSpan = 'col-span-1 md:col-span-2 lg:col-span-3';
  } else if (widget.columnSpan === 2) {
    colSpan = 'col-span-1 md:col-span-2';
  } else {
    colSpan = 'col-span-1';
  }
  
  return `${colSpan} ${rowSpan}`;
};
