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
