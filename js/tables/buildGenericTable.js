// js/tables/buildGenericTable.js

export function buildGenericTable(tableId, data, columns) {

    const table = document.getElementById(tableId);

    if (!table || !data.length) return;

    let html = "<thead><tr>";

    // Header
    columns.forEach(col => {
        html += `<th>${col.label}</th>`;
    });

    html += "</tr></thead><tbody>";

    // Body
    data.forEach(row => {

        html += "<tr>";

        columns.forEach((col, index) => {

            const value = row[col.key] ?? "";

            const className =
                typeof col.class === "function"
                    ? col.class(row)
                    : (col.class ?? "");

            const classAttr =
                className ? ` class="${className}"` : "";

            html += `<td${classAttr}>`;

            if (index === 0) {
                html += `<strong>${value}</strong>`;
            } else {
                html += value;
            }

            html += `</td>`;
        });

        html += "</tr>";
    });

    html += "</tbody>";

    table.innerHTML = html;
}