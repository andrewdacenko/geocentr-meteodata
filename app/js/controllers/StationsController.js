(function() {
  angular
    .module('meteodata.controllers')
    .controller('StationsController', StationsController);

  StationsController.$inject = ['StationsDB', 'stations'];

  function StationsController(StationsDB, stations) {
    var vm = this;

    vm.stations = stations;

    var newStation = {
      name: '',
      coordinates: '',
      region: '',
      district: '',
      city: '',
      index: '',
      height: '',
      open: '',
      close: ''
    };

    vm.newStation = angular.copy(newStation);

    vm.add = function() {
      var input = angular.copy(vm.newStation);

      StationsDB.add(input, function(data) {
        vm.newStation = angular.copy(newStation);
        vm.stations.unshift(data);
      });
    };

    vm.delete = function(station) {
      StationsDB.delete({
        id: station._id
      }, function() {
        vm.stations.splice(vm.stations.indexOf(station), 1);
      })
    }
  }
})();