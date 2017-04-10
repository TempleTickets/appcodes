pipe.templates['59a658148de335f820e53a332025a9d0']= function diagnostic(data
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
return html("<h1>Pagelet diagnostics</h1>\n\n<pre>\n  cows\n</pre>", data || {});
};
