// Esri
import EsriColor from "esri/Color";
import { SimpleRenderer } from "esri/renderers";
import esriRequest from "esri/request";
// Esri Geometry
import SpatialReference from "esri/geometry/SpatialReference";
// Esri Layers
import FeatureLayer from "esri/layers/FeatureLayer";
// Esri Renderers visual variables
import ColorVariable from "esri/renderers/visualVariables/ColorVariable";
// ESRI Views
import SceneView from "esri/views/SceneView";
// ESRI Views 3D
import {
    toRenderCoordinates,
    requestRender
} from "esri/views/3d/externalRenderers";

// Gl-Matrix
import { mat4, vec3, glMatrix } from "gl-matrix";

export const dataSets = {
    Probabilities: ['heatmap', 0, 20, "ppm"]
};

declare var setupGL: (gl: WebGLRenderingContext) => void;
declare var selectVolume: (
    file: string,
    size: vec3,
    done: () => void,
    error: () => void
) => void;
declare var selectColormap: (file: string, done: () => void) => void;
declare var draw: (projView: mat4, eye: vec3) => void;

const localUrl = "../plumes";

glMatrix.ARRAY_TYPE = Float64Array;

type RenderContext = __esri.RenderContext;
type ExternalRenderer = __esri.ExternalRenderer;

export class VolumeRenderer implements ExternalRenderer {
    // constructor(private _view: SceneView, private _legendLayer: FeatureLayer) {}
    constructor(private _view: SceneView) {}

    setup(context: RenderContext): void {
        // Set up the state
        const renderer = new SimpleRenderer();
        renderer.visualVariables = [new ColorVariable({ field: "attr" })];
        // this._legendLayer.renderer = renderer;
        this.data = "heatmap";

        setupGL(context.gl);

        // Origin of data
        const min = [97.799684, -30.356806, 1];
        const max = [97.799419, -30.356485, 5];
        // Translate into render coordinate system
        toRenderCoordinates(this._view, min, 0, SpatialReference.WGS84, min, 0, 1);
        toRenderCoordinates(this._view, max, 0, SpatialReference.WGS84, max, 0, 1);

        vec3.subtract(this._size, max, min);

        const position = vec3.create();
        vec3.add(position, min, max);
        vec3.scale(position, position, 0.5);

        toRenderCoordinates(
            this._view,
            [0, 0, 0],
            0,
            this._view.spatialReference,
            this._localOriginRender,
            0,
            1
        );
        vec3.subtract(this._localOriginRender, this._localOriginRender, position);
        this._localOriginRender[2] += max[2];
    }

    render(context: RenderContext): void {
        const eye = vec3.fromValues(
            context.camera.eye[0],
            context.camera.eye[1],
            context.camera.eye[2],
        )
        
        // Move to data origin
        vec3.subtract(position, eye, this._localOriginRender);
        
        mat4.identity(viewProj);
        mat4.translate(viewProj, viewProj, this._localOriginRender);
        mat4.multiply(viewProj, context.camera.viewMatrix as mat4, viewProj);
        mat4.multiply(viewProj, context.camera.projectionMatrix as mat4, viewProj);

        // Raycast the volume and reset state
        draw(viewProj, position);
        context.resetWebGLState();
    }

    // Set the data
    set data(name: string) {
        this._data = dataSets[name];
        this._updateColorMap = true;
        this._loadVolume();
    }

    private _loadVolume(): void {
        const filename = "./plumes/heatmap_145x179x20x_uint8.raw";

        selectVolume(
            filename,
            this._size,
            () => {
                if (this._updateColorMap) {
                    this._updateColorMap = false;
                    selectColormap("./plumes/colormaps/matplotlib-plasma.png", () => {
                        // this._updateLegend();
                        requestRender(this._view);
                    });
                } else {
                    requestRender(this._view);
                }
            },
            () => {
                console.log("There was an error loading the plume heatmap");
            }
        );
    }

    private _localOriginRender = vec3.create();
    private _size = vec3.create();
    private _data: [string, number, number, string];
    private _timeStep = 1;
    private _animating = false;
    private _updateColorMap = true;
}

const viewProj = mat4.create();
const position = vec3.create();