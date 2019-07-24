const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        "three-controls": [
            path.resolve(__dirname, "node_modules/three/examples/js/controls/OrbitControls.js"),
        ],
        "three-postprocessing": [
            path.resolve(__dirname, "node_modules/three/examples/js/postprocessing/EffectComposer.js"),
            path.resolve(__dirname, "node_modules/three/examples/js/postprocessing/ShaderPass.js"),
            path.resolve(__dirname, "node_modules/three/examples/js/postprocessing/RenderPass.js"),
            path.resolve(__dirname, "node_modules/three/examples/js/postprocessing/FilmPass.js"),
        ],
        "three-shaders": [
            path.resolve(__dirname, "node_modules/three/examples/js/shaders/CopyShader.js"),
            path.resolve(__dirname, "node_modules/three/examples/js/shaders/FilmShader.js"),
            path.resolve(__dirname, "deps/StaticShader.js"),
        ],
        "bundle": "./src/gleichsnerd.js",
    },
    mode: "development",
    devtool: "source-map",
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 8080
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: "./node_modules/three/build/three.js",
                to: ""
            },
            {
                from: "./deps/Kindly Rewind_Regular.json",
                to: "fonts"
            }
        ])
    ],
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks (chunk) {
                return chunk.name === "bundle";
            },
            name () {
                return "vendors";
            }
        }
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    }
};