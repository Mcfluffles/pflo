import { 
    SCU_RATE_CIS,
    SCU_RATE_CAT
} from "../constants.js";

export async function buildQuoteCalculator(routes) {

    const routeSelect = document.getElementById("quote-route");
    const scuInput = document.getElementById("quote-scus");
    const currencySelect = document.getElementById("quote-currency");
    const resultBox = document.getElementById("quote-result");

    routeSelect.innerHTML = routes.map((route, index) => {
        return `<option value="${index}">${route.route}</option>`;
    }).join("");

    function calculateQuote() {
        const selectedRoute = routes[Number(routeSelect.value)];
        const scus = Math.max(1, Math.ceil(Number(scuInput.value) || 1));
        const currency = currencySelect.value;

        const scuRate = currency === "cat" ? SCU_RATE_CAT : SCU_RATE_CIS;
        const fuelCost = currency === "cat" ? selectedRoute.fuel_cat : selectedRoute.fuel_cis;

        const freightCost = scus * scuRate;
        const total = freightCost + fuelCost;

        const label = currency.toUpperCase();

        resultBox.innerHTML = `
            Freight: ${scus} SCU × ${scuRate.toLocaleString()} ${label} = ${freightCost.toLocaleString()} ${label}
            <span>Fuel: ${selectedRoute.route} = ${fuelCost.toLocaleString()} ${label}</span>
            <span>Total Quote: ${total.toLocaleString()} ${label}</span>
        `;
    }

    scuInput.addEventListener("input", calculateQuote);
    routeSelect.addEventListener("change", calculateQuote);
    currencySelect.addEventListener("change", calculateQuote);

    calculateQuote();
}