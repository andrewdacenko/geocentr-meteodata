var
  express = require("express"),
  path = require("path"),
  nedb = require('nedb'),
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
    date_add: -1
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