(function() {
  angular
    .module('meteodata.controllers')
    .controller('EmployeesController', EmployeesController);

  EmployeesController.$inject = ['EmployeesDB', 'employees', 'stations'];

  function EmployeesController(EmployeesDB, employees, stations) {
    var vm = this;

    vm.employees = employees;
    vm.stations = stations;

    var newEmployee = {
      name: '',
      surname: '',
      station_id: '',
      position: '',
      middlename: '',
      description: ''
    }

    vm.newEmployee = angular.copy(newEmployee);

    vm.station = function(_id) {
      return vm.stations.filter(function(i) {
        return i._id === _id
      })[0].name;
    }

    vm.add = function() {
      var employee = angular.copy(vm.newEmployee);

      EmployeesDB.add(employee, function(data) {
        vm.newEmployee = angular.copy(newEmployee);
        vm.employees.unshift(data);
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