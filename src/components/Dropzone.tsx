"use client";

import React, { useState } from "react";
import { extractTextFromFile } from "@/lib/parser";

type FileStatus = "uploaded" | "processing" | "done" | "error";

type UploadedFile = {
  file: File;
  status: FileStatus;
  text?: string;
  gptResult?: string;
  error?: string;
  matchInfo?: {
    extractedName: string;
    match: string | null;
    internalId: string | null;
    confidence: number;
  };
};

export default function Dropzone() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    const newFiles: UploadedFile[] = droppedFiles.map((file) => ({
      file,
      status: "uploaded",
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    for (const uploadedFile of newFiles) {
      updateFileStatus(uploadedFile.file.name, "processing");

      try {
        const text = await extractTextFromFile(uploadedFile.file);
        console.log("📄 Extracted content:", text.slice(0, 100));

        updateFile(uploadedFile.file.name, {
          status: "done",
          text,
        });

        const res = await fetch("/api/ask-gpt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        const data = await res.json();

        updateFile(uploadedFile.file.name, {
          gptResult: data.fileResult.extractedName,
          matchInfo: data.fileResult,
        });
      } catch (err) {
        console.error("❌ Error processing file:", err);
        updateFile(uploadedFile.file.name, {
          status: "error",
          error: "Failed to extract or process file",
        });
      }
    }
  };

  const updateFileStatus = (fileName: string, status: FileStatus) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.file.name === fileName ? { ...f, status } : f
      )
    );
  };

  const updateFile = (
    fileName: string,
    update: Partial<UploadedFile>
  ) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.file.name === fileName ? { ...f, ...update } : f
      )
    );
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-gray-400 rounded p-8 text-center"
    >
      <p className="text-gray-700">Drag and drop your .txt or .docx files here</p>

      {files.length > 0 && (
        <ul className="mt-4 text-left space-y-4">
          {files.map(({ file, status, error, matchInfo }, idx) => (
            <li key={idx} className="p-4 border rounded shadow bg-white">
              <p className="font-semibold text-base">{file.name}</p>
              <p>Status: {status}</p>
              {error && (
                <p className="text-red-500">Error: {error}</p>
              )}

              {matchInfo && (
                <div className="mt-3 text-sm bg-gray-50 p-3 rounded space-y-1">
                  <p><strong>Extracted Insured:</strong> {matchInfo.extractedName}</p>
                  <p>
                    <strong>Matched ID:</strong>{" "}
                    {matchInfo.match
                      ? `${matchInfo.internalId}`
                      : "❌ No match"}
                  </p>
                  <p>
                    <strong>Confidence:</strong>{" "}
                    {(matchInfo.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
