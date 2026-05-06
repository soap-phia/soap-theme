import AdmZip from "adm-zip";
import fs from "fs";
import theme from "@theme";

const rawPalette = (theme[0] ?? {}) as Record<string, string>;
const palette = Object.fromEntries(
    Object.entries(rawPalette).map(([key, value]) => [
        key.toLowerCase().replace(/\s+/g, ""),
        value,
    ])
);

const build = async (): Promise<void> => {
    let file = fs.readFileSync("./src/manifest.json", "utf8");
    for (const [key, value] of Object.entries(palette)) {
        file = file.replaceAll(`{{${key}}}`, value);
    }
    fs.mkdirSync("./dist", { recursive: true });
    fs.writeFileSync("./dist/icon.png", fs.readFileSync("../../icon.png"));
    fs.writeFileSync("./dist/manifest.json", file);

    const zip = new AdmZip();
    zip.addLocalFile("./dist/icon.png");
    zip.addLocalFile("./dist/manifest.json");
    zip.writeZip("./soap-theme-chrome.zip");
};

build();