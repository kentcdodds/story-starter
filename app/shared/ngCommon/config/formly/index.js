module.exports = ngModule => {
  ngModule.config((formlyConfigProvider) => {
    formlyConfigProvider.setType({
      name: 'description',
      template: require('./wrappers/description.html')
    });

    var types = ['input', 'radio', 'select', 'textarea', 'checkbox'].map(type => {
      return {
        name: type,
        template: require('./templates/' + type + '.html'),
        wrapper: 'description'
      };
    });
    formlyConfigProvider.setType(types);
  });

  require('./ss-messages')(ngModule);
};
