import path from "node:path";
import { promises as fs } from "node:fs";

import { tryCatch } from "@utils";

const collection = "simple-line-icons";
const icons = ["fire", "note"];

const iconsDir = path.join(process.cwd(), "src/assets/gradient-icons/");

const iconExists = async (iconName: string): Promise<boolean> => {
    const filePath = path.join(iconsDir, `${iconName}.svg`);
    const { error } = await tryCatch(fs.access(filePath));
    return error === null;
};

const downloadIcon = async (iconName: string): Promise<string> => {
    const url = `https://api.iconify.design/${collection}/${iconName}.svg`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download icon "${iconName}": ${response.statusText}`);
    }
    return await response.text();
};
const main = async (): Promise<void> => {
    const { error } = await tryCatch(fs.mkdir(iconsDir, { recursive: true }));
    if (error) {
        console.error("Error creating icons directory:", error);
        throw error;
    }

    for (const iconName of icons) {
        const exists = await iconExists(iconName);
        if (exists) {
            console.log(`Icon "${iconName}" already exists.`);
            continue;
        }

        console.log(`Icon "${iconName}" is missing. Downloading...`);

        const { data: svg, error } = await tryCatch(downloadIcon(iconName));
        if (error) {
            console.error(`Error downloading icon "${iconName}": ${error.message}`);
            throw error;
        }
        const outputPath = path.join(iconsDir, `${iconName}.svg`);
        const write = await tryCatch(fs.writeFile(outputPath, svg, "utf-8"));
        if (write.error) {
            console.error(`Error saving icon "${iconName}": ${write.error.message}`);
            throw write.error;
        }

        console.log(`Successfully downloaded and saved icon "${iconName}".`);
    }
};

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
