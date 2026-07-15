//@ts-check

//imports
import * as afunc from "./index.js";

async function main() {

//Pull FLN established route data
    const [routes, serviceLevels] = await Promise.all(
        [
            afunc.pullFLNRoutes(),
            afunc.pullServiceLevels()
        ]
    );

//Call and build the quote calculator
afunc.buildQuoteCalculator(routes, serviceLevels);

//Call and build the route tables
afunc.buildRouteTable("ben-planetary-table", routes, "Planetary", "BEN");
afunc.buildRouteTable("arc-planetary-table", routes, "Planetary", "ARC");
afunc.buildRouteTable("exchange-table", routes, "Exchange");

}

main();
