import React, { useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

export interface MedicalUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string;
}

export default function MedicalUpload({
  file,
  onFileSelect,
  error,
}: MedicalUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    onFileSelect(selected);
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        Upload Medical Reports / Prescription
      </label>

      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-sky-50/50 transition-colors ${
            error ? "border-red-400 bg-red-50/20" : "border-gray-200"
          }`}
        >
          <Upload className="w-8 h-8 text-sky-500 mb-2" />
          <p className="text-sm font-medium text-gray-700">
            Click to upload medical documents
          </p>
          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 border border-sky-200 bg-sky-50/50 rounded-xl">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-sky-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="p-1 hover:bg-sky-100 rounded-full text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
