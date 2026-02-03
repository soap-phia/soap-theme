async function getTheme(themeFile) {
    const response = await fetch(themeFile);
    return await response.json();
}

export default async function createTable(tableEl, themeFile) {
    const data = await getTheme(themeFile);
    
    let tableHTML = `
    <thead>
        <tr>
            <th></th>
        </tr>
    </thead>
    <tbody>
    `;

    Object.entries(data[0]).forEach(([key, color]) => {
        tableHTML += `
        <tr style="background-color: ${color}">
            <td><p class="key">${key}</p></td>
        </tr>
        `;
    });

    tableHTML += `</tbody>`;
    tableEl.innerHTML = tableHTML;
}