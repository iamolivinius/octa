$(document).on('change', '#general input', function () {
  // Reflect changes in 'observer' object
  observer[$(this).attr('name')] = $(this).val();
});

$(document).on('input propertychange', '#process textarea', function () {
  // Get container name
  var container = $(this).attr('data-container');

  // Set processing function
  if (observer.containers[container] === undefined) {
    observer.containers[container] = {};
  }
  observer.containers[container].process = $(this).val();
});
