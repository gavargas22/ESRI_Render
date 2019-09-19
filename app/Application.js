var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/geometry/SpatialReference", "esri/views/SceneView"], function (require, exports, Map_1, SpatialReference_1, SceneView_1) {
    "use strict";
    Map_1 = __importDefault(Map_1);
    SpatialReference_1 = __importDefault(SpatialReference_1);
    SceneView_1 = __importDefault(SceneView_1);
    var Application = /** @class */ (function () {
        function Application() {
            this.view = new SceneView_1.default({
                camera: {
                    position: { spatialReference: spatialReference, x: -8519711, y: 269771, z: 3016702 },
                    heading: 0,
                    tilt: 53
                },
                container: "viewDiv",
                viewingMode: "local",
                map: new Map_1.default({ basemap: 'satellite', layers: [] }),
                environment: {
                    background: { type: "color", color: [0, 0, 0, 1] },
                    starsEnabled: false,
                    atmosphereEnabled: false
                }
            });
            // this.view["renderContext"] = "webgl2"
            window["app"] = this.view;
            window["view"] = this.view;
        }
        return Application;
    }());
    var spatialReference = SpatialReference_1.default.WebMercator;
    return Application;
});
//# sourceMappingURL=Application.js.map