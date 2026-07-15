// This function builds the HMTL routing tables.
export async function buildRouteTable(tableId, routes, serviceType, region = null) {

    try {
        

        const filteredRoutes = routes.filter(route => {
            const serviceMatch =
                route.service_type === serviceType;

            const regionMatch =
                region === null || route.region === region;

            return serviceMatch && regionMatch;
        });

        const table = document.getElementById(tableId);

        const columns = [
            { key: "route", label: "Route" },
            { key: "fuel_cis", label: "Fuel (CIS)" },
            { key: "fuel_cat", label: "Fuel (CAT)" },
            { key: "notes", label: "Notes" }
        ];

        let html = "<thead><tr>";

        columns.forEach(col => {
            html += `<th>${col.label}</th>`;
        });

        html += "</tr></thead><tbody>";

                filteredRoutes.forEach(row => {

            html += "<tr>";

            columns.forEach((col, index) => {

                const value = row[col.key] ?? "";

                if (index === 0) {
                    html += `<td>${value}</td>`;
                } else {
                    html += `<td>${value}</td>`;
                }

            });

            html += "</tr>";

        });

        html += "</tbody>";

        table.innerHTML = html;
    }

    catch (err) {

        console.error(err);

        document.getElementById(tableId).innerHTML =
            `<tr><td>Failed to load route table.</td></tr>`;
    }
}