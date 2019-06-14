import _ from "lodash";

export default function TVScreen(canvasId) {
    const init = () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        /** Setup the basics **/
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();

        // Since we're just projecting onto a plane, we can treat this as 2D to make it simple
        this.camera = new THREE.OrthographicCamera(
            -this.width / 2,     // left
            this.width / 2,      // right
            this.height / 2,     // top
            -this.height / 2,    // bottom
            0,              // near
            1            // far
        );
        // this.camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0, 1);
        this.scene.add(this.camera);

        // // Reposition the camera
        // this.camera.position.set(-10, 0, 0);

        // // Point the camera at a given coordinate
        // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.camera);

        // Wiring up to our canvas element and setting up renderer
        this.canvas = document.getElementById(canvasId);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: this.canvas
        });
        this.renderer.setSize(this.width, this.height);
        this.transparentScanlineBackground();

        /** Setup composer and passes */
        initComposer();
        initPasses();

        /** Get ready for some screen text **/
        this.fontLoader = new THREE.FontLoader();
        this.fontLoader.load("fonts/Kindly Rewind_Regular.json", (font) => {
            this.font = font;
        });

        // var controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // controls.target.set(0, 0, 0);
        // controls.update();

        /** Handle external events **/
        window.addEventListener('resize', onWindowResize, false);
    }

    const initComposer = () => {
        this.composer = new THREE.EffectComposer(this.renderer);
    }

    const initPasses = () => {
        if (this.composer == null) {
            console.error("No composer initialized; you need to call initComposer before the first setup of your passes");
        }

        /** Setting up passes **/
        this.renderPass = new THREE.RenderPass(this.scene, this.camera);

        this.filmPass = new THREE.FilmPass(
            0.55,        // noise intensity (color skew)
            0.75,        // scanline intensity
            500,       // scanline count
            false,      // grayscale
        );
        this.filmPass.uniforms["time"].value = 0.0;
        this.filmPass.clear = true;

        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.filmPass);
    }

    this.transparentScanlineBackground = () => {
        this.renderer.setClearColor(0xaaaaaa, 0.15);
    }

    this.opaqueScanlineBackground = () => {
        this.renderer.setClearColor(0x000000, 1);
    }

    this.addText = (channelNumber) => {
        this.textMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0x00ff00),
            side: THREE.DoubleSide
        });

        let shapes = this.font.generateShapes(channelNumber, 100);
        this.textGeometry = new THREE.ShapeBufferGeometry(shapes);
        this.textGeometry.computeBoundingBox();

        let xMid = -0.5 * (this.textGeometry.boundingBox.max.x - this.textGeometry.boundingBox.min.x);
        // this.textGeometry.translate(xMid, 0, 0);

        this.text = new THREE.Mesh(this.textGeometry, this.textMaterial);
        this.text.position.x = -this.width/2.05;
        this.text.position.y = this.height/2.7;
        this.scene.add(this.text);
    }

    this.addFlickerLines = () => {
        this.flickerGeometry = new THREE.PlaneBufferGeometry(this.width, 1);
        this.flickerMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0xffffff),
            side: THREE.FrontSide
        });
        
        let numberOfGroups = Math.round(Math.random() * 10) + 3;
        let bandHeight = Math.floor(this.height / numberOfGroups);

        let lines = []

        for (let n = 0; n < numberOfGroups; n++) {
            let bias = Math.round(Math.random() * 10)
            let bandStart = -this.height / 2 + n * bandHeight;
            let bandEnd = -this.height / 2 + (n + 1) * bandHeight;

            let bandWeight = 0;
            let bandWeightMax = Math.ceil(bandHeight * 0.4 * Math.random());
            
            console.log(`
            STARTING BAND #${n}
            BAND START: ${bandStart}
            BAND END: ${bandEnd}
            BAND HEIGHT: ${bandHeight}
            BAND WEIGHT MAX: ${bandWeightMax}
            `)
            
            for(let y = bandStart; y < bandEnd; y++) {
                
                let rand = Math.random() + 0.025 * ((bandWeightMax - bandWeight) / 2)

                if (bandWeight <= bandWeightMax && rand >= 1.2) {
                    bandWeight++;
                    let line = new THREE.Mesh(
                        this.flickerGeometry,
                        this.flickerMaterial
                    )

                    line.position.y = y
                    lines.push(line);
                    this.scene.add(line);
                } else {
                    bandWeight--;
                }
            } 
            
        }

        return lines;
    }

    this.removeFlickerLines = (lines) => {
        for(let line of lines) {
            this.scene.remove(line);
        }

        this.flickerGeometry.dispose();
        this.flickerMaterial.dispose();
    }

    this.removeText = () => {
        this.scene.remove(this.text);
        this.textGeometry.dispose();
        this.textMaterial.dispose();
    }

    const onWindowResize = _.debounce(
        () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.renderer.setSize(this.width, this.height);
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();

            initComposer();
            initPasses();
        },
        100
    );

    const animate = () => {
        requestAnimationFrame(animate);
        
        render();
    }

    const render = () => {
        let delta = this.clock.getDelta();
        this.filmPass.uniforms["time"].value += delta;

        this.composer.render(delta);
    }

    init();
    animate();
}

TVScreen.prototype.channelSwitch = function channelSwitch(channelNumber, callback) {
    this.opaqueScanlineBackground();

    let i = 1;
    let flashMax = Math.ceil(Math.random() * 5);
    
    let lines = this.addFlickerLines();
    let channelTextTimeout = null
    let flashInterval = window.setInterval( () => {
        this.removeFlickerLines(lines);
        lines = this.addFlickerLines();
        if (i > flashMax) {
            this.removeFlickerLines(lines);
            window.clearInterval(flashInterval);
            channelTextTimeout = window.setTimeout(() => {
                this.addText(channelNumber);
                window.setTimeout(() => {
                    this.transparentScanlineBackground();
                    callback();

                    window.setTimeout(() => {
                        this.removeText();
                    }, 1500);
                }, 2000);
            }, 800)
        }
        i++;
    }, 25);
}