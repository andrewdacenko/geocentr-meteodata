(function() {
  angular
    .module('meteodata.controllers')
    .controller('StationsController', StationsController);

  StationsController.$inject = ['StationsDB', '$modal', 'stations'];

  function StationsController(StationsDB, $modal, stations) {
    var vm = this;

    vm.stations = stations;

    var station = {
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

    vm.filter = angular.copy(station);

    vm.isOrderedBy = function(field) {
      return vm.order === field;
    }

    vm.orderBy = function(field) {
      if (vm.order === field) {
        vm.reverse = !vm.reverse;
      };

      vm.order = field;
    }

    vm.station = function(_id) {
      var station = vm.stations.filter(function(i) {
        return i._id === _id
      });

      return station.length ? station[0].name : '';
    }

    vm.clearFilter = function() {
      vm.filter = angular.copy(station);
      vm.reverse = false;
      vm.order = '';
    }

    vm.addOrEdit = function(existingStation) {
      var modalStation = existingStation || station;

      var modalInstance = $modal.open({
        templateUrl: 'views/modals/stations.html',
        controller: function($modalInstance) {
          var self = this;

          self.title = existingStation ? 'Редагування станції' : 'Додавання станції';

          self.station = angular.copy(modalStation);

          self.ok = function() {
            $modalInstance.close(self.station);
          };

          self.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
        },
        controllerAs: 'modalStationsCtrl'
      });

      modalInstance.result.then(function(station) {
        if (existingStation) {
          StationsDB.update({
            id: existingStation._id
          }, station, function(data) {
            for (var k in data) {
              existingStation[k] = data[k];
            }
          });
        } else {
          StationsDB.add(station, function(data) {
            vm.stations.unshift(data);
          });
        }
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