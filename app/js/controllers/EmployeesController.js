(function() {
  angular
    .module('meteodata.controllers')
    .controller('EmployeesController', EmployeesController);

  EmployeesController.$inject = ['EmployeesDB', '$modal', 'employees', 'stations'];

  function EmployeesController(EmployeesDB, $modal, employees, stations) {
    var vm = this;

    vm.employees = employees;
    vm.stations = stations;
    vm.order = '';
    vm.reverse = false;

    var employee = {
      name: '',
      surname: '',
      station_id: '',
      position: '',
      middlename: '',
      description: ''
    }

    vm.filter = angular.copy(employee);

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
      vm.filter = angular.copy(employee);
      vm.reverse = false;
      vm.order = '';
    }

    vm.addOrEdit = function(existingEmployee) {
      var modalEmployee = existingEmployee || employee;

      var modalInstance = $modal.open({
        templateUrl: 'views/modals/employees.html',
        controller: function($modalInstance) {
          var self = this;

          self.title = existingEmployee ? 'Edit Employee' : 'Add Employee';

          self.employee = angular.copy(modalEmployee);
          self.stations = stations;

          self.ok = function() {
            $modalInstance.close(self.employee);
          };

          self.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
        },
        controllerAs: 'modalEmployeesCtrl'
      });

      modalInstance.result.then(function(employee) {
        if (existingEmployee) {
          EmployeesDB.update({
            id: existingEmployee._id
          }, employee, function(data) {
            for (var k in data) {
              existingEmployee[k] = data[k];
            }
          });
        } else {
          EmployeesDB.add(employee, function(data) {
            vm.employees.unshift(data);
          });
        }
      });
    };

    vm.delete = function(employee) {
      EmployeesDB.delete({
        id: employee._id
      }, function() {
        vm.employees.splice(vm.employees.indexOf(employee), 1);
      })
    }
  }
})();