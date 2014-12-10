chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  $('#modal-select').modal('hide');

  switch (request.type) {
    case 'container':
      if (request.action === 'add') {
        _container = request.container;
        _enclosing = request.enclosing;

        setTimeout(function () { $('#modal-set-container-name').modal('show'); }, 900);
      }
      break;
    case 'field':
      if (request.action === 'add') {
        _field = request.field;

        setTimeout(function() { $('#modal-set-field-name').modal('show'); }, 900);
      }
      break;
    case 'trigger':
      if (request.action === 'add') {
        var trigger = request.trigger;

        if (trigger === undefined) {
          return;
        }

        // Set trigger in 'observer' object
        if (observer.containers[triggerContainer] === undefined) {
          observer.containers[triggerContainer] = {};
        }
        observer.containers[triggerContainer].trigger = trigger;

        // Set trigger in interface
        $('#ctn-' + triggerContainer + '-trigger').html(trigger);
      }
      break;
  }
});
