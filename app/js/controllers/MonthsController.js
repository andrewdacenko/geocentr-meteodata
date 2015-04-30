(function() {
  angular
    .module('meteodata.controllers')
    .controller('MonthsController', MonthsController);

  MonthsController.$inject = ['MonthsDB', '$modal', 'months', 'stations', 'tools'];

  function MonthsController(MonthsDB, $modal, months, stations, tools) {
    var vm = this;

    vm.months = months;
    vm.stations = stations;

    var newMonth = {
      station_id: '',
      year: '',
      month: '',
      tools: {},
      square_1: '',
      depth_1: '',
      external_height_1: '',
      internal_height_1: '',
      square_2: '',
      depth_2: '',
      external_height_2: '',
      internal_height_2: '',
      square_3: '',
      depth_3: '',
      external_height_3: '',
      internal_height_3: '',
      square_4: '',
      depth_4: '',
      external_height_4: '',
      internal_height_4: '',
      rg_number: '',
      rg_volume: '',
      rg_range: '',
      creator: '',
      checker: '',
      creation_date: '',
      head: '',
      comments: ''
    };

    vm.isOpen = {};

    vm.newMonth = angular.copy(newMonth);

    vm.open = function($event, key) {
      $event.preventDefault();
      $event.stopPropagation();

      vm.isOpen[key] = true;
    }

    vm.checkTools = function() {
      var modalInstance = $modal.open({
        templateUrl: 'views/modals/months.tools.html',
        controller: function($modalInstance) {
          var self = this;

          self.tools = tools;

          self.selected = {};

          self.ok = function() {
            $modalInstance.close(self.selected);
          };

          self.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
        },
        controllerAs: 'monthsToolsCtrl'
      });

      modalInstance.result.then(function(tools) {
        vm.newMonth.tools = tools;
      });
    }

    vm.tooltip = function(month) {
      console.log(month.tools)
      var rows = Object.keys(month.tools).reduce(function(arr, key) {
        var name = tools.filter(function(t) {
          return t._id === key;
        })[0].name;
        var tool = month.tools[key];
        var row = ['<td>', [name, tool.number, tool.check, tool.test].join('</td><td>'), '</td>'].join('');

        return (!!tool.number && !!tool.check && !!tool.test) ? arr.concat([row]) : arr;
      }, []).join('</tr><tr>');

      return [
        '<table><thead><tr>',
        '<th>&nbsp;Tool&nbsp;</th>',
        '<th>&nbsp;Number&nbsp;</th>',
        '<th>&nbsp;Check&nbsp;Date&nbsp;</th>',
        '<th>&nbsp;Test&nbsp;Date&nbsp;</th></thead>',
        '<tbody><tr>', rows,
        '</tr></tbody></table>'
      ].join('');
    }

    vm.station = function(_id) {
      return vm.stations.filter(function(i) {
        return i._id === _id
      })[0].name;
    }

    vm.add = function() {
      var month = angular.copy(vm.newMonth);

      MonthsDB.add(month, function(data) {
        vm.newMonth = angular.copy(newMonth);
        vm.months.unshift(data);
      });
    };

    vm.delete = function(month) {
      MonthsDB.delete({
        id: month._id
      }, function() {
        vm.months.splice(vm.months.indexOf(month), 1);
      })
    }
  }
})();