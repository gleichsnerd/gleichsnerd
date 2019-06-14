import _ from "lodash";

export default function DVDScreen(canvasId) {

    // Fundamentals
    let scene, clock, camera, canvas, renderer, composer, width, height;

    // Passes
    let renderPass, staticPass;

    function init() {
        width = window.innerWidth;
        height = window.innerHeight;

        /** Setup the basics **/
        scene = new THREE.Scene();
        clock = new THREE.Clock();

        camera = new THREE.PerspectiveCamera(
            1000,                                   // Field of view
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1,                                    // Near clipping pane
            1000                                    // Far clipping pane
        );

        // // Reposition the camera
        camera.position.set(-1, 0, 0);

        // // Point the camera at a given coordinate
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(camera);

        // Wiring up to our canvas element and setting up renderer
        canvas = document.getElementById(canvasId);
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvas,
            alpha: true
        });
        renderer.setSize(width, height);
        renderer.setClearColor(0x00ff00, 0.15);

        /** Handle external events **/
        window.addEventListener('resize', onWindowResize, false);
    }

    const onWindowResize = _.debounce(
        () => {
            width = window.innerWidth;
            height = window.innerHeight;

            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        },
        100
    );

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        let delta = clock.getDelta();

        renderer.render(scene, camera)
    }

    init();
    animate();
}