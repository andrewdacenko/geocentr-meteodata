(function() {
  angular
    .module('meteodata.services')
    .factory('MonthsDB', MonthsDB);

  MonthsDB.$inject = ['$resource'];

  function MonthsDB($resource) {
    return $resource('/months/:id', {
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