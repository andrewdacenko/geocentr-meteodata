(function() {
  angular
    .module('meteodata.controllers')
    .controller('DaysController', DaysController);

  DaysController.$inject = ['DaysDB', 'Dates', 'days', 'stations'];

  function DaysController(DaysDB, Dates, days, stations) {
    var vm = this;

    vm.Dates = Dates;
    vm.days = days;
    vm.stations = stations;

    var newDay = {
      station_id: '',
      year: '',
      month: '',
      day: '',
      vapour_1: '',
      temp_1: '',
      press_1: '',
      vapour_2: '',
      temp_2: '',
      press_2: '',
      vapour_3: '',
      temp_3: '',
      press_3: '',
      temp_w_4: '',
      press_4: '',
      temp_a: '',
      part_press: '',
      wind: '',
      soil_temp: '',
      falls: '',
      press_diff_1: '',
      press_diff_2: '',
      press_diff_3: '',
      press_diff_4: '',
      comment: '',
    };

    vm.isOpen = {};

    vm.newDay = angular.copy(newDay);

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
      var day = angular.copy(vm.newDay);

      DaysDB.add(day, function(data) {
        vm.newDay = angular.copy(newDay);
        vm.days.unshift(data);
      });
    };

    vm.delete = function(day) {
      DaysDB.delete({
        id: day._id
      }, function() {
        vm.days.splice(vm.days.indexOf(day), 1);
      })
    }
  }
})();