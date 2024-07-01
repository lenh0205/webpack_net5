const RazorPartialViewsWebpackPlugin = require("razor-partial-views-webpack-plugin");

module.exports = {
    entry: "./Scripts/main.js",
    output: {
        //publicPath: "/dist/" // normal
         publicPath: "http://localhost:8080/" // using webpack-dev-server to serve assets
    },
    devServer: {
        writeToDisk: true, // output assets to disk for ASP.NET
        overlay: true, // clearly display errors
        headers: {
            "Access-Control-Allow-Origin": "*" // include CORS headers
        },
        https: true // use self-signed certificate
    },
    //plugins: [
    //    new RazorPartialViewsWebpackPlugin({
    //        rules: [{
    //            // view for default chunk
    //            name: "main",
    //            template: {
    //                // Razor directive
    //                header: "@inherits System.Web.Mvc.WebViewPage"
    //            }
    //        }]
    //    })
    //]
};