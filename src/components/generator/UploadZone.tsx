"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, X, Upload } from "lucide-react";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

interface UploadZoneProps {
  file: File | null;
  previewUrl: string | null;
  onSelect: (file: File) => void;
  onClear: () => void;
}

export function UploadZone({ file, previewUrl, onSelect, onClear }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    const picked = files?.[0];
    if (picked && ACCEPTED_TYPES.includes(picked.type)) {
      onSelect(picked);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => handleFiles(e.target.files)}
        className="sr-only"
        aria-label="Upload photo"
      />

      <AnimatePresence mode="wait">
        {previewUrl && file ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="h-20 w-20 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              type="button"
              onClick={onClear}
              aria-label="Remove photo"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-strong text-muted transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="empty"
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.005 }}
            className={`group relative flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors duration-300 ${
              isDragging
                ? "border-accent-from/60 bg-accent-from/[0.04]"
                : "border-border-strong bg-card hover:border-foreground/25"
            }`}
          >
            <div
              aria-hidden
              className={`absolute inset-0 bg-shimmer transition-opacity duration-500 ${
                isDragging ? "animate-shimmer opacity-100" : "opacity-0"
              }`}
            />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-foreground/[0.04] text-foreground/70 transition-transform duration-300 group-hover:scale-110">
              {isDragging ? <Upload className="h-5 w-5" /> : <ImagePlus className="h-5 w-5" />}
            </div>
            <div className="relative">
              <p className="text-sm font-medium text-foreground">
                {isDragging ? "Drop it here" : "Drag & drop a photo, or click to browse"}
              </p>
              <p className="mt-1 text-xs text-muted">PNG, JPEG, or WebP — up to 5MB</p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
