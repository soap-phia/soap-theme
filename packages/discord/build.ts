import * as sass from "sass";
import fs from "fs";
import theme from "@theme";
import path from "path";

const rawPalette = (theme[0] ?? {}) as Record<string, string>;
const palette = Object.fromEntries(
    Object.entries(rawPalette).map(([key, value]) => [
        key.toLowerCase().replace(/\s+/g, ""),
        value,
    ])
);

function compile(srcDir: string, outDir: string): void {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const outPath = path.join(outDir, entry.name.replace(/\.scss$/, '.css'));

        if (entry.isDirectory()) {
            compile(srcPath, path.join(outDir, entry.name));
        } else if (entry.isFile() && /\.scss$/.test(entry.name) && !entry.name.startsWith('_')) {
            const result = sass.compile(srcPath, {
                loadPaths: ['node_modules'],
                sourceMap: false,
                style: 'expanded',
            });

            fs.writeFileSync(outPath, result.css);
            console.log(`Compiled: ${srcPath} → ${outPath}`);
        }
    }
}

const build = async (): Promise<void> => {
    fs.rmSync("./dist", { recursive: true });
    fs.cpSync("./src", "./dist", { recursive: true });

    let file = fs.readFileSync("./dist/_template.scss", "utf8");
    for (const [key, value] of Object.entries(palette)) {
        file = file.replaceAll(`{{${key}}}`, value);
    }

    fs.writeFileSync("./dist/_soap.scss", file);

    compile("./dist", "./");
};


build();