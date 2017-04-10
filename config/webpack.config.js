const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const assignIn = require("lodash").assignIn;
const webpackPostcssTools = require("webpack-postcss-tools");
const BundleTracker = require("webpack-bundle-tracker");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

function extsToRegExp(exts) {
  return new RegExp(`\\.(${exts.map(ext => ext.replace(/\./g, "\\.")).join("|")})(\\?.*)?$`);
}

function loadersByExtension(obj) {
  const loaders = [];

  function createEntry(exts, value) {
    const entry = {
      extensions: exts,
      test: extsToRegExp(exts)
    };

    if (Array.isArray(value)) {
      entry.loaders = value;
    } else if (typeof value === "string") {
      entry.loader = value;
    } else {
      Object.keys(value).forEach(valueKey => {
        entry[valueKey] = value[valueKey];
      });
    }

    return entry;
  }

  Object.keys(obj).forEach(key => {
    const exts = key.split("|");
    let value = obj[key];

    if (!Array.isArray(value)) {
      value = [value];
    }

    value.forEach(v => loaders.push(createEntry(exts, v)));
  });

  return loaders;
}

module.exports = options => {
  const root = path.join(__dirname, "..", "client");

  const devtool = options.production ? "source-map" : "inline-source-map";

  const entry = {
    app: ["../client/index.jsx"],
    sass: ["../client/sass/main.scss"],
    style: ["../client/css/index.css"],
    vendor: [
      "react",
      "react-router",
      "react-redux",
      "react-router-redux",
      "newforms",
      "moment"
    ]
  };

  const hotEntry = [
    "webpack-dev-server/client?http://localhost:3000",
    "webpack/hot/only-dev-server"
  ];

  Object.keys(entry).forEach(ext => {
    if (options.hotComponents) {
      entry[ext] = hotEntry.concat(entry[ext]);
    }
  });

  const loaders = {
    "js|jsx": {
      loader: "babel",
      include: root
    },
    "json": {
      loader: "json-loader"
    },
    "png|jpg|jpeg|gif|svg": {
      loader: "url-loader?limit=10000"
    }
  };

  const cssModulesConfig = {
    modules: options.cssModules,
    localIdentName: options.production ? "[hash:base64:5]" : "[name]___[local]___[hash:base64:5]",
    importLoaders: 1,
    restructuring: false,
    compatibility: true
  };

  const cssLoader = `css?${JSON.stringify(cssModulesConfig)}`;

  const sassLoader = `sass?includePaths[]=${path.resolve(__dirname, "../node_modules/compass-mixins/lib")}`;

  const stylesheetLoaders = {
    "css": [{
      loaders: ["style", cssLoader, "postcss"],
      include: root
    }, {
      loaders: ["style", "css"],
      include: path.join(__dirname, "..", "node_modules")
    }],
    "scss|sass": {
      loaders: ["style", "css", sassLoader],
      include: root
    }
  };

  // Build mapping of CSS variables
  const cssMaps = {
    vars: {},
    media: {},
    selector: {}
  };

  glob.sync(`${root}/css/**/*.css`).map(webpackPostcssTools.makeVarMap).forEach(map => {
    for (const name in cssMaps) {
      if (Object.prototype.hasOwnProperty.call(cssMaps, name)) {
        assignIn(cssMaps[name], map[name]);
      }
    }
  });

  const cssnextConfig = {
    features: {
      customProperties: {
        variables: cssMaps.vars
      },
      customMedia: {
        extensions: cssMaps.media
      }
    },
    import: {
      path: [path.join(root, "css")]
    },
    compress: false
  };

  const additionalLoaders = [];

  const preLoaders = {
    "js|jsx": {
      loader: "eslint",
      include: root,
      options: {
        failOnError: true,
      }
    }
  };

  const alias = {
    "techbikers": root,
    "static": path.join(__dirname, "..", "public")
  };

  const externals = [];

  const modulesDirectories = [
    "node_modules"
  ];

  const extensions = [
    "",
    ".js",
    ".jsx",
    ".json",
    ".css",
    ".scss"
  ];

  const publicPath = options.devServer ? "http://localhost:3000/static/bundles/" : "/static/bundles/";

  const output = {
    path: path.join(__dirname, "..", "public", "bundles"),
    publicPath,
    filename: "[name]-[hash].js"
  };

  const plugins = [
    new BundleTracker({ filename: options.production ? "./webpack-stats-prod.json" : "./webpack-stats.json" }),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify(options.production ? "production" : "development")
      }
    })
  ];

  if (options.separateStylesheet) {
    plugins.push(
      new ExtractTextPlugin("[name].css")
    );
  }

  if (options.production) {
    plugins.push(
      new webpack.NoErrorsPlugin(),
      new webpack.ExtendedAPIPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin()
    );
  }

  if (options.minimize) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        mangle: false,
        compressor: { warnings: false }
      })
    );
  }

  return {
    context: __dirname,
    devtool,
    entry,
    output,
    module: {
      // preLoaders: [].concat(loadersByExtension(preLoaders)),
      loaders: [].concat(loadersByExtension(loaders)).concat(loadersByExtension(stylesheetLoaders)).concat(additionalLoaders),
      noParse: []
    },
    postcss: () => [
      require("postcss-import")({
        path: root,
        addDependencyTo: webpack
      }),
      require("postcss-each"),
      require("postcss-url")(),
      require("postcss-cssnext")(cssnextConfig),
      require("postcss-browser-reporter")(),
      require("postcss-reporter")(),
    ],
    externals,
    resolve: {
      root,
      modulesDirectories,
      extensions,
      alias
    },
    plugins
  };
};
