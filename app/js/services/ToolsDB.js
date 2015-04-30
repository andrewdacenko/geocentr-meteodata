(function() {
  angular
    .module('meteodata.services')
    .factory('ToolsDB', ToolsDB);

  ToolsDB.$inject = ['$resource'];

  function ToolsDB($resource) {
    return $resource('/tools/:id', {
      id: '@id'
    }, {
      get: {
        method: 'GET',
        isArray: true
      },
      add: {
        method: 'POST'
      },
      delete: {
        method: 'DELETE'
      }
    });
  }
})();