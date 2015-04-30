(function() {
  angular
    .module('meteodata.services')
    .factory('DaysDB', DaysDB);

  DaysDB.$inject = ['$resource'];

  function DaysDB($resource) {
    return $resource('/days/:id', {
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