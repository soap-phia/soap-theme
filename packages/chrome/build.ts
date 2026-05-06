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
    const toChromeColor = (val: string): string => {
        if (typeof val !== "string") return String(val);
        const hex = val.trim();
        const m = hex.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
        if (!m) return val;
        let h = m[1]!;
        if (h.length === 3 || h.length === 4) {
            h = h.split("").map((c) => c + c).join("");
        }
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        if (h.length === 8) {
            const a = parseInt(h.slice(6, 8), 16);
            return `[${r}, ${g}, ${b}, ${a}]`;
        }
        return `[${r}, ${g}, ${b}]`;
    };

    for (const [key, value] of Object.entries(palette)) {
        const formatted = toChromeColor(value);
        file = file.replaceAll(`{{${key}}}`, formatted);
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