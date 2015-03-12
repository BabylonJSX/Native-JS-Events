#BabylonJS Native-JS-Events

This BabylonJS (2.1 and up) extension allows the user to register native javascript events to babylon meshes.

##Supported events:

* click
* mouseover
* mouseout
* nodeAdded
* nodeRemoved

##How does it work?

The extension adds HTML elements to the DOM with an ID that correlates to the ID given to the babylon mesh.

A mesh added will look roughly like this (assuming the mesh's id is "sphereObject"):

`<mesh id="mesh-sphereObject"></mesh>`

A Front-end developer can then register an event (for example using jQuery):

```javascript
$("#mesh-sphereObject").on("click", function(event) {
    console.log(event);
})
```

Or, if you want to check for clicks for all meshes:

```javascript
$("mesh").on("click", function(event) {
    // do whatever you want here
})
```

##The event types and event object

The event delivered to the callback is a CustomEvent. The extra information (delivered from this extension) is located at event.detail (using jQuery it would be event.originalEvent.detail).

The detail Object will be a Babylon ActionEvent, if the events click, mouseover and mouseout. More information about the ActionEvent can be found here - http://doc.babylonjs.com/page.php?p=24909

Every ActionEvent will include:

* sourceEvent - The original JavaScript event that triggered the action on this mesh
* source - the actual BabylonJS mesh object that the event was triggered on
* pointerX / pointerY - the mouse/tap position when this event was triggered.

###click

The click event is triggered when a user clicks (left, right and center) or taps on a mesh. The ActionEvent delivered will also include the original javascript event that triggered this ActionEvent.

If you want to check whether it was a right click or a left click do that (again, jQuery):

```javascript
$("mesh").on("click", function(event) {
    var originalEvent = event.originalEvent.detail.sourceEvent;
    if(originalEvent.which===1) {
        //Left Click
    } else if(originalEvent.which===3) {
        //Right Click
    }
});
```

For meshes only!

### mouseover / mouseout

Those events will be triggered when the user's mouse is over the mesh or out of its borders.

They are only triggered once!

For meshes only!

### nodeAdded

This event is triggered by the canvas element itself.

The event is triggered when a new node (mesh, camera, light) was added to the scene. The detail object in this case is not(!) an ActionEvent. it includes the following information:

* kind : string - the kind of node that was added (mesh, light, camera)
* originalId : string - the original id of the babylon node
* htmlId : the id of the html tag that was created for this node. This id can be used to register the other kinds of events.

Example (vanilla JS for a change):

```javascript
document.getElementById("renderCanvas").addEventListener("nodeAdded", function (event) {
    //register click, if it's a mesh:
    if(event.detail.kind==="mesh") {
        document.getElementById(event.detail.htmlId).onclick = function(clickActionEvent) {
            //do something after a mesh was clicked
        }
    }
}, false);
```

### nodeRemoved

Just like nodeAdded, nodeRemoved is triggered when a node is removed from the babylon scene.

The event detail element will contain:

* kind : string - the kind of node that was removed (mesh, light, camera)
* originalId : string - the original id of the babylon node
* htmlId : the id of the html tag that was created for this node. This id can be used to register the other kinds of events.




