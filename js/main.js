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
afunc.buildRouteTable("planetary-table", routes, "Planetary");
afunc.buildRouteTable("exchange-table", routes, "Exchange");

}

main();
