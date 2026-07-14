// import { 
//     SCU_RATE_CIS,
//     SCU_RATE_CAT
// } from "../constants.js";

export function buildQuoteCalculator(routes, serviceLevels) {
    const routeSelect =
        document.getElementById("quote-route");

    const serviceSelect =
        document.getElementById("quote-service");

    const serviceDescription =
        document.getElementById("quote-service-description");

    const scuInput =
        document.getElementById("quote-scus");

    const currencySelect =
        document.getElementById("quote-currency");

    const resultBox =
        document.getElementById("quote-result");

    routeSelect.innerHTML = routes
        .map((route, index) => {
            return `
                <option value="${index}">
                    ${route.route}
                </option>
            `;
        })
        .join("");

    serviceSelect.innerHTML = serviceLevels
        .map((service, index) => {
            const selected =
                service.ServiceCode === "standard"
                    ? "selected"
                    : "";

            return `
                <option value="${index}" ${selected}>
                    ${service.ServiceName}
                    — within ${service.DeliveryDays} days
                </option>
            `;
        })
        .join("");

    function calculateQuote() {
        const route =
            routes[Number(routeSelect.value)];

        const service =
            serviceLevels[Number(serviceSelect.value)];

        const scus =
            Math.max(
                1,
                Math.ceil(Number(scuInput.value) || 1)
            );

        const currency = currencySelect.value;

        const rate =
            currency === "cat"
                ? Number(service.RateCAT)
                : Number(service.RateCIS);

        const routeCharge =
            currency === "cat"
                ? Number(route.fuel_cat)
                : Number(route.fuel_cis);

        const freightCharge = scus * rate;
        const total = freightCharge + routeCharge;

        const currencyLabel = currency.toUpperCase();

        serviceDescription.textContent =
            service.Description ?? "";

        resultBox.innerHTML = `
           
            <span>
                Freight:
                ${scus} SCU ×
                ${rate.toLocaleString()} ${currencyLabel}
                =
                ${freightCharge.toLocaleString()} ${currencyLabel}
            </span>

            <span>
                Route charge:
                ${routeCharge.toLocaleString()} ${currencyLabel}
            </span>

            <span>
                Delivery target:
                within ${service.DeliveryDays} days
            </span>

             <strong>
                ${service.ServiceName} Quote:
                ${total.toLocaleString()} ${currencyLabel}
            </strong>
        `;
    }

    routeSelect.addEventListener(
        "change",
        calculateQuote
    );

    serviceSelect.addEventListener(
        "change",
        calculateQuote
    );

    scuInput.addEventListener(
        "input",
        calculateQuote
    );

    currencySelect.addEventListener(
        "change",
        calculateQuote
    );

    calculateQuote();
}