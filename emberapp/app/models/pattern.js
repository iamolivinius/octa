import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  version: DS.attr('number'),
  author: DS.attr('string'),
  network: DS.attr('string'),
});
