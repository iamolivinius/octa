function activateSelection(_mode) {
  $('#modal-select').modal('show');

  chrome.windows.getAll(null, function(windows) {
    windows.forEach(function(window) {
      chrome.tabs.getAllInWindow(window.id, function(tabs) {
        tabs.forEach(function(tab) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'selection',
            activate: true,
            mode: _mode
          }, function(response) {});
        })
      });
    });
    // for (var j = 0; j < windows.length; ++j) {
    //   chrome.tabs.getAllInWindow(windows[j].id, function (tabs) {
    //     for (var i = 0; i < tabs.length; ++i) {
    //       chrome.tabs.sendMessage(tabs[i].id, {action: 'selection', activate: true, mode: _mode}, function (response) {});
    //     }
    //   });
    // }
  });
}

function activateTesting(_container) {
  chrome.windows.getAll(null, function(windows) {
    for (var j = 0; j < windows.length; ++j) {
      chrome.tabs.getAllInWindow(windows[j].id, function(tabs) {
        for (var i = 0; i < tabs.length; ++i) {
          chrome.tabs.sendMessage(tabs[i].id, {
            action: 'pattern-test',
            activate: true,
            container: _container
          }, function(response) {});
        }
      });
    }
  });
}

/*
 * -----------------------
 * Handle table selections
 * -----------------------
 */
$('table#container-table tbody').on('click', 'tr', function() {
  // Remove 'warning' class from other rows
  $('table#container-table tbody').find('tr').removeClass('warning');

  // Add 'warning' class to this row
  $(this).addClass('warning');

  // Activate 'remove' button
  $('#btn-remove-container').removeClass('disabled');
});

$(document).on('click', 'table.fields-table tbody tr', function() {
  // Remove 'warning' class from other rows
  $(this).closest('table').find('tr').removeClass('warning');

  // Add 'warning' class to this row
  $(this).addClass('warning');

  // Activate 'remove' button
  $(this).closest('table').find('.btn-remove-field').removeClass('disabled');
});

/*
 * --------------
 * Handle buttons
 * --------------
 */
$(document).on('click', '#btn-finalize', function() {
  var obs = {};

  // Copy static information
  obs.name = observer.name;
  obs.network = observer.network;
  obs.type = 'click';
  // TODO: implement priority
  obs.priority = 1;

  // Generate patterns from containers
  obs.patterns = [];
  for (var containerName in observer.containers) {
    var container = observer.containers[containerName];

    var p = {},
      pattern = null;

    var con = container.pattern;
    for (var i in container.fields) {
      var elem = container.fields[i];
      con = integrate(con, elem.field, elem.fieldname);
    }

    p.node = container.trigger;
    p.container = container.enclosing;
    p.pattern = con;
    p.process = container.process;

    obs.patterns.push(p);
  }

  $('#observer-area').html(JSON.stringify(obs, null, 4));
});

$(document).on('click', '#btn-select-container', function() {
  // Send 'activate' event to all tabs
  activateSelection('container');
});

$(document).on('click', '#btn-remove-container', function() {
  if ($(this).hasClass('disabled')) {
    return;
  }

  // Get selected container name
  var name = $('table#container-table tbody tr.warning').find('td.tbl-container-name').html();

  // Remove container
  removeContainer(name);

  // Remove row
  $('table#container-table tbody tr.warning').remove();

  // Disable remove button
  $('#btn-remove-container').addClass('disabled');
});

$(document).on('click', '#btn-container-name-modal-okay', function() {
  var name = $('#modal-container-name').val();

  if (name.length === 0) {
    return;
  }

  // Create new table row
  $('#container-table tbody').append('<tr><td class="tbl-container-name">' + name + '</td><td style="font-family: monospace;">' + _enclosing + '</td><td style="font-family: monospace;">' + _container.replace(/</gi, '&lt;').replace(/>/gi, '&gt;') + '</td></tr>');

  // Add to 'observer' object
  if (observer['containers'] === undefined) {
    observer['containers'] = {};
  }

  observer['containers'][name] = {};
  observer['containers'][name].pattern = _container;
  observer['containers'][name].enclosing = _enclosing;

  // Clear container name
  $('#modal-container-name').val('');
});

$(document).on('click', '#btn-field-name-modal-okay', function() {
  var name = $('#modal-field-name').val();

  if (name.length === 0) {
    return;
  }

  // Create new table row
  $('table.fields-table.ctn-' + fieldContainer + ' tbody').append('<tr><td class="field-name" data-container="' + fieldContainer + '">' + name + '</td><td style="font-family: monospace;">' + _field + '</td></tr>');

  // Add to 'observer' object
  if (observer['containers'] === undefined) {
    observer['containers'] = {};
  }

  if (observer.containers[fieldContainer].fields === undefined) {
    observer.containers[fieldContainer].fields = [];
  }

  observer.containers[fieldContainer].fields.push({
    fieldname: name,
    field: _field
  });

  // Clear field name
  $('#modal-field-name').val('');
});

$(document).on('click', '.btn-trigger-select', function() {
  // Save container
  triggerContainer = $(this).attr('data-container');

  activateSelection('trigger');
});

$(document).on('click', '.btn-add-field', function() {
  // Save container
  fieldContainer = $(this).attr('data-container');

  activateSelection('field');
});

$(document).on('click', '.btn-remove-field', function() {
  if ($(this).hasClass('disabled')) {
    return;
  }

  var container = $(this).attr('data-container');

  // Get selected field name
  var name = $('table.fields-table.ctn-' + container + ' tbody tr.warning').find('td.field-name').html();

  // Remove container
  removeField(container, name);

  // Remove row
  $('table.fields-table.ctn-' + container + ' tbody tr.warning').remove();

  // Disable remove button
  $(this).addClass('disabled');
});

$(document).on('click', '.btn-test-container', function() {
  var container = $(this).attr('data-container');

  activateTesting(observer.containers[container]);
});

/*
 * -----------------------
 * Handle table selections
 * -----------------------
 */
$(document).on('click', 'table#container-table tbody tr', function() {
  // Remove 'warning' class from other rows
  $('table#container-table tbody').find('tr').removeClass('warning');

  // Add 'warning' class to this row
  $(this).addClass('warning');

  // Activate 'remove' button
  $('#btn-remove-container').removeClass('disabled');
});

$(document).on('click', 'table.fields-table tbody tr', function() {
  // Remove 'warning' class from other rows
  $(this).closest('table').find('tr').removeClass('warning');

  // Add 'warning' class to this row
  $(this).addClass('warning');

  // Activate 'remove' button
  $(this).closest('table').find('.btn-remove-field').removeClass('disabled');
});

/*
 * Initial set up.
 */
$(document).ready(function() {
  // hide all segments
  $('.process.segment').hide();

  // show first segment
  $('.process.segment').first().show();

  // initialize modals
  $('.ui.modal').modal();

  // load initial segment
  $(document).trigger('load-segment', ['general', '#general', function() {
    return {};
  }]);
});
