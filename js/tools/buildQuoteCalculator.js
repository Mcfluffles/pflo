// import {
//     SCU_RATE_CIS,
//     SCU_RATE_CAT
// } from "../constants.js";

//@ts-check

import { findRouteChain } from "./findRouteChain.js";

export function buildQuoteCalculator(routes, serviceLevels) {
    const originSelect =
        document.getElementById("quote-origin");

    const destinationSelect =
        document.getElementById("quote-destination");

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

    const locations = [
        ...new Set(
            routes.flatMap(route => [
                route.origin_code,
                route.destination_code
            ])
        )
    ]
        .filter(Boolean)
        .sort();

    originSelect.innerHTML = locations
        .map(location => {
            return `<option value="${location}">${location}</option>`;
        })
        .join("");

    destinationSelect.innerHTML = locations
        .map(location => {
            return `<option value="${location}">${location}</option>`;
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

    // Pick a different initial destination where possible.
    if (locations.length > 1) {
        destinationSelect.selectedIndex = 1;
    }

    function calculateQuote() {
        const origin = originSelect.value;
        const destination = destinationSelect.value;

        if (origin === destination) {
            resultBox.textContent =
                "Origin and destination must be different.";

            return;
        }

        const routeChain = findRouteChain(
            routes,
            origin,
            destination
        );

        if (!routeChain?.length) {
            resultBox.textContent =
                `No established route is currently available from ${origin} to ${destination}.`;

            return;
        }

        const service =
            serviceLevels[Number(serviceSelect.value)];

        const scus = Math.max(
            1,
            Math.ceil(Number(scuInput.value) || 1)
        );

        const currency = currencySelect.value;

        const serviceRate =
            currency === "cat"
                ? Number(service.RateCAT)
                : Number(service.RateCIS);

        const routeCharge = routeChain.reduce(
            (total, leg) => {
                const legCharge =
                    currency === "cat"
                        ? Number(leg.fuel_cat)
                        : Number(leg.fuel_cis);

                return total + legCharge;
            },
            0
        );

        const freightCharge = scus * serviceRate;
        const total = freightCharge + routeCharge;
        const currencyLabel = currency.toUpperCase();

        const routePath = [
            routeChain[0].origin_code,
            ...routeChain.map(
                leg => leg.destination_code
            )
        ].join(" → ");

        serviceDescription.textContent =
            service.Description ?? "";

        resultBox.innerHTML = `
            
            <span>
                Routing:
                ${routePath}
            </span>

            <span>
                Freight:
                ${scus} SCU ×
                ${serviceRate.toLocaleString()} ${currencyLabel}
                =
                ${freightCharge.toLocaleString()} ${currencyLabel}
            </span>

            <span>
                Route charges:
                ${routeCharge.toLocaleString()} ${currencyLabel}
            </span>

            <span>
                Delivery target:
                within ${service.DeliveryDays} days
            </span

            <strong>
                ${service.ServiceName} Quote:
                ${total.toLocaleString()} ${currencyLabel}
            </strong>
        `;
    }

    originSelect.addEventListener(
        "change",
        calculateQuote
    );

    destinationSelect.addEventListener(
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