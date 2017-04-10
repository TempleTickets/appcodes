pipe.templates['0c797c3d6f879ce02045f7f2cd3863dd']= function (data
/**/) {
function html(template, data, key) {
  var has = Object.prototype.hasOwnProperty;

  for (key in data) {
    if (has.call(data, key)) {
      //
      // Prevent
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
      // from messing up the content.
      //
      template = template.replace(new RegExp('{'+ key +'}','g'), function hack() {
        return data[key];
      });
    }
  }

  return template;
}
return html("<h1>404, page not found</h1>\n<div data-pagelet=\"diagnostics\"></div>", data || {});
};
