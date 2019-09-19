import { VolumeRenderer, dataSets } from "./VolumeRenderer";

// ESRI
import Camera from "esri/Camera";
import { Point } from "esri/geometry";
import Map from "esri/Map";

// Geometry
import SpatialReference from "esri/geometry/SpatialReference";
// Layers
import FeatureLayer from "esri/layers/FeatureLayer";
// ESRI Views
import SceneView from "esri/views/SceneView";
import { add as addExternalRenderer } from "esri/views/3d/externalRenderers";
import Legend from "esri/widgets/Legend";

class Application {
    view: SceneView;

    constructor() {
        this.view = new SceneView({
            camera: {
                position: { spatialReference, x: -8519711, y: 269771, z: 3016702 },
                heading: 0,
                tilt: 53
            },
            container: "viewDiv",
            viewingMode: "local",
            map: new Map({ basemap: 'satellite', layers: [] }),
            environment: {
                background: { type: "color", color: [0, 0, 0, 1] },
                starsEnabled: false,
                atmosphereEnabled: false
            }
        });

        // this.view["renderContext"] = "webgl2"
        window["app"] = this.view;
        window["view"] = this.view;

        // Instantiate external volume renderer
        const renderer = new VolumeRenderer(this.view)
        addExternalRenderer(this.view, renderer);
    }
}

const spatialReference = SpatialReference.WebMercator;

export = Application;