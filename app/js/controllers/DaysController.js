(function() {
  angular
    .module('meteodata.controllers')
    .controller('DaysController', DaysController);

  DaysController.$inject = ['DaysDB', 'Dates', '$modal', 'days', 'stations'];

  function DaysController(DaysDB, Dates, $modal, days, stations) {
    var vm = this;

    vm.Dates = Dates;
    vm.days = days;
    vm.stations = stations;
    vm.order = '';
    vm.reverse = false;

    var day = {
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

    vm.filter = angular.copy(day);

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
      vm.filter = angular.copy(day);
      vm.reverse = false;
      vm.order = '';
    }

    vm.addOrEdit = function(existingDay) {
      var modalDay = existingDay || day;

      var modalInstance = $modal.open({
        templateUrl: 'views/modals/days.html',
        controller: function($modalInstance) {
          var self = this;

          self.day = angular.copy(modalDay);
          self.stations = stations;
          self.Dates = Dates;

          self.ok = function() {
            $modalInstance.close(self.day);
          };

          self.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
        },
        controllerAs: 'modalDaysCtrl'
      });

      modalInstance.result.then(function(day) {
        if (existingDay) {
          DaysDB.update({
            id: existingDay._id
          }, day, function(data) {
            for (var k in data) {
              existingDay[k] = data[k];
            }
          });
        } else {
          DaysDB.add(day, function(data) {
            vm.days.unshift(data);
          });
        }
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