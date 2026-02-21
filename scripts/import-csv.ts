import { importCsv } from "../src/lib/import-service";

import path from "path";

async function main() {
    const csvPath = path.join(process.cwd(), "data", "petshop_detailes.csv");
    console.log(`Starting import from ${csvPath}...`);

    try {
        const stats = await importCsv(csvPath);
        console.log("Import completed successfully:");
        console.log(`- Imported: ${stats.imported_count}`);
        console.log(`- Updated: ${stats.updated_count}`);
        console.log(`- Skipped: ${stats.skipped_count}`);
    } catch (error) {
        console.error("Import failed:", error);
        process.exit(1);
    }
}

main();
