(function() {
  angular
    .module('meteodata.services')
    .factory('EmployeesDB', EmployeesDB);

  EmployeesDB.$inject = ['$resource'];

  function EmployeesDB($resource) {
    return $resource('/employees/:id', {
      id: '@id'
    }, {
      get: {
        method: 'GET',
        isArray: true
      },
      add: {
        method: 'POST'
      },
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      }
    });
  }
})();