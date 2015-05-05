(function() {
  angular
    .module('meteodata.controllers')
    .controller('ToolsController', ToolsController);

  ToolsController.$inject = ['ToolsDB', '$modal', 'tools'];

  function ToolsController(ToolsDB, $modal, tools) {
    var vm = this;

    vm.tools = tools;

    var tool = {
      name: ''
    };

    vm.filter = angular.copy(tool);

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
      vm.filter = angular.copy(tool);
      vm.reverse = false;
      vm.order = '';
    }

    vm.addOrEdit = function(existingTool) {
      var modalTool = existingTool || tool;

      var modalInstance = $modal.open({
        templateUrl: 'views/modals/tools.html',
        controller: function($modalInstance) {
          var self = this;

          self.title = existingTool ? 'Edit Tool' : 'Add Tool';

          self.tool = angular.copy(modalTool);

          self.ok = function() {
            $modalInstance.close(self.tool);
          };

          self.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
        },
        controllerAs: 'modalToolsCtrl'
      });

      modalInstance.result.then(function(tool) {
        if (existingTool) {
          ToolsDB.update({
            id: existingTool._id
          }, tool, function(data) {
            for (var k in data) {
              existingTool[k] = data[k];
            }
          });
        } else {
          ToolsDB.add(tool, function(data) {
            vm.tools.unshift(data);
          });
        }
      });
    };

    vm.delete = function(tool) {
      ToolsDB.delete({
        id: tool._id
      }, function() {
        vm.tools.splice(vm.tools.indexOf(tool), 1);
      })
    }
  }
})();