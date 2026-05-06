import { writeFileSync } from 'node:fs';

const res = await fetch('https://github.com/soap-phia/userstyles/releases/download/all-userstyles-export/import.json');
const userstylesImport = await res.json();

const [settings, ...userstyles] = userstylesImport as any[];

const selected = userstyles.map((userstyle) => {
    const copy = structuredClone(userstyle);
    copy.usercssData.vars.accentColor.value = 'pink';
    copy.usercssData.vars.darkFlavor.value = 'macchiato';
    copy.usercssData.vars.lightFlavor.value = 'macchiato';
    return copy;
});

writeFileSync('soap-theme-userstyles.json', JSON.stringify([settings, ...selected], null, 2), 'utf-8');
