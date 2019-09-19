var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/renderers", "esri/geometry/SpatialReference", "esri/renderers/visualVariables/ColorVariable", "esri/views/3d/externalRenderers", "gl-matrix"], function (require, exports, renderers_1, SpatialReference_1, ColorVariable_1, externalRenderers_1, gl_matrix_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    SpatialReference_1 = __importDefault(SpatialReference_1);
    ColorVariable_1 = __importDefault(ColorVariable_1);
    exports.dataSets = {
        Probabilities: ['heatmap', 0, 20, "ppm"]
    };
    var localUrl = "../plumes";
    gl_matrix_1.glMatrix.ARRAY_TYPE = Float64Array;
    var VolumeRenderer = /** @class */ (function () {
        // constructor(private _view: SceneView, private _legendLayer: FeatureLayer) {}
        function VolumeRenderer(_view) {
            this._view = _view;
            this._localOriginRender = gl_matrix_1.vec3.create();
            this._size = gl_matrix_1.vec3.create();
            this._timeStep = 1;
            this._animating = false;
            this._updateColorMap = true;
        }
        VolumeRenderer.prototype.setup = function (context) {
            // Set up the state
            var renderer = new renderers_1.SimpleRenderer();
            renderer.visualVariables = [new ColorVariable_1.default({ field: "attr" })];
            // this._legendLayer.renderer = renderer;
            this.data = "heatmap";
            setupGL(context.gl);
            // Origin of data
            var min = [97.799684, -30.356806, 1];
            var max = [97.799419, -30.356485, 5];
            // Translate into render coordinate system
            externalRenderers_1.toRenderCoordinates(this._view, min, 0, SpatialReference_1.default.WGS84, min, 0, 1);
            externalRenderers_1.toRenderCoordinates(this._view, max, 0, SpatialReference_1.default.WGS84, max, 0, 1);
            gl_matrix_1.vec3.subtract(this._size, max, min);
            var position = gl_matrix_1.vec3.create();
            gl_matrix_1.vec3.add(position, min, max);
            gl_matrix_1.vec3.scale(position, position, 0.5);
            externalRenderers_1.toRenderCoordinates(this._view, [0, 0, 0], 0, this._view.spatialReference, this._localOriginRender, 0, 1);
            gl_matrix_1.vec3.subtract(this._localOriginRender, this._localOriginRender, position);
            this._localOriginRender[2] += max[2];
        };
        VolumeRenderer.prototype.render = function (context) {
            var eye = gl_matrix_1.vec3.fromValues(context.camera.eye[0], context.camera.eye[1], context.camera.eye[2]);
            // Move to data origin
            gl_matrix_1.vec3.subtract(position, eye, this._localOriginRender);
            gl_matrix_1.mat4.identity(viewProj);
            gl_matrix_1.mat4.translate(viewProj, viewProj, this._localOriginRender);
            gl_matrix_1.mat4.multiply(viewProj, context.camera.viewMatrix, viewProj);
            gl_matrix_1.mat4.multiply(viewProj, context.camera.projectionMatrix, viewProj);
            // Raycast the volume and reset state
            draw(viewProj, position);
            context.resetWebGLState();
        };
        Object.defineProperty(VolumeRenderer.prototype, "data", {
            // Set the data
            set: function (name) {
                this._data = exports.dataSets[name];
                this._updateColorMap = true;
                this._loadVolume();
            },
            enumerable: true,
            configurable: true
        });
        VolumeRenderer.prototype._loadVolume = function () {
            var _this = this;
            var filename = "./plumes/heatmap_145x179x20x_uint8.raw";
            selectVolume(filename, this._size, function () {
                if (_this._updateColorMap) {
                    _this._updateColorMap = false;
                    selectColormap("./plumes/colormaps/matplotlib-plasma.png", function () {
                        // this._updateLegend();
                        externalRenderers_1.requestRender(_this._view);
                    });
                }
                else {
                    externalRenderers_1.requestRender(_this._view);
                }
            }, function () {
                console.log("There was an error loading the plume heatmap");
            });
        };
        return VolumeRenderer;
    }());
    exports.VolumeRenderer = VolumeRenderer;
    var viewProj = gl_matrix_1.mat4.create();
    var position = gl_matrix_1.vec3.create();
});
//# sourceMappingURL=VolumeRenderer.js.map