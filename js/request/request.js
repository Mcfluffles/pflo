const API_BASE = "https://api.flca.space";

const form = document.getElementById("shipping-request-form");
const cargoLines = document.getElementById("cargo-lines");
const addMaterialButton = document.getElementById("add-material-line");
const blockPreview = document.getElementById("block-preview");
const cargoError = document.getElementById("cargo-error");
const submitButton = document.getElementById("submit-request");
const requestStatus = document.getElementById("request-status");
const requestSuccess = document.getElementById("request-success");
const trackingCode = document.getElementById("tracking-code");

let latestPlan = null;
let latestPlanSignature = null;
let previewTimer = null;
let previewRequestId = 0;
let previewController = null;

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function fetchJson(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, options);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.error || `Request failed (${response.status}).`);
    }

    return payload;
}

function uniqueLocations(routes) {
    return [...new Set(
        routes.flatMap(route => [route.origin_code, route.destination_code])
            .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));
}

function fillSelect(select, options, placeholder) {
    select.innerHTML = `<option value="">${escapeHtml(placeholder)}</option>` + options
        .map(option => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`)
        .join("");
}

async function initializeFormOptions() {
    const [routes, serviceLevels, operators] = await Promise.all([
        fetchJson("/api/routes"),
        fetchJson("/api/service-levels"),
        fetchJson("/api/operators")
    ]);

    const locations = uniqueLocations(routes);
    const locationOptions = locations.map(code => ({ value: code, label: code }));

    fillSelect(document.getElementById("request-origin"), locationOptions, "Select origin");
    fillSelect(document.getElementById("request-destination"), locationOptions, "Select destination");

    fillSelect(
        document.getElementById("request-service"),
        serviceLevels.map(level => ({
            value: level.ServiceCode,
            label: `${level.ServiceName} — ${level.DeliveryDays} days`
        })),
        "Select service level"
    );

    const operatorSelect = document.getElementById("request-operator");
    operatorSelect.innerHTML = '<option value="">No preference</option>' + operators
        .map(operator => `
            <option value="${escapeHtml(operator.OperatorCode)}">
                ${escapeHtml(operator.OperatorName)} (${escapeHtml(operator.OperatorCode)})
            </option>
        `)
        .join("");
}

function addMaterialLine(ticker = "", quantity = "") {
    const line = document.createElement("div");
    line.className = "cargo-line mini-card";
    line.innerHTML = `
        <label class="field cargo-ticker-field">
            <span>Material Ticker</span>
            <input class="cargo-ticker" maxlength="20" autocomplete="off" required placeholder="e.g. SF" value="${escapeHtml(ticker)}" />
        </label>
        <label class="field cargo-quantity-field">
            <span>Quantity</span>
            <input class="cargo-quantity" type="number" min="1" step="1" required placeholder="0" value="${escapeHtml(quantity)}" />
        </label>
        <button class="button cargo-remove" type="button" aria-label="Remove material">Remove</button>
    `;

    line.querySelector(".cargo-remove").addEventListener("click", () => {
        line.remove();

        if (cargoLines.children.length === 0) {
            addMaterialLine();
        }

        schedulePreview();
    });

    line.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", schedulePreview);
    });

    cargoLines.appendChild(line);
}

function getItems() {
    return [...cargoLines.querySelectorAll(".cargo-line")]
        .map(line => ({
            ticker: line.querySelector(".cargo-ticker").value.trim().toUpperCase(),
            quantity: Number(line.querySelector(".cargo-quantity").value)
        }))
        .filter(item => item.ticker || item.quantity);
}

function formatNumber(value, maximumFractionDigits = 3) {
    return Number(value).toLocaleString(undefined, { maximumFractionDigits });
}

function updateSummary(plan) {
    document.getElementById("summary-block-count").textContent = plan?.scuCount ?? plan?.blockCount ?? 0;
    document.getElementById("summary-total-weight").textContent = `${formatNumber(plan?.totalWeight ?? 0)} t`;
    document.getElementById("summary-total-volume").textContent = `${formatNumber(plan?.totalVolume ?? 0)} m³`;
}

function renderPlan(plan, signature) {
    latestPlan = plan;
    latestPlanSignature = signature;
    updateSummary(plan);

    const scus = plan.scus ?? plan.blocks ?? [];

    blockPreview.innerHTML = scus.map(scu => `
        <article class="mini-card contract-block">
            <div class="kicker">SCU ${scu.scuNumber ?? scu.blockNumber}</div>
            <h3>${formatNumber(scu.weight)} t / ${formatNumber(scu.volume)} m³</h3>
            <ul class="block-items">
                ${scu.items.map(item => `
                    <li>
                        <strong>${escapeHtml(item.ticker)} × ${formatNumber(item.quantity, 0)}</strong>
                        <span>${escapeHtml(item.name)}</span>
                    </li>
                `).join("")}
            </ul>
        </article>
    `).join("");
}

function clearPlan(message = "Add cargo to generate Standard Cargo Units.") {
    latestPlan = null;
    latestPlanSignature = null;
    updateSummary(null);
    blockPreview.innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
}

async function previewShipment() {
    const items = getItems();
    const signature = JSON.stringify(items);
    const requestId = ++previewRequestId;

    cargoError.hidden = true;
    cargoError.textContent = "";

    previewController?.abort();
    previewController = null;

    if (items.length === 0 || items.some(item => !item.ticker || !Number.isInteger(item.quantity) || item.quantity <= 0)) {
        clearPlan();
        return false;
    }

    const controller = new AbortController();
    previewController = controller;

    try {
        const plan = await fetchJson("/api/shipping-requests/preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
            signal: controller.signal
        });

        // A slower response for an earlier value must never replace the newest preview.
        if (requestId !== previewRequestId || signature !== JSON.stringify(getItems())) {
            return false;
        }

        renderPlan(plan, signature);
        return true;
    } catch (error) {
        if (error.name === "AbortError" || requestId !== previewRequestId) {
            return false;
        }

        clearPlan("Unable to generate Standard Cargo Units.");
        cargoError.textContent = error.message;
        cargoError.hidden = false;
        return false;
    } finally {
        if (previewController === controller) {
            previewController = null;
        }
    }
}

function schedulePreview() {
    window.clearTimeout(previewTimer);
    previewTimer = window.setTimeout(previewShipment, 300);
}

function formPayload() {
    return {
        customerCompany: document.getElementById("customer-company").value.trim(),
        customerContact: document.getElementById("customer-contact").value.trim(),
        originCode: document.getElementById("request-origin").value,
        destinationCode: document.getElementById("request-destination").value,
        serviceCode: document.getElementById("request-service").value || null,
        preferredOperatorCode: document.getElementById("request-operator").value || null,
        notes: document.getElementById("request-notes").value.trim() || null,
        items: getItems()
    };
}

form.addEventListener("submit", async event => {
    event.preventDefault();
    requestStatus.textContent = "";
    requestSuccess.hidden = true;

    if (!form.reportValidity()) {
        return;
    }

    const currentSignature = JSON.stringify(getItems());

    if (!latestPlan || latestPlanSignature !== currentSignature) {
        await previewShipment();
    }

    if (!latestPlan || latestPlanSignature !== JSON.stringify(getItems())) {
        cargoError.textContent = "Resolve the cargo errors before submitting the request.";
        cargoError.hidden = false;
        return;
    }

    submitButton.disabled = true;
    requestStatus.textContent = "Submitting request…";

    try {
        const result = await fetchJson("/api/shipping-requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formPayload())
        });

        trackingCode.textContent = result.trackingCode;
        requestSuccess.hidden = false;
        requestSuccess.scrollIntoView({ behavior: "smooth", block: "start" });
        requestStatus.textContent = "Request submitted.";
    } catch (error) {
        requestStatus.textContent = error.message;
        requestStatus.classList.add("error-message");
    } finally {
        submitButton.disabled = false;
    }
});

addMaterialButton.addEventListener("click", () => {
    addMaterialLine();
    cargoLines.lastElementChild?.querySelector("input")?.focus();
});

try {
    await initializeFormOptions();
    addMaterialLine();
} catch (error) {
    console.error("Shipping request form initialization failed:", error);
    requestStatus.textContent = "Unable to load route and service options.";
    requestStatus.classList.add("error-message");
    addMaterialLine();
}
