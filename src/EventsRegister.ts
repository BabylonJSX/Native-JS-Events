module BABYLONX {

    export class EventsRegister {

        private _canvasElement: HTMLCanvasElement;

        public eventKinds: Array<String>;

        constructor(private _scene: BABYLON.Scene) {
            this._canvasElement = this._scene.getEngine().getRenderingCanvas();
            this._scene['onNewMeshAdded'] = this.onNodeAdded;
            this._scene['onMeshRemoved'] = this.onNodeRemoved;
            this._scene['onNewCameraAdded'] = this.onNodeAdded;
            this._scene['onCameraRemoved'] = this.onNodeRemoved;
            this._scene['onNewLightAdded'] = this.onNodeAdded;
            this._scene['onLightRemoved'] = this.onNodeRemoved;
        }

        public onNodeAdded = (node: BABYLON.Node, position: number) => {
            this._generateHtmlElement(node);
            if (node instanceof BABYLON.AbstractMesh) {
                var mesh = <BABYLON.AbstractMesh> node; 
                mesh.actionManager = mesh.actionManager || new BABYLON.ActionManager(this._scene);
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger,(evt) => {
                    this._triggerMeshEvent(evt, "mouseover");
                })); 

                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,(evt) => {
                    //evt.sourceEvent will contain "which" button was pressed
                    this._triggerMeshEvent(evt, "click");
                }));

                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger,(evt) => {
                    this._triggerMeshEvent(evt, "mouseout");
                }));
            }
        }

        public onNodeRemoved = (node: BABYLON.Node) => {
            this._removeHtmlElement(node);
        }

        private _triggerMeshEvent = (event: BABYLON.ActionEvent, eventName:string) => {
            this._triggerJsEvent(eventName, event, event.source['htmlId']);
        }

        private _triggerJsEvent(evt: string, eventData: any, htmlId?: string) {
            var newEvent: CustomEvent = <CustomEvent> document.createEvent('CustomEvent');
            newEvent.initCustomEvent(evt /*+ "_babylon"*/, true, true, eventData);
            var htmlElement = htmlId ? document.querySelector("#" + htmlId) : this._canvasElement;
            htmlElement.dispatchEvent(newEvent);
        }

        private _generateHtmlElement(node: BABYLON.Node) {
            
            var kind = this._getNodeKind(node);
            var element: HTMLElement = document.createElement(kind);
            var htmlId = kind + "-" + node.id;
            var idNumeration = 0;
            if (document.getElementById(htmlId)) {
                while (document.getElementById(htmlId + "_" + idNumeration++)) {
                    //search for the next available ID for this node is
                }
                htmlId = htmlId + "_" + idNumeration;
                BABYLON.Tools.Warn("Extra " + kind + " with the same id was added with html id " + htmlId);
            }
            node['htmlId'] = htmlId;
            element.id = htmlId;
            this._canvasElement.insertBefore(element, null);
            this._triggerJsEvent("nodeAdded", { kind: kind, originalId: node.id, htmlId: htmlId });
        }

        private _removeHtmlElement(node: BABYLON.Node) {
            var kind = this._getNodeKind(node);
            var id = node['htmlId'];
            var element = document.getElementById(id);
            element.parentElement.removeChild(element);
            this._triggerJsEvent("nodeRemoved", { kind: kind, id: id });
        }

        private _getNodeKind(node: BABYLON.Node): string {
            if (node instanceof BABYLON.Camera) return "camera";
            else if (node instanceof BABYLON.Light) return "light";
            else return "mesh";
        }

    }

}