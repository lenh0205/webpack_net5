> create a framework-neutral setup with an experience independent of ASP.NET version
> using webpack4, ASP.NET MVC 5, webpack-dev-server, Hot Module Replacement (HMR)

======================================================================================
# Setup "webpack" in project
* -> npm init -y
* -> npm install webpack webpack-cli --save-dev

* -> add **npm script** for running webpack: 
```js
"scripts": {
  "build": "webpack"
}
```

* -> add **webpack.config.js** file at root of project to **`build our javascript application`** and **`output in into "./dist" folder`**
```js
module.exports = {
  entry: "./Scripts/main.js"
};
```

# Reference webpack's output in ASP.NET
* -> to **`reference webpack's output in ASP.NET`**, install Node package **razor-partial-views-webpack-plugin** 
* -> this plugin **`extends webpack's build`** with capability to **generate Razor views from webpack assets**

```js - webpack.config.js
const RazorPartialViewsWebpackPlugin = require("razor-partial-views-webpack-plugin");

module.exports = {
  entry: "./Scripts/main.js",
  output: {
    // runtime asset location
    publicPath: "/dist/"
  },
  plugins: [
    new RazorPartialViewsWebpackPlugin({
      rules: [{
        // view for default chunk
        name: "main",
        template: {
          // Razor directive
          header: "@inherits System.Web.Mvc.WebViewPage"
        }
      }]
    })
  ]
};
```

* -> we'll config **webpack.config.js** for webpack build to outputs a file with name **`main.cshtml`** - this is **a partial view** with the content is **a script tag referencing webpack's built JavaScript file**
```js - main.cshtml
@inherits System.Web.Mvc.WebViewPage

<script type="text/javascript"
  src="/dist/main.js"></script>
```

* -> finally, reference the generated view in ASP.NET MVC's **_Layout.cshtml**
```js - _Layout.cshtml
<body>
  <!-- ... -->
  @Html.Partial("~/dist/main.cshtml")
</body>
```

# Enhance development experience with webpack - using "webpack-dev-server"
* -> the _webpack-dev-server_ provides **automatic page refresh** and **hot swapping of modules**
* => saves us from **`restarting the whole application after code updates`**
* => so we'll use it to **serving webpack's assets** 

* _npm install -D webpack-dev-server_
```json - package.json
"scripts": {
  "start": "webpack-dev-server --hot",
  "build": "webpack"
}
```

* _update webpack.config.js to **`include devServer`** and **signal that assets no longer are served from `./dist` folder**_
* _this configuration also function as **scaffolding for partial views used in ASP.NET**_
```js - webpack.config.js
output: {
  // assets served by webpack-dev-server
  publicPath: "https://localhost:8080/"
},
devServer: {
  // output assets to disk for ASP.NET
  writeToDisk: true,
  // clearly display errors
  overlay: true,
  // include CORS headers
  headers: {
    "Access-Control-Allow-Origin": "*"
  },
  // use self-signed certificate
  https: true
}
```

## Issue
* -> now if we run **`npm start`** to start our ASP.NET web application; the DevTool will notify us _Loading failed for the <script> with source "https://localhost:8080/main.js"_
* -> the reason for the error, is the **browser not trusting the development server's self-signed certificate**
* -> to **`temporary fix this`**, we can **browse to https://localhost:8080/ to accept the certificate**

* -> now, browse back to the web application; in the development console; we should have _webpack's development server_ **`signaling Hot Module Replacement enabled`** and **`Live Reloading enabled`**
* _try to make a JavaScript update and we'll see the browser refresh_