import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./client", () => ({
  createClient: vi.fn(() => null),
}));

import { createClient } from "./client";

const SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL;

// Re-import after env is set — storage.ts reads SUPABASE_URL at module level
// We test the logic by importing the functions and mocking createClient

describe("Storage — uploadDocument", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when Supabase is not configured", async () => {
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const { uploadDocument } = await import("./storage");
    const file = new File(["test content"], "test.pdf", { type: "application/pdf" });
    const result = await uploadDocument(file, "tenant-123");

    expect(result).toBeNull();
  });

  it("returns url, size, and mimeType on successful upload", async () => {
    const mockUpload = vi.fn().mockResolvedValue({ error: null });
    const mockFrom = vi.fn(() => ({ upload: mockUpload }));
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      storage: { from: mockFrom },
    });

    const { uploadDocument } = await import("./storage");
    const file = new File(["pdf content here"], "deed.pdf", { type: "application/pdf" });
    const result = await uploadDocument(file, "tenant-456");

    expect(result).not.toBeNull();
    expect(result!.url).toContain(SUPABASE_URL);
    expect(result!.url).toContain("/storage/v1/object/public/documents/");
    expect(result!.size).toBe(file.size);
    expect(result!.mimeType).toBe("application/pdf");
    expect(mockFrom).toHaveBeenCalledWith("documents");
  });

  it("returns null on upload error", async () => {
    const mockUpload = vi.fn().mockResolvedValue({ error: { message: "Bucket not found" } });
    const mockFrom = vi.fn(() => ({ upload: mockUpload }));
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      storage: { from: mockFrom },
    });

    const { uploadDocument } = await import("./storage");
    const file = new File(["data"], "doc.pdf", { type: "application/pdf" });
    const result = await uploadDocument(file, "tenant-789");

    expect(result).toBeNull();
  });
});

describe("Storage — uploadProjectImage", () => {
  it("returns null when Supabase is not configured", async () => {
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const { uploadProjectImage } = await import("./storage");
    const file = new File(["img"], "photo.jpg", { type: "image/jpeg" });
    const result = await uploadProjectImage(file, "proj-123");

    expect(result).toBeNull();
  });

  it("uploads to project-images bucket", async () => {
    const mockUpload = vi.fn().mockResolvedValue({ error: null });
    const mockFrom = vi.fn(() => ({ upload: mockUpload }));
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      storage: { from: mockFrom },
    });

    const { uploadProjectImage } = await import("./storage");
    const file = new File(["img data"], "hero.png", { type: "image/png" });
    const result = await uploadProjectImage(file, "proj-456");

    expect(result).not.toBeNull();
    expect(result).toContain("/storage/v1/object/public/project-images/");
    expect(mockFrom).toHaveBeenCalledWith("project-images");
  });
});

describe("Storage — deleteStorageFile", () => {
  it("returns false when Supabase is not configured", async () => {
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const { deleteStorageFile } = await import("./storage");
    const result = await deleteStorageFile("documents", "https://test.supabase.co/storage/v1/object/public/documents/file.pdf");

    expect(result).toBe(false);
  });

  it("returns false when URL does not match bucket prefix", async () => {
    const mockRemove = vi.fn().mockResolvedValue({ error: null });
    const mockFrom = vi.fn(() => ({ remove: mockRemove }));
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      storage: { from: mockFrom },
    });

    const { deleteStorageFile } = await import("./storage");
    const result = await deleteStorageFile("documents", "https://other-domain.com/file.pdf");

    expect(result).toBe(false);
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it("deletes file and returns true on success", async () => {
    const mockRemove = vi.fn().mockResolvedValue({ error: null });
    const mockFrom = vi.fn(() => ({ remove: mockRemove }));
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      storage: { from: mockFrom },
    });

    const { deleteStorageFile } = await import("./storage");
    const url = `${SUPABASE_URL}/storage/v1/object/public/documents/tenant-123/1234-abc.pdf`;
    const result = await deleteStorageFile("documents", url);

    expect(result).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("documents");
    expect(mockRemove).toHaveBeenCalledWith(["tenant-123/1234-abc.pdf"]);
  });
});
