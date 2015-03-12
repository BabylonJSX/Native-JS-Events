$(function () {

    //vanilla JS example
    document.getElementById("renderCanvas").addEventListener("nodeAdded", function (event) {
        //register click, if it's a mesh:
        if (event.detail.kind === "mesh") {
            document.getElementById(event.detail.htmlId).onclick = function (clickActionEvent) {
                //do something!
            }
        }
    }, false);

    //jQuery - Add nodeAdded event to fetch all added nodes.
    $("#renderCanvas").on("nodeAdded", function (evt) {
        //the original details sent from babylon
        var details = evt.originalEvent.detail

        //just some jquery magic :-)
        var newLi = $("<li></li>").addClass("list-group-item").append($("<span></span>").addClass("badge").text("0")).append($("<span></span>").text(details.originalId));
        if (details.kind === "mesh") {
            //adding the events.
            $("#" + details.htmlId).on("mouseover", function (evt) {
                //pointOver will set the class active
                newLi.addClass("active")
            }).on("mouseout", function (evt) {
                //pointOut will remove the active class
                newLi.removeClass("active")
            }).on("click", function (evt) {
                //pick will increase the number in the badge
                var badge = newLi.find(".badge");
                var badgeInt = parseInt(badge.text()) + 1;
                badge.text("" + (badgeInt));
            });
            $("#meshes").append(newLi);
        } else {
            $("#" + details.kind + "s").append(newLi);
        }
    });

    //Now the babylon stuff!

    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var createScene = function () {
        var scene = new BABYLON.Scene(engine);

        

        //Camera
        var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 8, 50, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        //Setting up the light
        var light = new BABYLON.HemisphericLight("Hemispheric", new BABYLON.Vector3(0, 1, 0), scene);

        //Now start adding meshes.
        var box = BABYLON.Mesh.CreateBox("box", 6.0, scene);
        var sphere = BABYLON.Mesh.CreateSphere("sphere", 10.0, 10.0, scene);
        var plan = BABYLON.Mesh.CreatePlane("plane", 10.0, scene);
        var cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 3, 3, 3, 6, 1, scene, false);
        var torus = BABYLON.Mesh.CreateTorus("torus", 5, 1, 10, scene, false);
        var knot = BABYLON.Mesh.CreateTorusKnot("knot", 2, 0.5, 128, 64, 2, 3, scene);
        var lines = BABYLON.Mesh.CreateLines("lines", [
            new BABYLON.Vector3(-10, 0, 0),
            new BABYLON.Vector3(10, 0, 0),
            new BABYLON.Vector3(0, 0, -10),
            new BABYLON.Vector3(0, 0, 10)
        ], scene);

        box.position = new BABYLON.Vector3(-10, 0, 0);
        sphere.position = new BABYLON.Vector3(0, 10, 0);
        plan.position.z = 10;
        cylinder.position.z = -10;
        torus.position.x = 10;
        knot.position.y = -10;

        return scene;
    }

    var scene = createScene();

    //Register the event register handler.
    var nativeEventsHandler = new BABYLONX.EventsRegister(scene);

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });

});