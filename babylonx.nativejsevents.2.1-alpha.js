var BABYLONX;
(function (BABYLONX) {
    var EventsRegister = (function () {
        function EventsRegister(_scene) {
            var _this = this;
            this._scene = _scene;
            this.onNodeAdded = function (node, position) {
                _this._generateHtmlElement(node);
                if (node instanceof BABYLON.AbstractMesh) {
                    var mesh = node;
                    mesh.actionManager = mesh.actionManager || new BABYLON.ActionManager(_this._scene);
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (evt) {
                        _this._triggerMeshEvent(evt, "mouseover");
                    }));
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt) {
                        //evt.sourceEvent will contain "which" button was pressed
                        _this._triggerMeshEvent(evt, "click");
                    }));
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (evt) {
                        _this._triggerMeshEvent(evt, "mouseout");
                    }));
                }
            };
            this.onNodeRemoved = function (node) {
                _this._removeHtmlElement(node);
            };
            this._triggerMeshEvent = function (event, eventName) {
                _this._triggerJsEvent(eventName, event, event.source['htmlId']);
            };
            this._canvasElement = this._scene.getEngine().getRenderingCanvas();
            this._scene['onNewMeshAdded'] = this.onNodeAdded;
            this._scene['onMeshRemoved'] = this.onNodeRemoved;
            this._scene['onNewCameraAdded'] = this.onNodeAdded;
            this._scene['onCameraRemoved'] = this.onNodeRemoved;
            this._scene['onNewLightAdded'] = this.onNodeAdded;
            this._scene['onLightRemoved'] = this.onNodeRemoved;
        }
        EventsRegister.prototype._triggerJsEvent = function (evt, eventData, htmlId) {
            var newEvent = document.createEvent('CustomEvent');
            newEvent.initCustomEvent(evt, true, true, eventData);
            var htmlElement = htmlId ? document.querySelector("#" + htmlId) : this._canvasElement;
            htmlElement.dispatchEvent(newEvent);
        };
        EventsRegister.prototype._generateHtmlElement = function (node) {
            var kind = this._getNodeKind(node);
            var element = document.createElement(kind);
            var htmlId = kind + "-" + node.id;
            var idNumeration = 0;
            if (document.getElementById(htmlId)) {
                while (document.getElementById(htmlId + "_" + idNumeration++)) {
                }
                htmlId = htmlId + "_" + idNumeration;
                BABYLON.Tools.Warn("Extra " + kind + " with the same id was added with html id " + htmlId);
            }
            node['htmlId'] = htmlId;
            element.id = htmlId;
            this._canvasElement.insertBefore(element, null);
            this._triggerJsEvent("nodeAdded", { kind: kind, originalId: node.id, htmlId: htmlId });
        };
        EventsRegister.prototype._removeHtmlElement = function (node) {
            var kind = this._getNodeKind(node);
            var id = node['htmlId'];
            var element = document.getElementById(id);
            element.parentElement.removeChild(element);
            this._triggerJsEvent("nodeRemoved", { kind: kind, id: id });
        };
        EventsRegister.prototype._getNodeKind = function (node) {
            if (node instanceof BABYLON.Camera)
                return "camera";
            else if (node instanceof BABYLON.Light)
                return "light";
            else
                return "mesh";
        };
        return EventsRegister;
    })();
    BABYLONX.EventsRegister = EventsRegister;
})(BABYLONX || (BABYLONX = {}));
//# sourceMappingURL=babylonx.nativejsevents.2.1-alpha.js.map