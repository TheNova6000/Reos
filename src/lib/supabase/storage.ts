"use client";

import { createClient } from "./client";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

function getPublicUrl(bucket: string, path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

function generatePath(folder: string, file: File): string {
  const ext = file.name.split(".").pop() ?? "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${folder}/${timestamp}-${random}.${ext}`;
}

export async function uploadProjectImage(
  file: File,
  projectId: string
): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const path = generatePath(projectId, file);
  const { error } = await supabase.storage
    .from("project-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("Upload project image failed:", error.message);
    return null;
  }
  return getPublicUrl("project-images", path);
}

export async function uploadPropertyImage(
  file: File,
  propertyId: string
): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const path = generatePath(propertyId, file);
  const { error } = await supabase.storage
    .from("property-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("Upload property image failed:", error.message);
    return null;
  }
  return getPublicUrl("property-images", path);
}

export async function uploadDocument(
  file: File,
  folder: string
): Promise<{ url: string; size: number; mimeType: string } | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const path = generatePath(folder, file);
  const { error } = await supabase.storage
    .from("documents")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("Upload document failed:", error.message);
    return null;
  }

  return {
    url: getPublicUrl("documents", path),
    size: file.size,
    mimeType: file.type,
  };
}

export async function deleteStorageFile(
  bucket: string,
  url: string
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const prefix = getPublicUrl(bucket, "");
  if (!url.startsWith(prefix)) return false;
  const path = url.slice(prefix.length);

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error("Delete file failed:", error.message);
    return false;
  }
  return true;
}
