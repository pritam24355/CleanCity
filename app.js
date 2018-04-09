var express = require('express');
var path = require('path');
global.appRootDir = path.resolve(__dirname);

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');

var mysql_connection = require('./src/mysqlConnection.js');

var app = express();
var corsOptions = {
    origin: 'http://localhost:3008',
    credentials: true,
};
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', index);
app.use('/users', users);

app.get('/',function(req,res){

    res.render('home')

});
app.get('/api/getcities', function(req, res){
  
  var get_cities_SQL = "SELECT city_id, city_name FROM smartcity.city";
  mysql_connection.executeQuery(get_cities_SQL, function(err, data){
    if(err){
      console.log(err);
      res.status(500).send({"Message": "Internal Server Error"});
    }
    else{
        res.send(data);
    }
  });

  
});


app.get('/api/get_stations_for_city/:city_id', function(req, res){
  
  var get_cities_SQL = "SELECT station_id, station_title FROM smartcity.station WHERE station.city_id =" +req.params.city_id;
  mysql_connection.executeQuery(get_cities_SQL, function(err, data){
    if(err){
      console.log(err);
      res.status(500).send({"Message": "Internal Server Error"});
    }
    else{
        res.send(data);
    }
  });

  
});

app.get('/api/get_sensors_for_station/:station_id', function(req, res){
   
  var get_cities_SQL = "SELECT sensor_title as sensor, sensor_desc as description FROM smartcity.sensor where station_id = "+req.params.station_id ;
                        
  mysql_connection.executeQuery(get_cities_SQL, function(err, data){
    if(err){
      console.log(err);
      res.status(500).send({"Message": "Internal Server Error"});
    }
    else{
        res.send(data);
    }
  });
});

app.get('/api/get_logs_for_sensor/:sensor_id', function(req, res){
   
  var get_cities_SQL = "SELECT log_data as logs FROM smartcity.sensor where sensor_id = "+req.params.sensor_id ;

  mysql_connection.executeQuery(get_cities_SQL, function(err, data){
    if(err){
      console.log(err);
      res.status(500).send({"Message": "Internal Server Error"});
    }
    else{
        res.send(data);
    }
  });
});

app.get('/dashboard',function(req,res){

    res.render('dashboard');

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  
});





module.exports = app;