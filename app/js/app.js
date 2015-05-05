(function() {
  var year = (new Date()).getFullYear();
  var years = Array.apply(null, {
    length: 100
  }).map(yearsMapFn);
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(monthsMapFn);
  var days = Array.apply(null, {
    length: 31
  }).map(daysMapFn);

  angular.module('meteodata.controllers', []);
  angular.module('meteodata.services', []);

  angular
    .module('meteodata', [
      'ui.router',
      'ui.bootstrap',
      'ngResource',
      'meteodata.controllers',
      'meteodata.services'
    ])
    .constant('Dates', {
      years: years,
      months: months,
      days: days
    })
    .config(stateConfig)
    .controller('WindowToolbar', WindowToolbar)
    .factory('Window', function() {
      //var gui = require('nw.gui');
      //return gui.Window.get()
      return {};
    })


  stateConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function stateConfig($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /stations
    $urlRouterProvider.otherwise("/stations");
    //
    // Now set up the states
    $stateProvider
      .state('employees', {
        url: "/employees",
        templateUrl: "views/employees.html",
        controller: 'EmployeesController as employeesCtrl',
        resolve: {
          employees: function(EmployeesDB) {
            return EmployeesDB.get(function(data) {
              return data;
            });
          },
          stations: function(StationsDB) {
            return StationsDB.get(function(data) {
              return data;
            });
          }
        }
      })
      .state('annuals', {
        url: "/annuals",
        templateUrl: "views/annuals.html",
        controller: 'AnnualsController as annualsCtrl',
        resolve: {
          annuals: function(AnnualsDB) {
            return AnnualsDB.get(function(data) {
              return data;
            });
          },
          stations: function(StationsDB) {
            return StationsDB.get(function(data) {
              return data;
            });
          }
        }
      })
      .state('days', {
        url: "/days",
        templateUrl: "views/days.html",
        controller: 'DaysController as daysCtrl',
        resolve: {
          days: function(DaysDB) {
            return DaysDB.get(function(data) {
              return data;
            });
          },
          stations: function(StationsDB) {
            return StationsDB.get(function(data) {
              return data;
            });
          }
        }
      })
      .state('months', {
        url: "/months",
        templateUrl: "views/months.html",
        controller: 'MonthsController as monthsCtrl',
        resolve: {
          months: function(MonthsDB) {
            return MonthsDB.get(function(data) {
              return data;
            });
          },
          stations: function(StationsDB) {
            return StationsDB.get(function(data) {
              return data;
            });
          },
          tools: function(ToolsDB) {
            return ToolsDB.get(function(data) {
              return data;
            });
          }
        }
      })
      .state('stations', {
        url: "/stations",
        templateUrl: "views/stations.html",
        controller: 'StationsController as stationsCtrl',
        resolve: {
          stations: function(StationsDB) {
            return StationsDB.get(function(data) {
              return data;
            });
          }
        }
      })
      .state('tools', {
        url: "/tools",
        templateUrl: "views/tools.html",
        controller: 'ToolsController as toolsCtrl',
        resolve: {
          tools: function(ToolsDB) {
            return ToolsDB.get(function(data) {
              return data;
            });
          }
        }
      });
  }

  WindowToolbar.$inject = ['$scope', 'Window'];

  function WindowToolbar($scope, Window) {
    $scope.windowMinimize = function() {
      Window.minimize();
    };

    $scope.windowToggleFullscreen = function() {
      Window.toggleFullscreen();
    };

    $scope.windowClose = function() {
      Window.close();
    };
  }

  function yearsMapFn(i, index) {
    return year - index;
  };

  function monthsMapFn(name, index) {
    return {
      name: name,
      index: index + 1
    }
  };

  function daysMapFn(i, index) {
    return index + 1;
  };

})();