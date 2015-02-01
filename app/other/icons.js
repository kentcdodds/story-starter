var _ = require('lodash');
var iconSets = ['action', 'alert', 'communication', 'content', 'editor', 'navigation'];
_.each(iconSets, iconSet => require('material-design-icons/sprites/svg-sprite/svg-sprite-' + iconSet + '.css'));
