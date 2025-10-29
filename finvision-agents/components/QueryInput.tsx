import React, { useRef, useState, useCallback } from 'react';
import { SendIcon, LoaderIcon, PaperclipIcon, CloseIcon, DocumentIcon } from './icons';

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export const QueryInput: React.FC<QueryInputProps> = ({ query, setQuery, file, setFile, isLoading, onSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (query.trim() || file)) {
        onSubmit();
      }
    }
  };

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile) {
        // Simple validation for text-based files
        if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
            alert("File size exceeds 5MB.");
            return;
        }
        setFile(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files ? e.target.files[0] : null);
  };
  
  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isOver: boolean) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(isOver);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      handleDragEvents(e, false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileSelect(e.dataTransfer.files[0]);
      }
  };
  
  const hasContent = !!query.trim() || !!file;

  return (
    <div 
        className={`relative transition-all duration-300 ${isDraggingOver ? 'bg-primary/10' : ''}`}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDrop={handleDrop}
    >
      <div className={`absolute inset-0 border-2 border-dashed border-primary rounded-lg transition-all duration-300 ${isDraggingOver ? 'opacity-100' : 'opacity-0'}`}>
         <div className="flex items-center justify-center h-full">
            <p className="text-primary font-semibold">Drop file to analyze</p>
         </div>
      </div>
      
      {file && (
          <div className="bg-surface-light border border-border rounded-lg p-2 flex items-center justify-between animate-fadeInUp text-sm mx-1 mb-2">
              <div className="flex items-center space-x-2 truncate">
                  <DocumentIcon className="h-5 w-5 text-subtle flex-shrink-0" />
                  <span className="text-gray-300 truncate">{file.name}</span>
              </div>
              <button onClick={() => setFile(null)} className="p-1 rounded-full hover:bg-surface transition-colors">
                  <CloseIcon className="h-4 w-4 text-subtle" />
              </button>
          </div>
      )}

      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={file ? "Ask a question about the uploaded document..." : "Ask a financial question, or upload a document..."}
          className="w-full bg-surface border border-border rounded-lg p-4 pr-24 resize-none focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-300 shadow-sm focus:shadow-md"
          rows={1}
          disabled={isLoading}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".txt,.md,.csv,application/pdf,text/plain"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="p-2 rounded-lg hover:bg-surface-light transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
                aria-label="Upload document"
            >
                <PaperclipIcon className="h-5 w-5 text-subtle hover:text-primary transition-colors"/>
            </button>
            <button
              onClick={onSubmit}
              disabled={isLoading || !hasContent}
              className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary hover:from-primary-hover hover:to-primary disabled:from-subtle disabled:to-subtle/70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
              aria-label="Submit query"
            >
              {isLoading ? (
                <LoaderIcon className="h-5 w-5 text-white" />
              ) : (
                <SendIcon className="h-5 w-5 text-white" />
              )}
            </button>
        </div>
      </div>
    </div>
  );
};