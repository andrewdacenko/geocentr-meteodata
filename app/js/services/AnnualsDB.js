(function() {
  angular
    .module('meteodata.services')
    .factory('AnnualsDB', AnnualsDB);

  AnnualsDB.$inject = ['$resource'];

  function AnnualsDB($resource) {
    return $resource('/annuals/:id', {
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