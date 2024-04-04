"use client";

import { X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "~/lib/uploadthing";

type FileUploadProps = {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange: (...event: unknown[]) => void;
};

export const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const fileType = value.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button className="w-w h-4" onClick={() => onChange("")}>
          <X
            className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
            type="button"
          />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url);
      }}
      onUploadError={(error: Error) => console.log(error)}
    />
  );
};
