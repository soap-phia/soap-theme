import vsce from "@vscode/vsce";
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
    let file = fs.readFileSync("./src/template.json", "utf8");
    for (const [key, value] of Object.entries(palette)) {
        file = file.replaceAll(`{{${key}}}`, value);
    }

    fs.mkdirSync("./dist", { recursive: true });
    fs.writeFileSync("./dist/icon.png", fs.readFileSync("../../icon.png"));
    fs.writeFileSync("./dist/theme.json", file);

    await vsce.createVSIX({ packagePath: "./soap-theme-vscode.vsix" });
};

build();