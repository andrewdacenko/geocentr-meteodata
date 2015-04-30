(function() {
  angular
    .module('meteodata.controllers')
    .controller('ToolsController', ToolsController);

  function ToolsController(ToolsDB, tools) {
    var vm = this;

    vm.tools = tools;

    var newTool = {
      name: ''
    };

    vm.newTool = angular.copy(newTool);

    vm.add = function() {
      var input = angular.copy(vm.newTool);

      ToolsDB.add(input, function(data) {
        vm.newTool = angular.copy(newTool);
        vm.tools.unshift(data);
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