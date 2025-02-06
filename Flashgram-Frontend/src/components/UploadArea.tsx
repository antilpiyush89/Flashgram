import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useUpload } from '@/hooks/useUpload';
import RotatingCardsLoader from './loader';

interface UploadAreaProps {
  onUploadComplete: () => void;
}

export const UploadArea = ({ onUploadComplete }: UploadAreaProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      const formData = new FormData();
      formData.append('pdf', file);
      try {
        setIsUploading(true);
        await useUpload(formData);
        onUploadComplete();
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      try {
        const formData = new FormData();
        formData.append('pdf', file);
        await useUpload(formData);
        onUploadComplete();
      } catch (error) {
        console.error('Upload failed:', error);
        // Handle error (show toast notification, etc.)
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#1a1b1e] p-4">
      {isUploading ? (
        <RotatingCardsLoader />
      ) : (
        <div
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-colors duration-200 max-w-md w-full
            ${dragActive 
              ? 'border-[#40e6b4] bg-[#40e6b4]/10' 
              : 'border-gray-700 hover:border-gray-600'
            }
          `}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-[#40e6b4] mx-auto mb-4" />
          <p className="text-white font-sf-pro mb-2">
            DROP YOUR PDF HERE
          </p>
          <p className="text-gray-400 text-sm font-sf-pro">
            OR CLICK TO BROWSE
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}; 