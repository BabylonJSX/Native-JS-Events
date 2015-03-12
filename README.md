#BabylonJS Native JS Events

This BabylonJS (2.1 and up) extension allows the user to register native javascript events to babylon meshes.

##Why do I need this?
Yes, you can actually do it yourself! This extension is no magic. It uses Babylon's ActionManager to trigger native JS events.

This was created for people who work with external developers who do not want to deal with Babylon's actions. They want to use their known and beloved jQuery event registration.

Using this extension it will be easier to interact with the html part of your game/application.

##Demo?

Can be found here - http://my-cac.com/babylon/

The table on the right is populated dynamically. Hovering about meshes and clicking on them will update the meshes' table. This is all done using jQuery and bootstrap.

##Usage

* Add the extension after BabylonJS's javasciprt file:

```html
<script src="../vendor/babylon.2.1-alpha.debug.js"></script>
<script src="../babylonx.nativejsevents.2.1-alpha.js"></script>
```

* initialize the event register class after creating the scene:

```javascript
var scene = myWonderfulSceneCreationMethod();
var nativeEventsHandler = new BABYLONX.EventsRegister(scene);
```

* Register the events (documented below).

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

Just like nodeAdded, nodeRemoved is triggered after a node is removed from the babylon scene.

The event detail element will contain:

* kind : string - the kind of node that was removed (mesh, light, camera)
* originalId : string - the original id of the babylon node
* htmlId : the id of the html tag that was created for this node. 

##Suggestions?

If you need something specific please contact me.

##MIT License

Copyright (c) 2014-2015 Raanan Weber (info@raananweber.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


