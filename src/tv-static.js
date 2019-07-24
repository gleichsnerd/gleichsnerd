import _ from "lodash";

export default function TVStatic(canvasId) {

    // Fundamentals
    let scene, clock, camera, canvas, renderer, composer, width, height;

    // Passes
    let renderPass, staticPass, copyPass;

    function init() {
        width = window.innerWidth;
        height = window.innerHeight;

        /** Setup the basics **/
        scene = new THREE.Scene();
        clock = new THREE.Clock();

        camera = new THREE.PerspectiveCamera(
            1000,                                   // Field of view
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1,                                  // Near clipping pane
            1000                                  // Far clipping pane
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
        renderer.setClearColor(0x0a0a0a, 1);

        /** Setup composer and passes */
        initComposer();
        initPasses();

        /** Handle external events **/
        window.addEventListener('resize', onWindowResize, false);
    }

    function initComposer() {
        if(composer != null) {
            composer.reset();
        } else {
            composer = new THREE.EffectComposer(renderer);
        }
    }

    function initPasses(reset = false) {
        if(composer == null) {
            console.error("No composer initialized; you need to call initComposer before the first setup of your passes");
        }

        /** Setting up passes **/
        if(renderPass == null || reset) {
            renderPass = new THREE.RenderPass(scene, camera);
        }

        if(staticPass == null || reset) {
            staticPass = new THREE.ShaderPass(THREE.StaticShader);
        }

        staticPass.uniforms["amount"].value = 0.5;
        staticPass.uniforms["size"].value = 1.0;
        staticPass.uniforms["time"].value = 0.0;
        staticPass.renderToScreen = true;

        composer.addPass(renderPass);
        composer.addPass(staticPass);
    }

    const onWindowResize = _.debounce(
        () => {
            width = window.innerWidth;
            height = window.innerHeight;

            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            initComposer();
            initPasses();
        },
        100
    );

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        let delta = clock.getDelta();
        staticPass.uniforms["time"].value += delta;

        composer.render(delta);
    }

    function resetPassesOverTime() {
        
        window.setInterval(function() {
            console.log("refresh")
            initComposer();
            initPasses(true);
        }, 60000)
    }

    init();
    animate();
    resetPassesOverTime();
}