"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { useDemoStore, reloadStore } from "@/lib/demo-store";
import { bulkImportProperties } from "@/app/actions/properties";

interface ParsedRow {
  [key: string]: string;
}

function parseCSV(text: string): { headers: string[]; rows: ParsedRow[] } {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows: ParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: ParsedRow = {};
    headers.forEach((h, j) => {
      row[h] = values[j] || "";
    });
    rows.push(row);
  }

  return { headers, rows };
}

const REQUIRED_FIELDS = ["plot_number", "area", "price"] as const;
const OPTIONAL_FIELDS = ["area_unit", "facing", "property_type", "dimensions", "description"] as const;
const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];

export function CSVImportDialog() {
  const store = useDemoStore();
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [csvData, setCsvData] = useState<{ headers: string[]; rows: ParsedRow[] } | null>(null);
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ inserted: number; errors: string[] } | null>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      setCsvData(parsed);

      const autoMap: Record<string, string> = {};
      for (const field of ALL_FIELDS) {
        const match = parsed.headers.find(
          (h) => h.toLowerCase().replace(/[^a-z]/g, "") === field.replace(/_/g, "")
        );
        if (match) autoMap[field] = match;
      }
      setColumnMap(autoMap);
      setResult(null);
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  async function handleImport() {
    if (!projectId || !csvData) return;

    setImporting(true);
    const rows = csvData.rows.map((row) => ({
      plot_number: row[columnMap.plot_number] || "",
      area: parseFloat(row[columnMap.area] || "0"),
      area_unit: row[columnMap.area_unit] || "sq_yards",
      facing: row[columnMap.facing] || "east",
      price: parseFloat(row[columnMap.price] || "0"),
      property_type: row[columnMap.property_type] || "plot",
      dimensions: row[columnMap.dimensions] || undefined,
      description: row[columnMap.description] || undefined,
    }));

    const res = await bulkImportProperties(projectId, rows);
    setResult({ inserted: res.inserted, errors: res.errors });
    setImporting(false);

    if (res.inserted > 0) {
      await reloadStore();
    }
  }

  function handleClose() {
    setOpen(false);
    setCsvData(null);
    setColumnMap({});
    setResult(null);
    setProjectId("");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <Upload className="w-4 h-4 mr-1" /> Import CSV
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Properties from CSV</DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              {result.inserted > 0 ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-500" />
              )}
              <div>
                <p className="font-semibold">
                  {result.inserted > 0
                    ? `${result.inserted} properties imported`
                    : "Import failed"}
                </p>
                {result.errors.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {result.errors.length} error{result.errors.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="bg-muted rounded-lg p-3 max-h-40 overflow-y-auto">
                {result.errors.map((err, i) => (
                  <p key={i} className="text-xs text-red-500">{err}</p>
                ))}
              </div>
            )}
            <Button onClick={handleClose} className="w-full">Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label id="csv-project-label">Target Project *</Label>
              <Select value={projectId} onValueChange={(v) => v && setProjectId(v)}>
                <SelectTrigger aria-labelledby="csv-project-label">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {store.projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>CSV File</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                onClick={() => document.getElementById("csv-file-input")?.click()}
              >
                <input
                  id="csv-file-input"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFile}
                />
                <FileSpreadsheet className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {csvData ? `${csvData.rows.length} rows loaded` : "Click to upload CSV file"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Required columns: plot_number, area, price
                </p>
              </div>
            </div>

            {csvData && csvData.headers.length > 0 && (
              <>
                <div className="space-y-2">
                  <Label>Column Mapping</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {ALL_FIELDS.map((field) => (
                      <div key={field} className="flex items-center gap-2">
                        <span className="text-xs w-24 shrink-0 text-right text-muted-foreground">
                          {field.replace(/_/g, " ")}
                          {REQUIRED_FIELDS.includes(field as typeof REQUIRED_FIELDS[number]) ? " *" : ""}
                        </span>
                        <Select
                          value={columnMap[field] || "__none__"}
                          onValueChange={(v) => { if (!v) return; const next = { ...columnMap }; if (v === "__none__") { delete next[field]; } else { next[field] = v; } setColumnMap(next); }}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none__">— skip —</SelectItem>
                            {csvData.headers.map((h) => (
                              <SelectItem key={h} value={h}>{h}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preview (first 5 rows)</Label>
                  <div className="overflow-x-auto rounded border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {ALL_FIELDS.filter((f) => columnMap[f]).map((f) => (
                            <TableHead key={f} className="text-xs whitespace-nowrap">{f.replace(/_/g, " ")}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {csvData.rows.slice(0, 5).map((row, i) => (
                          <TableRow key={i}>
                            {ALL_FIELDS.filter((f) => columnMap[f]).map((f) => (
                              <TableCell key={f} className="text-xs">{row[columnMap[f]] || "—"}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleClose}>Cancel</Button>
                  <Button
                    onClick={handleImport}
                    disabled={importing || !projectId || !columnMap.plot_number || !columnMap.area || !columnMap.price}
                  >
                    {importing ? "Importing..." : `Import ${csvData.rows.length} Properties`}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
