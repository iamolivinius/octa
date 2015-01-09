var convertNodeToXML = function convertNodeToXML($node, content) {
  var tagname = $node.prop('tagName').toLowerCase();

  var xml = '<' + tagname + '>';
  if (content) {
    xml += $node.html();
  } else {
    $node.children().each(function() {
      xml += convertNodeToXML($(this), content);
    });
  }
  xml += '</' + tagname + '>';

  return xml;
};

var convertNodeToPath = function convertNodeToPath($node) {
  var list = [];
  while ($node.prop('tagName') !== 'HTML') {
    list.push($node.prop('tagName'));

    $node = $node.parent();
  }

  return list.reverse().join(' ');
};

// var integrate = function integrate(container, field, name) {
//   var $container = $(container);

//   var split = field.split(' ').reverse();

//   $container.find(split.shift()).each(function () {
//     var $node = $(this);

//     var $iter = $node.parent();
//     var elem = split.shift();
//     while (split.length > 0 && $iter.prop('tagName') !== undefined && $iter.prop('tagName') === elem) {
//       $iter = $iter.parent();
//       elem = split.shift();
//     }

//     if ($iter.prop('tagName') === undefined || split.length === 0) {
//       $node.html('{' + name + '}');
//     }
//   });

//   return convertNodeToXML($container, true);
// };

var selector = '<div id="selector"><div id="selector-top"></div><div id="selector-left"></div><div id="selector-right"></div><div id="selector-bottom"></div></div>';

var deactivate = function deactivate() {
  // remove selector
  $('#selector').remove();

  // unbind 'mousemove' event handler
  $(document).unbind('mousemove');

  // unbind 'click' event handler
  $(document).unbind('click', process);
};

var select = function select(event) {
  /*
   * Method taken from Connor on stackoverflow.com
   * URL: http://stackoverflow.com/questions/2399797/18675415#18675415
   */

  // selector elements
  var elements = {
    top: $('#selector-top'),
    left: $('#selector-left'),
    right: $('#selector-right'),
    bottom: $('#selector-bottom')
  };

  // skip invalid targets
  if (event.target.id.indexOf('selector') !== -1 || event.target.tagName === 'BODY' || event.target.tagName === 'HTML') {
    return;
  }

  // extract target object
  var $target = $(event.target);

  // get offset and calculate width and height
  var offset = $target[0].getBoundingClientRect(),
    width = offset.width,
    height = offset.height;

  // position selector frame elements
  elements.top.css({
    left: (offset.left - 4),
    top: (offset.top - 4),
    width: (width + 5)
  });

  elements.bottom.css({
    left: (offset.left - 3),
    top: (offset.top + height + 1),
    width: (width + 4)
  });

  elements.left.css({
    left: (offset.left - 5),
    top: (offset.top - 4),
    height: (height + 8)
  });

  elements.right.css({
    left: (offset.left + width + 1),
    top: (offset.top - 4),
    height: (height + 8)
  });
};

var process = function process(event) {
  console.log('Processing started: ');
  console.log(event);
  // stop event propagation and default events
  event.stopImmediatePropagation();
  event.preventDefault();

  // deactivate selection
  deactivate();

  // wrap event target node
  var $target = $(event.target);

  switch (event.data.mode) {
    case 'container':
      // convert target node to XML
      var xml = convertNodeToXML($target, false);

      // get enclosing class or id
      var enclosingClasses = $target.parent().prop('class');
      var enclosingId = $target.parent().prop('id');

      // choose appropriate identifier for parent
      var enclosing = null;
      if (!enclosingClasses) {
        if (!enclosingId) {
          enclosing = convertNodeToPath($target.parent());
        } else {
          enclosing = '#' + enclosingId;
        }
      } else {
        enclosing = '.' + enclosingClasses.split(' ').join('.');
      }

      // add tag name to enclosing
      enclosing += ' ' + $target.prop('tagName').toLowerCase();

      // send request to creator page
      chrome.runtime.sendMessage({
        action: 'add',
        type: 'container',
        container: xml,
        enclosing: enclosing
      });
      break;
    case 'field':
      // convert target node to selector path
      var path = convertNodeToPath($target);

      // send request to creator page
      chrome.runtime.sendMessage({
        action: 'add',
        type: 'field',
        field: path,
        cid: event.data.cid
      });
      break;
    case 'trigger':
      // get class of target node
      var classNames = $target.prop('class');

      // get id of target node
      var id = $target.prop('id');

      // determine trigger
      var _trigger = null;

      if (!classNames) {
        if (!id) {
          _trigger = convertNodeToPath($target);
        } else {
          _trigger = '#' + id;
        }
      } else {
        // convert trigger to classes
        _trigger = '.' + classNames.split(' ').join('.');
      }

      // send request to creator page
      chrome.runtime.sendMessage({
        action: 'add',
        type: 'trigger',
        trigger: _trigger,
        cid: event.data.cid
      });
      break;
  }
};

chrome.runtime.onMessage.addListener(function(request) {
  console.log('received message');

  switch (request.action) {
    case 'selection':

      if (request.activate === true) {
        // inject selector frame
        $('body').append(selector);

        // bind 'mousemove' event handler
        $(document).mousemove(select);

        // bind 'click' event handler with timeout
        setTimeout(function() {
          $(document).on('click', {
            mode : request.mode,
            cid  : request.cid
          }, process);
        }, 300);
      } else {
        deactivate();
      }
      break;
  }
});

console.log('ObserverCreationTool: Content script ready.');