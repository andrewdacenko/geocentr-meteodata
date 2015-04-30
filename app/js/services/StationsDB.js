(function() {
  angular
    .module('meteodata.services')
    .factory('StationsDB', StationsDB);

  StationsDB.$inject = ['$resource'];

  function StationsDB($resource) {
    return $resource('/stations/:id', {
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