//@ts-check

import * as afunc from "./index.js";

async function main() {

    //make this into a nice function loop later lollll
    const production = await afunc.pullMemberProduction();
    const consumption = await afunc.pullMemberConsumption();
    const internalTradeOps = await afunc.pullInternalTradeOpportunities();

    const pfloProd = production.filter(c => c.CompanyCode === "PFLO");
    const nopeProd = production.filter(c => c.CompanyCode === "NOPE");
    const pspsProd = production.filter(c => c.CompanyCode === "PSPS");
    const t556Prod = production.filter(c => c.CompanyCode === "T556");
    const ttlProd = production.filter(c => c.CompanyCode === "TTL");

    const pfloCons = consumption.filter(c => c.CompanyCode === "PFLO");
    const nopeCons = consumption.filter(c => c.CompanyCode === "NOPE");
    const pspsCons = consumption.filter(c => c.CompanyCode === "PSPS");
    const t556Cons = consumption.filter(c => c.CompanyCode === "T556");
    const ttlCons = consumption.filter(c => c.CompanyCode === "TTL");

    afunc.buildGenericTable("pflo-production-table", pfloProd, [
        { key: "CompanyCode", label: "Company" },
        { key: "Ticker", label: "Ticker" },
        { key: "Name", label: "Name" },
        { key: "NetPerDay", label: "Net / Day" },
        { key: "NetAvgValuePerDay", label: "AvgNetValue / Day"}
    ]);

    afunc.buildGenericTable("nope-production-table", nopeProd, [
        { key: "CompanyCode", label: "Company" },
        { key: "Ticker", label: "Ticker" },
        { key: "Name", label: "Name" },
        { key: "NetPerDay", label: "Net / Day" },
        { key: "NetAvgValuePerDay", label: "AvgNetValue / Day" }
    ]);

    afunc.buildGenericTable("psps-production-table", pspsProd, [
        { key: "CompanyCode", label: "Company" },
        { key: "Ticker", label: "Ticker" },
        { key: "Name", label: "Name" },
        { key: "NetPerDay", label: "Net / Day" },
        { key: "NetAvgValuePerDay", label: "AvgNetValue / Day" }
    ]);

    afunc.buildGenericTable("t556-production-table", t556Prod, [
        { key: "CompanyCode", label: "Company" },
        { key: "Ticker", label: "Ticker" },
        { key: "Name", label: "Name" },
        { key: "NetPerDay", label: "Net / Day" },
        { key: "NetAvgValuePerDay", label: "AvgNetValue / Day" }
    ]);

    afunc.buildGenericTable("ttl-production-table", ttlProd, [
        { key: "CompanyCode", label: "Company" },
        { key: "Ticker", label: "Ticker" },
        { key: "Name", label: "Name" },
        { key: "NetPerDay", label: "Net / Day" },
        { key: "NetAvgValuePerDay", label: "AvgNetValue / Day" }
    ]);

    afunc.buildGenericTable("pflo-consumption-table", pfloCons, [
        { key: "CompanyCode", label: "Company" },
        { key: "Ticker", label: "Ticker" },
        { key: "Name", label: "Name" },
        { key: "NetPerDay", label: "Net / Day" },
        { key: "NetAvgValuePerDay", label: "AvgNetValue / Day" }
    ]);

    afunc.buildGenericTable("nope-consumption-table", nopeCons, [
        { key: "CompanyCode", label: "Company" },
        { key: "Ticker", label: "Ticker" },
        { key: "Name", label: "Name" },
        { key: "NetPerDay", label: "Net / Day" },
        { key: "NetAvgValuePerDay", label: "AvgNetValue / Day" }
    ]);

    afunc.buildGenericTable("psps-consumption-table", pspsCons, [
        { key: "CompanyCode", label: "Company" },
        { key: "Ticker", label: "Ticker" },
        { key: "Name", label: "Name" },
        { key: "NetPerDay", label: "Net / Day" },
        { key: "NetAvgValuePerDay", label: "AvgNetValue / Day" }
    ]);

    afunc.buildGenericTable("t556-consumption-table", t556Cons, [
        { key: "CompanyCode", label: "Company" },
        { key: "Ticker", label: "Ticker" },
        { key: "Name", label: "Name" },
        { key: "NetPerDay", label: "Net / Day" },
        { key: "NetAvgValuePerDay", label: "AvgNetValue / Day" }
    ]);

    afunc.buildGenericTable("ttl-consumption-table", ttlCons, [
        { key: "CompanyCode", label: "Company" },
        { key: "Ticker", label: "Ticker" },
        { key: "Name", label: "Name" },
        { key: "NetPerDay", label: "Net / Day" },
        { key: "NetAvgValuePerDay", label: "AvgNetValue / Day" }
    ]);

    afunc.buildGenericTable("internal-trade-table", internalTradeOps, [
        { key: "Seller", label: "Seller", class: "seller" },
        { key: "Ticker", label: "Ticker" },
        { key: "Buyer", label: "Buyer", class: "buyer" },
        { key: "BuyerDeficitPerDay", label: "Buyer Daily Deficit" },
        { key: "SellerSurplusPerDay", label: "Seller Daily Surplus"},
        { key: "MatchedPerDay", label: "Matched Amount" },
        { key: "BuyerDaysRemaining", label: "Buyer Supply Days Remaining" },
        { key: "BuyerStatus", label: "Buyer Supply Status", class: row => `status-${row.BuyerStatus.toLowerCase()}` }
    ]);
}

main();