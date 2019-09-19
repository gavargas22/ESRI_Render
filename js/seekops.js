require([
    "esri/Map",
    "esri/views/SceneView"
], function (Map, SceneView) {

    var map = new Map({
        basemap: "satellite",
        ground: "world-elevation"  // show elevation
    });

    var view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: {
            position: {  // observation point
                x: -97.800271,
                y: 30.347452,
                z: 1000 // altitude in meters
            },
            tilt: 65  // perspective in degrees
        }
    });
});