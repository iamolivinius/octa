chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.action) {
    case 'pattern-test':
      if (request.activate === true) {
        var c = request.container;

        var pattern = c.pattern;
        for (var i in c.fields) {
          var elem = c.fields[i];
          pattern = integrate(pattern, elem.field, elem.fieldname);
        }

        // find all container
        $(c.enclosing).each(function() {
          // apply pattern
          var result = $(this).applyPattern({
            structure: pattern
          });

          if (result.success) {
            var testingOverlayTemplate = Templates['testing-overlay'];

            var content = testingOverlayTemplate({
              data: result.data[0]
            });

            $(this).append(content);
          }
        });
      } else {
        // remove all testing overlays
        $('.testing-overlay').remove();
      }
      break;
  }
});
