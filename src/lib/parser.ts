import mammoth from "mammoth";

export const extractTextFromFile = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  console.log("🧪 Detected file extension:", ext);

  if (!ext) {
    throw new Error("File has no extension");
  }

  switch (ext) {
    case "txt":
      console.log("📄 Reading .txt file");
      return await file.text();

    case "docx":
      console.log("📄 Reading .docx file");
      const buffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      return result.value;

    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
};
