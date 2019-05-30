import _ from "lodash";

export default function TVScreen(canvasId) {
    // Fundamentals
    let scene, camera, canvas, renderer, composer, width, height;

    // Passes
    let renderPass, filmPass, copyPass;

    // Time management
    let lastAnimateTime = Date.now().valueOf();

    function init() {
        width = window.innerWidth;
        height = window.innerHeight;

        /** Setup the basics **/
        scene = new THREE.Scene();

        // Since we're just projecting onto a plane, we can treat this as 2D to make it simple
        camera = new THREE.OrthographicCamera(
            60,             // FOV
            width / height, // Aspect ratio
            0,              // Near clip
            1,              // Far clip
        );
        scene.add(camera);

        // Wiring up to our canvas element and setting up renderer
        canvas = document.getElementById(canvasId);
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: canvas
        });
        renderer.setSize(width, height);
        renderer.setClearColor(0xffffff, 0.4);

        /** Setup composer and passes */
        initComposer();
        initPasses();

        /** Handle external events **/
        window.addEventListener('resize', onWindowResize, false);
    }

    function initComposer() {
        composer = new THREE.EffectComposer(renderer);
    }

    function initPasses() {
        if (composer == null) {
            console.error("No composer initialized; you need to call initComposer before the first setup of your passes");
        }

        /** Setting up passes **/
        renderPass = new THREE.RenderPass(scene, camera);

        filmPass = new THREE.FilmPass(
            0.3,        // noise intensity
            1,          // scanline intensity
            1000,       // scanline count
            false,      // grayscale
        );
        filmPass.uniforms["time"].value = 0.0;

        copyPass = new THREE.ShaderPass(THREE.CopyShader);
        copyPass.renderToScreen = true;

        composer.addPass(renderPass);
        composer.addPass(filmPass);
        composer.addPass(copyPass);
    }

    function channelSwitch() {
        // TODO - Move this to its own file which will mount to another canvas
        const planeGeometry = new THREE.PlaneGeometry(width, 1);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        scene.add(planeMesh)
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
        let now = Date.now().valueOf();
        let delta = (now - lastAnimateTime) / 1000;
        lastAnimateTime = now;

        filmPass.uniforms["time"].value += delta;

        requestAnimationFrame(animate);
        composer.render(delta);
    }

    init();
    animate();
}