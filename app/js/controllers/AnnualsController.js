(function() {
  angular
    .module('meteodata.controllers')
    .controller('AnnualsController', AnnualsController);

  AnnualsController.$inject = ['AnnualsDB', 'Dates', 'annuals', 'stations'];

  function AnnualsController(AnnualsDB, Dates, annuals, stations) {
    var vm = this;

    vm.Dates = Dates;
    vm.annuals = annuals;
    vm.stations = stations;

    var newAnnual = {
      station_id: stations[0] ? stations[0]._id : '',
      year: Dates.years[0],
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

    vm.newAnnual = angular.copy(newAnnual);

    vm.open = function($event, key) {
      $event.preventDefault();
      $event.stopPropagation();

      vm.isOpen[key] = true;
    }

    vm.station = function(_id) {
      return vm.stations.filter(function(i) {
        return i._id === _id
      })[0].name;
    }

    vm.add = function() {
      var annual = angular.copy(vm.newAnnual);

      AnnualsDB.add(annual, function(data) {
        vm.newAnnual = angular.copy(newAnnual);
        vm.annuals.unshift(data);
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