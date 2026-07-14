// js/api/pullServiceLevels.js

export async function pullServiceLevels() {
    const response = await fetch(
        "https://api.flca.space/api/service-levels"
    );

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
}