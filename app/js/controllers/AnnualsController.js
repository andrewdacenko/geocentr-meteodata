(function() {
  angular
    .module('meteodata.controllers')
    .controller('AnnualsController', AnnualsController);

  AnnualsController.$inject = ['AnnualsDB', 'Dates', '$modal', 'annuals', 'stations'];

  function AnnualsController(AnnualsDB, Dates, $modal, annuals, stations) {
    var vm = this;

    vm.Dates = Dates;
    vm.annuals = annuals;
    vm.stations = stations;
    vm.order = '';
    vm.reverse = false;

    var annual = {
      station_id: '',
      year: '',
      number: '',
      angle_continental: '',
      angle_shore: '',
      page_station: '',
      page_observation: '',
      comment: '',
      snow_melting: '',
      observation_begin_g: '',
      observation_end_g: '',
      water_freezing: '',
      ice_clean: '',
      observation_begin_w: '',
      observation_end_w: '',
      ice_cover: ''
    };

    vm.isOpen = {};

    vm.filter = angular.copy(annual);

    vm.open = function($event, key) {
      $event.preventDefault();
      $event.stopPropagation();

      vm.isOpen[key] = true;
    }

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
      vm.filter = angular.copy(annual);
      vm.reverse = false;
      vm.order = '';
    }

    vm.addOrEdit = function(existingAnnual) {
      var modalAnnual = existingAnnual || annual;

      var modalInstance = $modal.open({
        templateUrl: 'views/modals/annuals.html',
        controller: function($modalInstance) {
          var self = this;

          self.title = existingAnnual ? 'Редагувати щорічний звіт' : 'Додати щорічний звіт';

          self.isOpen = {};

          self.open = function($event, key) {
            $event.preventDefault();
            $event.stopPropagation();

            self.isOpen[key] = true;
          }

          self.annual = angular.copy(modalAnnual);
          self.stations = stations;
          self.Dates = Dates;

          self.ok = function() {
            $modalInstance.close(self.annual);
          };

          self.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
        },
        controllerAs: 'modalAnnualsCtrl'
      });

      modalInstance.result.then(function(annual) {
        if (existingAnnual) {
          AnnualsDB.update({
            id: existingAnnual._id
          }, annual, function(data) {
            for (var k in data) {
              existingAnnual[k] = data[k];
            }
          });
        } else {
          AnnualsDB.add(annual, function(data) {
            vm.annuals.unshift(data);
          });
        }
      });
    };

    vm.delete = function(annual) {
      AnnualsDB.delete({
        id: annual._id
      }, function() {
        vm.annuals.splice(vm.annuals.indexOf(annual), 1);
      })
    }
  }
})();