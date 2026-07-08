//pull the member consumption data...duh
export async function pullInternalTradeOpportunities() {
    const response = await fetch("https://api.flca.space/api/internal-trade-opportunities");

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
}