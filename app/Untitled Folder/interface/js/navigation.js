var setup = function setup() {
  // activate dropdowns, if any
  $('.ui.dropdown').dropdown();
};

$(document).on('load-segment', function event(event, name, id, process) {
  // templating function
  var template = Templates[name + '-segment'];
  
  // generate content
  var content = template(process());
  
  // inject content
  $(id).html(content);
  
  setup();
});

$('#main-steps .ui.step').on('click', function (event) {
  // Find ids of currently active step segment and next to be visible segment
  var active = $('#main-steps').find('.ui.active.step').attr('data-segment'),
      show   = $(event.target).attr('data-segment');
  
  // Remove 'active' class from all steps
  $('#main-steps').find('.ui.step').removeClass('active');
  
  // Add 'active' class to clicked step
  $(event.target).addClass('active');
  
  // trigger segment load
  var process = function () { return {}; };
  switch (show) {
  case 'containers':
  case 'fields':
  case 'process':
    process = function () {
      return {
        containers: observer.containers
      };
    };
    break;
  }
  $(document).trigger('load-segment', [show, '#' + show, process]);
  
  // Hide currently visible step segment
  $('#' + active).hide();
  
  // Show step segment of clicked step
  $('#' + show).show();
});
