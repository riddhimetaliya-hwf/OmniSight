import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CleaningStep, CleanDataset, CleanDataColumn } from './types';

export const useCleanData = (initialData: CleanDataset) => {
  const [dataset, setDataset] = useState<CleanDataset>(initialData);
  const [cleaningSteps, setCleaningSteps] = useState<CleaningStep[]>([]);
  const [pendingChanges, setPendingChanges] = useState<{
    before: Record<string, any>[];
    after: Record<string, any>[];
    columns: CleanDataColumn[];
    command: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Track undo/redo state
  const [undoneSteps, setUndoneSteps] = useState<CleaningStep[]>([]);

  const applyCleaningCommand = useCallback(async (command: string, selectedColumns: string[] = []) => {
    setIsProcessing(true);
    
    try {
      // In a real app, this would call an NLP-powered API to process the command
      // For demo purposes, we'll simulate the AI processing with mock logic
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get relevant columns (either selected or all if none selected)
      const targetColumnNames = selectedColumns.length > 0 
        ? selectedColumns 
        : dataset.columns.map(col => col.name);
        
      const targetColumns = dataset.columns.filter(col => 
        targetColumnNames.includes(col.name)
      );

      if (targetColumns.length === 0) {
        throw new Error("No valid columns selected");
      }

      // Create sample data for before/after comparison
      const sampleSize = 5;
      const sampleRows: Record<string, any>[] = [];
      
      // Select sample rows (first few rows of the dataset)
      for (let i = 0; i < Math.min(sampleSize, dataset.columns[0].data.length); i++) {
        const row: Record<string, any> = {};
        dataset.columns.forEach(col => {
          row[col.name] = col.data[i];
        });
        sampleRows.push(row);
      }

      // Process command and generate simulated changes
      const processedRows = simulateDataCleaning(command, sampleRows, targetColumnNames);
      
      // Set pending changes for preview
      setPendingChanges({
        before: sampleRows,
        after: processedRows,
        columns: targetColumns,
        command
      });
      
    } catch (error) {
      console.error('Error processing cleaning command:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [dataset]);

  const applyPendingChanges = useCallback(() => {
    if (!pendingChanges) return;

    // In a real app, this would apply the changes to the full dataset
    // For this demo, we'll simulate applying changes to all rows

    // Apply the transformation logic to all rows
    const { command } = pendingChanges;
    const affectedColumnNames = pendingChanges.columns.map(col => col.name);
    
    // Extract data into row format for easier processing
    const allRows: Record<string, any>[] = [];
    const rowCount = dataset.columns[0].data.length;
    
    for (let i = 0; i < rowCount; i++) {
      const row: Record<string, any> = {};
      dataset.columns.forEach(col => {
        row[col.name] = col.data[i];
      });
      allRows.push(row);
    }
    
    // Apply transformation
    const transformedRows = simulateDataCleaning(command, allRows, affectedColumnNames);
    
    // Convert back to column format
    const updatedColumns = dataset.columns.map(col => {
      if (!affectedColumnNames.includes(col.name)) {
        return col; // Skip columns that aren't affected
      }
      
      return {
        ...col,
        data: transformedRows.map(row => row[col.name])
      };
    });
    
    // Update dataset
    const updatedDataset = {
      ...dataset,
      columns: updatedColumns
    };
    
    // Create cleaning step
    const newStep: CleaningStep = {
      id: uuidv4(),
      command,
      timestamp: new Date(),
      changes: {
        before: pendingChanges.before,
        after: pendingChanges.after
      },
      applied: true
    };
    
    // Update state
    setDataset(updatedDataset);
    setCleaningSteps([newStep, ...cleaningSteps]);
    setPendingChanges(null);
    setUndoneSteps([]); // Clear undo history when a new change is applied
    
  }, [pendingChanges, dataset, cleaningSteps]);

  const clearPendingChanges = useCallback(() => {
    setPendingChanges(null);
  }, []);

  const undoLastStep = useCallback(() => {
    if (cleaningSteps.length === 0) return;
    
    // For a real app, this would revert the dataset to its previous state
    // For simplicity in this demo, we'll just move the step to the undone steps list
    const lastStep = cleaningSteps[0];
    const updatedSteps = cleaningSteps.slice(1);
    
    setCleaningSteps(updatedSteps);
    setUndoneSteps([lastStep, ...undoneSteps]);
  }, [cleaningSteps, undoneSteps]);

  const redoLastStep = useCallback(() => {
    if (undoneSteps.length === 0) return;
    
    // For a real app, this would reapply the undone step
    // For simplicity in this demo, we'll just move the step back to the cleaning steps list
    const stepToRedo = undoneSteps[0];
    const updatedUndoneSteps = undoneSteps.slice(1);
    
    setCleaningSteps([stepToRedo, ...cleaningSteps]);
    setUndoneSteps(updatedUndoneSteps);
  }, [cleaningSteps, undoneSteps]);

  const exportCleanedData = useCallback(() => {
    // In a real app, this would export the cleaned data in the desired format
    // For this demo, we'll just log the data to the console
    console.log('Exporting cleaned dataset:', dataset);
    
    // Prepare CSV data
    const headers = dataset.columns.map(col => col.name).join(',');
    const rows = [];
    
    for (let i = 0; i < dataset.columns[0].data.length; i++) {
      const row = dataset.columns.map(col => {
        const value = col.data[i];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',');
      rows.push(row);
    }
    
    const csv = [headers, ...rows].join('\n');
    
    // Create a downloadable file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `${dataset.name}_cleaned.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  }, [dataset]);

  return {
    dataset,
    cleaningSteps,
    pendingChanges,
    isProcessing,
    applyCleaningCommand,
    applyPendingChanges,
    clearPendingChanges,
    undoLastStep,
    redoLastStep,
    exportCleanedData
  };
};

// Helper function to simulate data cleaning based on natural language commands
const simulateDataCleaning = (
  command: string, 
  rows: Record<string, any>[],
  targetColumns: string[]
): Record<string, any>[] => {
  const lowerCommand = command.toLowerCase();
  
  // Return a copy of the rows to avoid mutating the original data
  const processedRows = JSON.parse(JSON.stringify(rows));
  
  if (lowerCommand.includes('remove') && lowerCommand.includes('null')) {
    // Simulate "Remove all null rows"
    return processedRows.filter(row => {
      // Check if any of the target columns has a null value
      return !targetColumns.some(col => 
        row[col] === null || row[col] === undefined || row[col] === ''
      );
    });
  } 
  else if (lowerCommand.includes('format') && lowerCommand.includes('date')) {
    // Simulate "Format all dates to MM/DD/YYYY"
    return processedRows.map(row => {
      targetColumns.forEach(col => {
        if (row[col] && (typeof row[col] === 'string' || row[col] instanceof Date)) {
          try {
            const date = row[col] instanceof Date ? row[col] : new Date(row[col]);
            if (!isNaN(date.getTime())) {
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const day = date.getDate().toString().padStart(2, '0');
              const year = date.getFullYear();
              row[col] = `${month}/${day}/${year}`;
            }
          } catch (e) {
            // If conversion fails, leave the value unchanged
          }
        }
      });
      return row;
    });
  }
  else if (lowerCommand.includes('convert') && 
           (lowerCommand.includes('eur') || lowerCommand.includes('euro')) && 
           (lowerCommand.includes('usd') || lowerCommand.includes('dollar'))) {
    // Simulate "Convert EUR to USD"
    const exchangeRate = 1.1; // Example exchange rate
    return processedRows.map(row => {
      targetColumns.forEach(col => {
        if (typeof row[col] === 'number' || !isNaN(parseFloat(row[col]))) {
          const value = typeof row[col] === 'number' ? row[col] : parseFloat(row[col]);
          row[col] = (value * exchangeRate).toFixed(2);
        }
      });
      return row;
    });
  }
  else if (lowerCommand.includes('title case') || 
           (lowerCommand.includes('standardize') && lowerCommand.includes('name'))) {
    // Simulate "Standardize names to Title Case"
    return processedRows.map(row => {
      targetColumns.forEach(col => {
        if (typeof row[col] === 'string') {
          row[col] = row[col]
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        }
      });
      return row;
    });
  }
  else if (lowerCommand.includes('replace') && 
           (lowerCommand.includes('missing') || lowerCommand.includes('empty'))) {
    // Simulate "Replace missing values with 0"
    const replacement = lowerCommand.includes('with 0') ? 0 : 
                       lowerCommand.includes('with ""') ? "" : 
                       "N/A";
    
    return processedRows.map(row => {
      targetColumns.forEach(col => {
        if (row[col] === null || row[col] === undefined || row[col] === '') {
          row[col] = replacement;
        }
      });
      return row;
    });
  }
  else if (lowerCommand.includes('remove duplicates')) {
    // Simulate "Remove duplicates"
    const seen = new Set();
    return processedRows.filter(row => {
      // Create a key from the target columns
      const key = targetColumns.map(col => row[col]).join('|');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  else if (lowerCommand.includes('round') && lowerCommand.includes('decimal')) {
    // Simulate "Round numbers to 2 decimal places"
    const decimalPlaces = lowerCommand.includes('2 decimal') ? 2 : 
                         lowerCommand.includes('3 decimal') ? 3 : 0;
    
    return processedRows.map(row => {
      targetColumns.forEach(col => {
        if (typeof row[col] === 'number' || !isNaN(parseFloat(row[col]))) {
          const value = typeof row[col] === 'number' ? row[col] : parseFloat(row[col]);
          row[col] = value.toFixed(decimalPlaces);
        }
      });
      return row;
    });
  }
  
  // Default: Return random modifications if the command isn't recognized
  return processedRows.map(row => {
    targetColumns.forEach(col => {
      // Apply a random modification for demo purposes
      if (typeof row[col] === 'string') {
        if (Math.random() > 0.5) {
          row[col] = row[col].toUpperCase();
        }
      } else if (typeof row[col] === 'number') {
        row[col] = (row[col] * 1.1).toFixed(2);
      }
    });
    return row;
  });
};
