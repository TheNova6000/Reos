"use client";

import { useState, useMemo } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Search, FileText, Download, Plus, File, Trash2, Loader2 } from "lucide-react";
import {
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_TYPE_CATEGORY,
} from "@/lib/constants";
import type { DocumentCategory } from "@/lib/constants";
import { useDemoStore, addDocument, deleteDocument } from "@/lib/demo-store";
import { uploadDocument } from "@/lib/supabase/storage";
import type { Document } from "@/types/database";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AddDocumentDialog() {
  const store = useDemoStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [docType, setDocType] = useState<Document["document_type"]>("other");
  const [linkedProject, setLinkedProject] = useState("");
  const [linkedProperty, setLinkedProperty] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function handleFileSelect(selectedFile: File) {
    setFile(selectedFile);
    if (!name.trim()) {
      setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    let fileUrl = "#";
    let fileSize = 0;
    let mimeType = "application/octet-stream";

    if (file) {
      setUploading(true);
      const result = await uploadDocument(file, store.tenantId || "general");
      setUploading(false);

      if (result) {
        fileUrl = result.url;
        fileSize = result.size;
        mimeType = result.mimeType;
      }
    }

    addDocument({
      name: name.trim(),
      document_type: docType,
      project_id: linkedProject || undefined,
      property_id: linkedProperty || undefined,
      file_url: fileUrl,
      file_size: fileSize || (file ? file.size : undefined),
      mime_type: mimeType || (file ? file.type : undefined),
    });
    setName("");
    setDocType("other");
    setLinkedProject("");
    setLinkedProperty("");
    setFile(null);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Upload className="w-4 h-4 mr-1" />
        Upload
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile) handleFileSelect(droppedFile);
            }}
            className={`relative p-6 border-2 border-dashed text-center transition-colors cursor-pointer ${
              dragOver ? "border-primary bg-primary/5" : file ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" : "border-border"
            }`}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) handleFileSelect(selected);
              }}
            />
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(0)} KB)</span>
              </div>
            ) : (
              <>
                <File className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm text-muted-foreground">
                  Drop a file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, DOCX, JPG, PNG (max 50MB)
                </p>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label>Document Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., RERA Certificate - Green Valley"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select value={docType} onValueChange={(v) => v && setDocType(v as Document["document_type"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {(Object.entries(DOCUMENT_CATEGORY_LABELS) as [DocumentCategory, string][]).map(
                  ([cat, catLabel]) => {
                    const types = Object.entries(DOCUMENT_TYPE_CATEGORY)
                      .filter(([, c]) => c === cat)
                      .map(([type]) => type);
                    if (types.length === 0) return null;
                    return (
                      <div key={cat}>
                        <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {catLabel}
                        </div>
                        {types.map((type) => (
                          <SelectItem key={type} value={type}>
                            {DOCUMENT_TYPE_LABELS[type] || type}
                          </SelectItem>
                        ))}
                      </div>
                    );
                  }
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Link to Project (optional)</Label>
            <Select value={linkedProject} onValueChange={(v) => setLinkedProject(!v || v === "none" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select project..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {store.projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Link to Property (optional)</Label>
            <Select value={linkedProperty} onValueChange={(v) => setLinkedProperty(!v || v === "none" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select property..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {store.properties.slice(0, 20).map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.plot_number}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? (
              <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="w-4 h-4 mr-1" /> {file ? "Upload & Save" : "Save Document"}</>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function DocumentsPage() {
  const store = useDemoStore();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredDocs = useMemo(() => {
    return store.documents.filter((doc) => {
      const matchSearch =
        !search ||
        doc.name.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || doc.document_type === typeFilter;
      return matchSearch && matchType;
    });
  }, [store.documents, search, typeFilter]);

  function getLinkedLabel(doc: Document): string {
    const parts: string[] = [];
    if (doc.project_id) {
      const p = store.projects.find((pr) => pr.id === doc.project_id);
      if (p) parts.push(p.name);
    }
    if (doc.property_id) {
      const p = store.properties.find((pr) => pr.id === doc.property_id);
      if (p) parts.push(p.plot_number);
    }
    if (doc.lead_id) {
      const l = store.leads.find((ld) => ld.id === doc.lead_id);
      if (l) parts.push(l.name);
    }
    return parts.length > 0 ? parts.join(" · ") : "—";
  }

  return (
    <>
      <DashboardHeader
        title="Documents"
        description={`${store.documents.length} documents`}
        actions={<AddDocumentDialog />}
      />
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => v && setTypeFilter(v)}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">All Types</SelectItem>
              {(Object.entries(DOCUMENT_CATEGORY_LABELS) as [DocumentCategory, string][]).map(
                ([cat, catLabel]) => {
                  const types = Object.entries(DOCUMENT_TYPE_CATEGORY)
                    .filter(([, c]) => c === cat)
                    .map(([type]) => type);
                  if (types.length === 0) return null;
                  return (
                    <div key={cat}>
                      <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {catLabel}
                      </div>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {DOCUMENT_TYPE_LABELS[type] || type}
                        </SelectItem>
                      ))}
                    </div>
                  );
                }
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        {store.documents.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(DOCUMENT_TYPE_LABELS)
              .map(([type, label]) => ({
                type,
                label,
                count: store.documents.filter((d) => d.document_type === type).length,
              }))
              .filter((t) => t.count > 0)
              .map((t) => (
                <Card key={t.type}>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold">{t.count}</p>
                    <p className="text-xs text-muted-foreground">{t.label}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Linked To</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      {store.documents.length === 0
                        ? "No documents yet. Upload sale deeds, DTCP approvals, RERA certificates, and more."
                        : "No documents match your search."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="font-medium text-sm">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {DOCUMENT_TYPE_LABELS[doc.document_type] || doc.document_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getLinkedLabel(doc)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {doc.file_size ? formatFileSize(doc.file_size) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(doc.created_at).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            disabled={!doc.file_url || doc.file_url === "#"}
                            onClick={() => {
                              if (doc.file_url && doc.file_url !== "#") {
                                window.open(doc.file_url, "_blank");
                              }
                            }}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => { if (confirm("Delete this document?")) deleteDocument(doc.id); }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
