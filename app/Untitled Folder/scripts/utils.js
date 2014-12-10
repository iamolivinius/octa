var convertNodeToXML = function convertNodeToXML($node, content) {
  var tagname = $node.prop('tagName').toLowerCase();
  
  var xml = '<' + tagname + '>';
  if (content) {
    xml += $node.html();
  } else {
    $node.children().each(function () {
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

var integrate = function integrate(container, field, name) {
  var $container = $(container);

  var split = field.split(' ').reverse();

  $container.find(split.shift()).each(function () {
    var $node = $(this);

    var $iter = $node.parent();
    var elem = split.shift();
    while (split.length > 0 && $iter.prop('tagName') !== undefined && $iter.prop('tagName') === elem) {
      $iter = $iter.parent();
      elem = split.shift();
    }

    if ($iter.prop('tagName') === undefined || split.length === 0) {
      $node.html('{' + name + '}');
    }
  });

  return convertNodeToXML($container, true);
};
