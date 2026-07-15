export function findRouteChain(routes, origin, destination) {

    const directedRoutes = routes.flatMap(route => [
        route,
        {
            ...route,
            origin_code: route.destination_code,
            destination_code: route.origin_code
        }
    ]);

    // Check for a direct route first
    const directRoute = directedRoutes.find(route =>
        route.origin_code === origin &&
        route.destination_code === destination
    );

    if (directRoute) {
        return [directRoute];
    }

    // Otherwise, try routing through a hub
    const hubs = ["BEN", "ARC"];

    for (const hub of hubs) {

        const firstLeg = directedRoutes.find(route =>
            route.origin_code === origin &&
            route.destination_code === hub
        );

        const secondLeg = directedRoutes.find(route =>
            route.origin_code === hub &&
            route.destination_code === destination
        );

        if (firstLeg && secondLeg) {
            return [firstLeg, secondLeg];
        }
    }

    return null;
}