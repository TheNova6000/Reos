"use server";

import { createClient } from "@/lib/supabase/server";

interface ImportRow {
  plot_number: string;
  area: number;
  area_unit: string;
  facing: string;
  price: number;
  property_type: string;
  dimensions?: string;
  description?: string;
}

interface ImportResult {
  success: boolean;
  inserted: number;
  errors: string[];
}

export async function bulkImportProperties(
  projectId: string,
  rows: ImportRow[]
): Promise<ImportResult> {
  if (!projectId || rows.length === 0) {
    return { success: false, inserted: 0, errors: ["No project or rows provided."] };
  }

  const validUnits = ["sq_ft", "sq_yards", "sq_meters", "acres", "cents", "guntas"];
  const validFacings = ["north", "south", "east", "west", "north_east", "north_west", "south_east", "south_west", "corner"];
  const validTypes = ["plot", "apartment", "villa", "commercial", "farmland"];

  const errors: string[] = [];
  const validRows = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1;

    if (!row.plot_number) {
      errors.push(`Row ${rowNum}: missing plot_number`);
      continue;
    }
    if (!row.area || row.area <= 0) {
      errors.push(`Row ${rowNum}: invalid area`);
      continue;
    }
    if (!row.price || row.price <= 0) {
      errors.push(`Row ${rowNum}: invalid price`);
      continue;
    }

    const areaUnit = validUnits.includes(row.area_unit) ? row.area_unit : "sq_yards";
    const facing = validFacings.includes(row.facing) ? row.facing : "east";
    const propertyType = validTypes.includes(row.property_type) ? row.property_type : "plot";

    validRows.push({
      project_id: projectId,
      plot_number: row.plot_number,
      area: row.area,
      area_unit: areaUnit,
      facing,
      price: row.price,
      price_per_unit: Math.round(row.price / row.area),
      status: "available",
      property_type: propertyType,
      dimensions: row.dimensions || null,
      description: row.description || null,
      features: [],
      images: [],
    });
  }

  if (validRows.length === 0) {
    return { success: false, inserted: 0, errors: errors.length > 0 ? errors : ["No valid rows to import."] };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { success: true, inserted: validRows.length, errors };
  }

  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < validRows.length; i += batchSize) {
    const batch = validRows.slice(i, i + batchSize);
    const { error } = await supabase.from("properties").insert(batch);
    if (error) {
      errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
    } else {
      inserted += batch.length;
    }
  }

  return { success: inserted > 0, inserted, errors };
}
