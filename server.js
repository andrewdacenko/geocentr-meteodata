var
  express = require("express"),
  path = require("path"),
  nedb = require('nedb'),
  async = require('async'),
  excelReport = require('excel-report'),
  employeesDB = "db/employees.db",
  annualsDB = "db/annuals.db",
  monthsDB = "db/months.db",
  toolsDB = "db/tools.db",
  daysDB = "db/days.db",
  stationsDB = "db/stations.db";

var db = {
  employees: new nedb({
    filename: employeesDB,
    autoload: true
  }),
  stations: new nedb({
    filename: stationsDB,
    autoload: true
  }),
  annuals: new nedb({
    filename: annualsDB,
    autoload: true
  }),
  tools: new nedb({
    filename: toolsDB,
    autoload: true
  }),
  days: new nedb({
    filename: daysDB,
    autoload: true
  }),
  months: new nedb({
    filename: monthsDB,
    autoload: true
  })
};

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser()),
  app.use(express.static(path.join(__dirname, 'app')));
});

app.get('/api', function(req, res) {
  res.send('API is running');
});

app.get('/employees', function(req, res) {
  db.employees.find({}).sort({
    date_add: -1
  }).exec(function(err, result) {
    res.send(result);
  });
});

app.post('/employees', function(req, res) {
  var item = req.body;
  item.date_add = new Date;
  db.employees.insert(item, function(err, result) {
    if (err) {
      res.send({
        'error': 'An error has occurred'
      });
    } else {
      console.log('Success: ' + JSON.stringify(result));
      res.send(result);
    }
  });
});

app.put('/employees/:id', function(req, res) {
  var id = req.params.id;

  db.employees.update({
    _id: id
  }, req.body, {}, function(err, numReplaced) {
    if (err) {
      res.send({
        'error': 'An error has occurred - ' + err
      });
    } else {
      res.send(req.body);
    }
  });
});

app.delete('/employees/:id', function(req, res) {
  var id = req.params.id;
  db.employees.remove({
    _id: id
  }, {}, function(err, result) {
    if (err) {
      res.send({
        'error': 'An error has occurred - ' + err
      });
    } else {
      console.log('' + result + ' document(s) deleted');
      res.send(req.body);
    }
  });
});

app.get('/stations', function(req, res) {
  db.stations.find({}).sort({
    date_add: -1
  }).exec(function(err, result) {
    res.send(result);
  });
});

app.post('/stations', function(req, res) {
  var item = req.body;
  item.date_add = new Date;
  db.stations.insert(item, function(err, result) {
    if (err) {
      res.send({
        'error': 'An error has occurred'
      });
    } else {
      console.log('Success: ' + JSON.stringify(result));
      res.send(result);
    }
  });
});

app.put('/stations/:id', function(req, res) {
  var id = req.params.id;

  db.stations.update({
    _id: id
  }, req.body, {}, function(err, numReplaced) {
    if (err) {
      res.send({
        'error': 'An error has occurred - ' + err
      });
    } else {
      res.send(req.body);
    }
  });
});

app.delete('/stations/:id', function(req, res) {
  var id = req.params.id;
  db.stations.remove({
    _id: id
  }, {}, function(err, result) {
    if (err) {
      res.send({
        'error': 'An error has occurred - ' + err
      });
    } else {
      console.log('' + result + ' document(s) deleted');
      res.send(req.body);
    }
  });
});

app.get('/annuals', function(req, res) {
  db.annuals.find({}).sort({
    date_add: -1
  }).exec(function(err, result) {
    res.send(result);
  });
});

app.get('/annuals/day', function(req, res) {
  var year = +req.query.year || 2015;
  var start = +req.query.start || 4;
  var end = +req.query.end || 5;
  async.waterfall([

    function findAnnual(callback) {
      db.annuals.findOne({
        year: year
      }, function(err, annual) {
        if (err) return callback(err);
        callback(null, annual)
      });
    },
    function collectStations(annual, callback) {
      db.stations.findOne({
        _id: annual.station_id
      }, function(err, station) {
        if (err) return callback(err);
        annual.station = station.name;
        callback(null, annual);
      })
    },
    function findDays(annuals, callback) {
      db.days.find({
        year: year
      }, function(err, days) {
        if (err) return callback(err);
        callback(null, {
          annuals: annuals,
          days: days
        });
      });
    }
  ], function(err, data) {
    if (err) {
      return res.end(error);
    };
    var days = data.days;
    var annuals = data.annuals;
    var findMiddle = function(arr, mid) {
      var count = arr.length;
      var result = 0;
      for (var i = 0; i < count; i++) {
        result += +arr[i];
      };
      if (mid) result /= count;
      return result;
    };
    var calcValue = function(arr, from, to, field, mid) {
      //console.log('calcValue, arr = ', arr[3], field, from, to)
      var result = [];
      for (var i = 1; i < arr.length; i++) {
        //console.log(arr[i].day);
        if ((arr[i]) && +arr[i].day >= from && +arr[i].day <= to) {
          result.push(+arr[i][field]);
        }
      };
      console.log(result)
      return findMiddle(result, mid)
    }
    var result = {};
    var obj = {};
    for (var i = 0; i < days.length; i++) {
      var day = days[i];
      (obj[day.month]) ? obj[day.month][+day.day] = day : obj[day.month] = [];
    };
    for (var i = start; i <= end; i++) {
      var table = [];
      ['1', '2', '3', 'місяць'].forEach(function(item, j, arr) {
        table.push({
          index: item
        })
      });
      ["vapour_2", "temp_2", "press_2", "temp_a", "part_press", "wind", "soil_temp", "falls"].forEach(function(item, j, arr) {
        var mid = (item == "falls") ? 0 : 1;
        table[0][item] = calcValue(obj[i], 1, 10, item, mid);
        table[1][item] = calcValue(obj[i], 11, 20, item, mid);
        table[2][item] = calcValue(obj[i], 21, 31, item, mid);
        table[3][item] = calcValue(obj[i], 1, 31, item, mid);
      });
      result['table' + i] = table;
    };
    for (var i = 1; i <= 12; i++) {
      result['table' + i] = result['table' + i] || []
    };
    result.year = "" + annuals.year;
    result.station = annuals.station;
    ["snow_melting", "water_freezing", "observation_begin_g", "observation_end_g"].forEach(function(item, i, arr) {
      var date = new Date(annuals[item]);
      console.log(typeof date)
      var values = [date.getDate(), date.getMonth() + 1];
      for (var id in values) {
        values[id] = values[id].toString().replace(/^([0-9])$/, '0$1');
      }
      result[item] = values[0] + '.' + values[1];
    })

    console.log(result);

    //need to output result
    var template_file = path.join(__dirname, 'templates', 'tmp.xlsx');

    excelReport(template_file, result, function(error, binary) {
      if (error) {
        res.writeHead(400, {
          'Content-Type': 'text/plain'
        });
        res.end(error);
        return;
      };

      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=day" + year + start + end + ".xlsx");
      res.end(binary, 'binary');
    })
  });



});

app.get('/annuals/report', function(req, res) {
  var year = req.query.year;

  async.waterfall([

    function findAnnuals(callback) {
      db.annuals.find({
        year: year
      }, function(err, annuals) {
        if (err) return callback(err);
        callback(null, annuals);
      });
    },

    function collectStations(annuals, callback) {
      var ids = annuals.map(function(i) {
        return i.station_id;
      });

      db.stations.find({
        _id: {
          $in: ids
        }
      }, function(err, stations) {
        if (err) return callback(err);

        var data = annuals.map(function(i) {
          i.station = stations.filter(function(s) {
            return i.station_id === s._id;
          })[0].name;

          return i;
        });

        callback(null, {
          s: data,
          year: year + ' р.'
        });
      })
    },
  ], function(err, data) {
    if (err) {
      return res.end(error);
    };


    var template_file = path.join(__dirname, 'templates', 'annual.xlsx');

    excelReport(template_file, data, function(error, binary) {
      if (error) {
        res.writeHead(400, {
          'Content-Type': 'text/plain'
        });
        res.end(error);
        return;
      };

      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=annual" + year + ".xlsx");
      res.end(binary, 'binary');
    })
  })
})

app.post('/annuals', function(req, res) {
  var item = req.body;
  item.date_add = new Date;
  db.annuals.insert(item, function(err, result) {
    if (err) {
      res.send({
        'error': 'An error has occurred'
      });
    } else {
      console.log('Success: ' + JSON.stringify(result));
      res.send(result);
    }
  });
});

app.put('/annuals/:id', function(req, res) {
  var id = req.params.id;

  db.annuals.update({
    _id: id
  }, req.body, {}, function(err, numReplaced) {
    if (err) {
      res.send({
        'error': 'An error has occurred - ' + err
      });
    } else {
      res.send(req.body);
    }
  });
});

app.delete('/annuals/:id', function(req, res) {
  var id = req.params.id;
  db.annuals.remove({
    _id: id
  }, {}, function(err, result) {
    if (err) {
      res.send({
        'error': 'An error has occurred - ' + err
      });
    } else {
      console.log('' + result + ' document(s) deleted');
      res.send(req.body);
    }
  });
});

app.get('/tools', function(req, res) {
  db.tools.find({}).sort({
    date_add: -1
  }).exec(function(err, result) {
    res.send(result);
  });
});

app.post('/tools', function(req, res) {
  var item = req.body;
  item.date_add = new Date;
  db.tools.insert(item, function(err, result) {
    if (err) {
      res.send({
        'error': 'An error has occurred'
      });
    } else {
      console.log('Success: ' + JSON.stringify(result));
      res.send(result);
    }
  });
});

app.put('/tools/:id', function(req, res) {
  var id = req.params.id;

  db.tools.update({
    _id: id
  }, req.body, {}, function(err, numReplaced) {
    if (err) {
      res.send({
        'error': 'An error has occurred - ' + err
      });
    } else {
      res.send(req.body);
    }
  });
});

app.delete('/tools/:id', function(req, res) {
  var id = req.params.id;
  db.tools.remove({
    _id: id
  }, {}, function(err, result) {
    if (err) {
      res.send({
        'error': 'An error has occurred - ' + err
      });
    } else {
      console.log('' + result + ' document(s) deleted');
      res.send(req.body);
    }
  });
});

app.get('/months', function(req, res) {
  db.months.find({}).sort({
    date_add: -1
  }).exec(function(err, result) {
    res.send(result);
  });
});

app.post('/months', function(req, res) {
  var item = req.body;
  item.date_add = new Date;
  db.months.insert(item, function(err, result) {
    if (err) {
      res.send({
        'error': 'An error has occurred'
      });
    } else {
      console.log('Success: ' + JSON.stringify(result));
      res.send(result);
    }
  });
});

app.put('/months/:id', function(req, res) {
  var id = req.params.id;

  db.months.update({
    _id: id
  }, req.body, {}, function(err, numReplaced) {
    if (err) {
      res.send({
        'error': 'An error has occurred - ' + err
      });
    } else {
      res.send(req.body);
    }
  });
});

app.delete('/months/:id', function(req, res) {
  var id = req.params.id;
  db.months.remove({
    _id: id
  }, {}, function(err, result) {
    if (err) {
      res.send({
        'error': 'An error has occurred - ' + err
      });
    } else {
      console.log('' + result + ' document(s) deleted');
      res.send(req.body);
    }
  });
});

app.get('/days', function(req, res) {
  db.days.find({}).sort({
    date_add: -1,
    year: -1,
    month: -1,
    day: -1
  }).exec(function(err, result) {
    res.send(result);
  });
});

app.post('/days', function(req, res) {
  var item = req.body;
  item.date_add = new Date;
  db.days.insert(item, function(err, result) {
    if (err) {
      res.send({
        'error': 'An error has occurred'
      });
    } else {
      console.log('Success: ' + JSON.stringify(result));
      res.send(result);
    }
  });
});

app.put('/days/:id', function(req, res) {
  var id = req.params.id;

  db.days.update({
    _id: id
  }, req.body, {}, function(err, numReplaced) {
    if (err) {
      res.send({
        'error': 'An error has occurred - ' + err
      });
    } else {
      res.send(req.body);
    }
  });
});

app.delete('/days/:id', function(req, res) {
  var id = req.params.id;
  db.days.remove({
    _id: id
  }, {}, function(err, result) {
    if (err) {
      res.send({
        'error': 'An error has occurred - ' + err
      });
    } else {
      console.log('' + result + ' document(s) deleted');
      res.send(req.body);
    }
  });
});

app.listen(app.get('port'));
console.log('Server listening on port ' + app.get('port'));