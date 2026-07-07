//Fetch and store API Data for use

export async function pullFLNRoutes() {

    const response = await fetch("https://api.flca.space/api/routes");
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
const routes = await response.json();

return routes;
}
