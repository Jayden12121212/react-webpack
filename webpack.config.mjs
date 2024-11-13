import Path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";

const isProduction = process.env.NODE_ENV === "production";

export default {
  entry: "./src/index.tsx",

  mode: isProduction ? "production" : "development",

  devtool: isProduction ? false : "eval-cheap-module-source-map",

  output: {
    path: Path.resolve(process.cwd(), "build"),
    filename: "js/[name]Bundle.js",
    publicPath: "/",
    assetModuleFilename: "static/[name].[hash][ext][query]",
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },

      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },

      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/images/[name].[hash][ext]",
        },
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/fonts/[name].[hash][ext]",
        },
      },

      {
        test: /\.json$/,
        type: "json",
        parser: {
          parse: JSON.parse,
        },
      },
    ],
  },

  devServer: {
    static: {
      directory: Path.resolve(process.cwd(), "public"),
    },

    compress: true,
    port: process.env.DEV_SERVER_PORT || 3000,
    historyApiFallback: true,
    open: true,
    hot: true,
  },

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],

    alias: {
      "@": Path.resolve(process.cwd(), "src"),
    },
  },

  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },

  performance: {
    hints: isProduction ? "warning" : false,
    maxAssetSize: 300000,
    maxEntrypointSize: 300000,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
    }),

    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash].css",
    }),

    new ESLintPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
      emitWarning: true,
    }),

    !isProduction && new ReactRefreshWebpackPlugin(),
  ],
};
