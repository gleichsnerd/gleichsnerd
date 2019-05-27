const THREE = require("three")(["OrbitControls"]);
const { OrbitControls } = require("three/examples/jsm/controls/OrbitControls");


module.exports = function TVStatic(canvasId) {
    console.log("TV STATIC WARMING UP, CANVAS ID:", canvasId);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth/window.innerHeight,
        0.1,
        1000
    );
    console.log("canvas id", canvasId);
    console.log("canvas by tag", document.getElementsByTagName("canvas"))
    console.log("canvas by id", document.getElementById("tv-static"))
    const canvas = document.getElementById(canvasId);
    
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvas
    });

    camera.position.set(5, 5, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0xeeeeee);

    let plane = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 5, 5, 5),
        new THREE.MeshBasicMaterial({
            color: 0x222222,
            wireframe: true
        })
    );
    plane.rotateX(Math.PI / 2);
    scene.add(plane);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", function(){ renderer.render(scene, camera); });

    renderer.render(scene, camera);

    


}