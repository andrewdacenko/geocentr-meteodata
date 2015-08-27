(function() {
  angular
    .module('meteodata.controllers')
    .controller('MonthsController', MonthsController);

  MonthsController.$inject = ['MonthsDB', 'Dates', '$modal', 'months', 'stations', 'tools'];

  function MonthsController(MonthsDB, Dates, $modal, months, stations, tools) {
    var vm = this;

    vm.months = months;
    vm.Dates = Dates;
    vm.stations = stations;
    vm.order = '';
    vm.reverse = false;

    var month = {
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

    vm.filter = angular.copy(months);

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
      vm.filter = angular.copy(month);
      vm.reverse = false;
      vm.order = '';
    }

    vm.addOrEdit = function(existingMonth) {
      var modalMonth = existingMonth || month;

      var modalInstance = $modal.open({
        templateUrl: 'views/modals/months.html',
        controller: function($modalInstance) {
          var self = this;

          self.title = existingMonth ? 'Редагувати місячний звіт' : 'Додати місячний звіт';

          self.month = angular.copy(modalMonth);
          self.stations = stations;
          self.Dates = Dates;
          self.tools = tools;

          self.ok = function() {
            $modalInstance.close(self.month);
          };

          self.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
        },
        controllerAs: 'modalMonthsCtrl'
      });

      modalInstance.result.then(function(month) {
        if (existingMonth) {
          MonthsDB.update({
            id: existingMonth._id
          }, month, function(data) {
            for (var k in data) {
              existingMonth[k] = data[k];
            }
          });
        } else {
          MonthsDB.add(month, function(data) {
            vm.months.unshift(data);
          });
        }
      });
    };

    vm.tooltip = function(month) {
      var rows = Object.keys(month.tools).reduce(function(arr, key) {
        var tool = tools.filter(function(t) {
          return t._id === key;
        });
        var name = tool.length ? tool[0].name : '';
        var tool = month.tools[key];
				var row = ['<td>', [name, tool.number, tool.check, tool.test].join('</td><td>'), '</td>'].join('');
				
        //return (!!tool.number && !!tool.check && !!tool.test) ? arr.concat([row]) : arr;
				return arr.concat([row]);
      }, []).join('</tr><tr>');

      return [
        '<table><thead><tr>',
        '<th>&nbsp;Прилад&nbsp;</th>',
        '<th>&nbsp;Номер&nbsp;</th>',
        '<th>&nbsp;Дата&nbsp;повірки&nbsp;</th>',
        '<th>&nbsp;Дата&nbsp;випроб. та інше&nbsp;</th></thead>',
        '<tbody><tr>', rows,
        '</tr></tbody></table>'
      ].join('');
    }

    vm.delete = function(month) {
      MonthsDB.delete({
        id: month._id
      }, function() {
        vm.months.splice(vm.months.indexOf(month), 1);
      })
    }
  }
})();