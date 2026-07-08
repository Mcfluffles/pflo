//Pull the member productiondata

export async function pullMemberProduction() {
    const response = await fetch("https://api.flca.space/api/member-net-production");

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
}

//pull the member consumption data...duh
export async function pullMemberConsumption() {
    const response = await fetch("https://api.flca.space/api/member-net-consumption");

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
}