pipe.templates['32941c1e2eaba9216f8d96c02a0542cb']= function (data
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
return html("<h1>500, Internal server error</h1>\n\n<p>{message}</p>\n<pre>{stack}</pre>\n\n<div data-pagelet=\"diagnostics\"></div>", data || {});
};
