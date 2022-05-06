// importación para usar "__"
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// Para activar el autocompletado en este mismo archivo
/** @type {import('webpack').Configuration} */

module.exports = {
  // Entrada al proyecto completo
  entry: "./src/index.js",

  output: {
    // Carpeta de salida
    path: path.resolve(__dirname, "dist"),
    // Nombre de archivo de salida
    filename: "[name].[contenthash].js",
    // Dirección
    assetModuleFilename: "assets/images/[hash][ext][query]"
  },
  resolve: {
    // Resumen de las extensiones con las que va a trabajar webpack
    extensions: [".js"],
    alias: {
      "@utils": path.resolve(__dirname, "src/utils/"),
      "@templates": path.resolve(__dirname, "src/templates/"),
      "@styles": path.resolve(__dirname, "src/styles/"),
      "@images": path.resolve(__dirname, "src/assets/images/")
    }
  },
  // para usar Babel
  module: {
    rules: [
      {
        // cualquier archivo que empiece con "m" o "js"
        test: /\.m?js$/,
        // Evita que use los node modules
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css|.styl$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"]
      },
      {
        test: /\.png/,
        type: "asset/resource"
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader:"url-loader",
          options: {
            limit: 10000,
            mimetype: "application/font-woff",
            name: "[name].[contenthash].[ext]",
            outputPath: "./assets/fonts/",
            publicPath: "../assets/fonts/",
            esModule: false,
          },
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // Inserta los elementos
      inject: true,
      // Indicamos la ruta del template
      template: "./public/index.html",
      // Como nombrará al archivo
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "assets/[name].[contenthash].css"
    }),
    new CopyPlugin({
      patterns:[
        {
          from: path.resolve(__dirname, "src", "assets/images"),
          to: "assets/images"
        }
      ]
    }),
    new Dotenv(),
    new CleanWebpackPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  }
}
