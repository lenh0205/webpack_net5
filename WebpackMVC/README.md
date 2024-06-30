> https://jonjam.medium.com/combining-webpack-with-asp-net-mvc-5-a5bd07c49d0b
> https://www.mattburkedev.com/integrate-webpack-and-asp-dot-net-mvc-slash-webapi/ 

====================================================================

# Create an ASP.NET Web Application project
* -> create project with **`ASP.NET Web Application (.NET Framework)`** template -> MVC -> .NET Framework 4.8
* -> by default, the ASP.NET MVC template includes **`Bootstrap`** and **`jQuery`** downloaded from NuGet (_browse `NuGet` va xem nhung Installed packages_)

# Uninstall JavaScript and CSS packages from NuGet
* -> to create a `hydrid` website, we will use **npm** to manage **`js, css package`** instead of **NuGet**
* -> so we will uninstall these NuGet packages: **`bootstrap`**, **`JQuery`**, **`JQuery.Validation`**, **`Microsoft.jQuery.Unobstrusive.Validation`**, **`Modernizr`**, **`Respond`**
* => _this will make current bootstrap components (Ex: Navbar,...) die_

* -> delete **`App_Start/BundleConfig.cs`**, delete **BundleConfig** inside **`Application_Start`** of **`Global.asax.cs`** file

# Create package.json and install Node packages from 'npm'
* -> npm init -y
* -> npm install bootstrap jquery jquery-validation jquery-validation-unobtrusive
* -> npm install -D @types/bootstrap @types/jquery @types/jquery-validation-unobtrusive @types/jquery.validation awesome-typescript-loader clean-webpack-plugin css-loader extract-text-webpack-plugin file-loader html-loader html-webpack-plugin less less-loader source-map-loader style-loader typescript webpack webpack-merge
 
```json - package.json - de thong nhat ve version
{
  "dependencies": {
    "bootstrap": "^3.3.7",
    "jquery": "^3.2.1",
    "jquery-validation": "^1.17.0",
    "jquery-validation-unobtrusive": "^3.2.6"
  },
  "devDependencies": {
    "@types/bootstrap": "^3.3.36",
    "@types/jquery": "^3.2.12",
    "@types/jquery-validation-unobtrusive": "^3.2.32",
    "@types/jquery.validation": "^1.16.3",
    "awesome-typescript-loader": "^3.2.3",
    "clean-webpack-plugin": "^0.1.16",
    "css-loader": "^0.28.7",
    "extract-text-webpack-plugin": "^3.0.0",
    "file-loader": "^0.11.2",
    "html-loader": "^0.5.1",
    "html-webpack-plugin": "^2.30.1",
    "less": "^2.7.2",
    "less-loader": "^4.0.5",
    "source-map-loader": "^0.2.1",
    "style-loader": "^0.18.2",
    "typescript": "^2.5.2",
    "webpack": "^3.6.0",
    "webpack-merge": "^4.1.0"
  }
}
```

====================================================================

# Folder Structure - create "src" folder
* -> create **`src`** in the root of the ASP.NET MVC project - contains all **Typescript** and **LESS** source files
* -> move the **`Site.css`** from "Content" folder to "src" folder + change its name to **index.less** + add this to the top: **@import "../node_modules/bootstrap/less/bootstrap.less";**
* => this will make the **bootstrap classes and styles** **`available across our application`**

* -> create **`index.ts`** file inside "src" - import **`less`** and **`bootstrap`** to make all instial bootstrap component works again
```js
import "./index.less";
import "bootstrap";
```

# Modify "_Layout.cshtml" file 
* -> _following `webpack’s best practices for production`_, our **`production webpack configuration`** will **generate multiple bundles each having a unique name every time they build**
* -> `webpack` can **inject `tags` for these generated files into `a HTML file`**

* -> **rename the `_Layout.cshtml` file in Views/Shared to `_Layout_Template.cshtml`**
* -> `webpack` will **generate `_Layout.cshtml` from `_Layout_Template.cshtml`** with the **`script and link tags appended at the end of the body element`**

# Create "tsconfig.json" file
* -> to support **TypeScript compilation**, we create **a tsconfig.json** file at the root of the ASP .NET project
* -> this file **specifies the root files** and the **compiler options** required **`to compile the TypeScript files`**

```json
// https://raw.githubusercontent.com/JonJam/aspnet_with_webpack/master/AspAndWebpack/tsconfig.json
{
  "compilerOptions": {
    "strict": true, // Includes: alwaysStrict, noImplicitAny, noImplicitThis, strictNullChecks
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "allowSyntheticDefaultImports": true,
    "noEmitOnError": true,
    "sourceMap": true,
    "removeComments": true,
    "skipLibCheck": true,
    "target": "es5",
    "module": "esnext", // Could be es6 but its in case we use Dynamic import()
    "moduleResolution": "Node",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "dom",
      "es2015.promise",
      "es5"
    ]
  },
  "exclude": [
    "node_modules",
    "wwwroot",
    "obj",
    "bin"
  ]
}
```

# Create webpack configuration files
* -> create 3 files: **webpack.common.js**, **webpack.dev.js**, **webpack.prod.js**

```js - webpack.common.js
// https://raw.githubusercontent.com/JonJam/aspnet_with_webpack/master/AspAndWebpack/webpack.common.js

const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    target: "web",

    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json", ".html"],
    },

    module: {
        loaders: [
            // All files with a ".ts" or ".tsx" extension will be handled by "awesome-typescript-loader".
            { test: /.ts$/, loader: "awesome-typescript-loader" },

            // All image files will be handled here
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    "file-loader"
                ]
            },

            // All font files will be handled here
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: "file-loader"
                    }
                ]
            },

            // All files with ".html" will be handled 
            { test: /\.html$/, loader: "html-loader" },

            // All output ".js" files will have any sourcemaps re-processed by "source-map-loader".
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    plugins: ([
        // make sure we allow any jquery usages outside of our webpack modules
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        // Clean dist folder.
        new CleanWebpackPlugin(["./dist"], {
            "verbose": true // Write logs to console.
        }),

        // avoid publishing when compilation failed.
        new webpack.NoEmitOnErrorsPlugin(),

        new HtmlWebpackPlugin({
            inject: "body",
            filename: "../Views/Shared/_Layout.cshtml",
            template: "./Views/Shared/_Layout_Template.cshtml"
        })
    ]),

    // pretty terminal output
    stats: { colors: true }
};
```

```js - webpack.dev.js
// https://raw.githubusercontent.com/JonJam/aspnet_with_webpack/master/AspAndWebpack/webpack.dev.js

const path = require("path");
const webpack = require("webpack");
const Merge = require("webpack-merge");
const CommonConfig = require("./webpack.common.js");

module.exports = Merge(CommonConfig, {
    devtool: "inline-source-map",

    entry: path.resolve(__dirname, "src/index.ts"),

    output: {
        filename: "bundle.js",
        path: __dirname + "/dist",
        // Making sure the CSS and JS files that are split out do not break the template cshtml.
        publicPath: "/dist/",
        // Defining a global var that can used to call functions from within ASP.NET Razor pages.
        library: "aspAndWebpack",
        libraryTarget: "var"
    },

    module: {
        loaders: [
            // All css files will be handled here
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },

            // All files with ".less" will be handled and transpiled to css
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            }
        ]
    },

    plugins: ([
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("development")
            }
        })
    ]),
})
```

```js - webpack.prod.js
// https://raw.githubusercontent.com/JonJam/aspnet_with_webpack/master/AspAndWebpack/webpack.prod.js

const path = require("path");
const webpack = require("webpack");
const Merge = require("webpack-merge");
const CommonConfig = require("./webpack.common.js");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Images, Fonts Loading: https://webpack.js.org/guides/asset-management/
// LESS Loading: https://webpack.js.org/loaders/less-loader/
// Code splitting: https://webpack.js.org/guides/code-splitting
// Caching: https://webpack.js.org/guides/caching/

const extractLess = new ExtractTextPlugin({
    filename: "[name].[contenthash].css"
});

module.exports = Merge(CommonConfig, {
    devtool: "hidden-source-map",

    entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        vendor: [
            "jquery",
            "jquery-validation",
            "bootstrap",
            "jquery-validation-unobtrusive"
        ]
    },

    output: {
        filename: "[name].[chunkhash].js",
        path: __dirname + "/dist",
        // Making sure the CSS and JS files that are split out do not break the template cshtml.
        publicPath: "/dist/",
        // Defining a global var that can used to call functions from within ASP.NET Razor pages.
        library: "aspAndWebpack",
        libraryTarget: "var"
    },

    module: {
        loaders: [          
            // All css files will be handled here
            {
                test: /\.css$/,
                use: extractLess.extract({ fallback: "style-loader", use: ["css-loader"] })
            },

            // All files with ".less" will be handled and transpiled to css
            {
                test: /\.less$/,
                use: extractLess.extract({
                    use: [{
                        loader: "css-loader", options: {
                            sourceMap: true
                        }
                    }, {
                        loader: "less-loader", options: {
                            sourceMap: true
                        }
                    }]
                })
            },
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),

        // Split out library into seperate bundle and remove from app bundle.
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor"
        }),

        // Webpack boilerplate and manifest in seperate file.
        new webpack.optimize.CommonsChunkPlugin({
            name: "runtime"
        }),

        // Write out CSS bundle to its own file:
        extractLess,

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),

        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true
            },
            comments: false
        })
    ]
})
```

# Running webpack
* _create **`npm script`** to run webpacke; then **npm run build:dev** we will see the same starter ASP.NET site when using NuGet_
* _có thể do cache nên CSS chưa load được, ta Clean Solution rồi build lại là được_

```json - package.json
"scripts": {
    "build:dev": "webpack --config webpack.dev.js",
    "build:prod": "webpack --config webpack.prod.js"
}
```

