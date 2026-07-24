"use server";

import { auth } from "@/auth";
import { uploadImageBuffer } from "@/lib/cloudinary";

export type UploadState = { url?: string; error?: string };

export async function uploadProductImage(formData: FormData): Promise<UploadState> {
  const session = await auth();
  if (session?.user?.role !== "SELLER") return { error: "Unauthorized" };

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No file provided." };
  if (!file.type.startsWith("image/")) return { error: "Only image files are allowed." };
  if (file.size > 8 * 1024 * 1024) return { error: "Image must be under 8MB." };

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImageBuffer(buffer);
    return { url };
  } catch {
    return { error: "Upload failed. Check Cloudinary configuration." };
  }
}
