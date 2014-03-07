define([
  'text'
], function(text) {

  var modules = {};

  return {

    load: function(name, req, next, config) {

      // TODO: IDK why req.toUrl doesn't work here
      var url = config.baseUrl + name + '.css';

      text.get(url, function(data) {
        var source = "(function() {" +
          "var cssText = '" + text.jsEscape(data) + "';" +
          "var __s = document.createElement('style');" +
          "__s.setAttribute('type', 'text/css');" +
          "(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(__s);" +
          "if (__s.styleSheet) {" +
            "__s.styleSheet.cssText = cssText;" +
          "} else {" +
            "__s.appendChild(" +
              "document.createTextNode(cssText)" +
            ");" +
          "}" +
        "})();";
        if (config.isBuild) {
          modules[name] = source;
          return next(null);
        }

        var __s = document.createElement('style');
        __s.setAttribute('type', 'text/css');
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(__s);
        if (__s.styleSheet) { // For IE
          __s.styleSheet.cssText = data;
        } else {
          __s.appendChild(
            document.createTextNode(data)
          );
        }
        next(__s);
      });

    },

    write: function(plugin, name, write) {
      write('define("' + plugin + '!' + name +
        '",function(){return ' +
        modules[name] + '});');
    }

  };

});
