var express = require('express');
var path = require('path');
global.appRootDir = path.resolve(__dirname);
var mysql = require('mysql');
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
app.get('/admin',function (req,res) {
    res.render("admin")
});
app.get('/table',function(req,res){
    res.render('table')
});
app.get('/sensormanagement',function (req,res) {
    var get_stations_SQL = "SELECT station_id, station_title FROM smartcity.station";

    mysql_connection.executeQuery(get_stations_SQL, function (err, stations) {
        if (err)
            throw new Error(err);

        res.render('sensormanagement', {stations: stations});
    });
})

app.get('/stationmanagement',function (req,res) {

    var get_cities_SQL = "SELECT city_id, city_name FROM smartcity.city";
    mysql_connection.executeQuery(get_cities_SQL, function(err, cities){
            if(err)
                throw new Error(err);

            res.render('stationmanagement', {cities: cities});
        })
    });

app.get('/sensordelete', function(req, res){
    var get_sensors_SQL = "SELECT sensor_id, sensor_title FROM smartcity.sensor";
    mysql_connection.executeQuery(get_sensors_SQL, function(err, sensors){
        if(err)
            throw new Error(err);

        res.render('sensordelete', {sensors: sensors});
    });

});

app.get('/stationdelete', function(req, res){
    var get_stations_SQL = "SELECT station_id, station_title FROM smartcity.station";

    mysql_connection.executeQuery(get_stations_SQL, function (err, stations) {
        if (err)
            throw new Error(err);

        res.render('stationdelete', {stations: stations});


    });

});

app.get('/stationupdate', function(req, res){
    var get_stations_SQL = "SELECT station_id, station_title FROM smartcity.station";

    mysql_connection.executeQuery(get_stations_SQL, function (err, stations) {
        if (err)
            throw new Error(err);

        res.render('stationupdate', {stations: stations});


    });

});

app.get('/sensorupdate', function(req, res){
    var get_sensors_SQL = "SELECT sensor_id, sensor_title FROM smartcity.sensor";

    mysql_connection.executeQuery(get_sensors_SQL, function (err, sensors) {
        if (err)
            console.log(err);

        res.render('sensorupdate', {sensors: sensors});


    });

});



app.post('/admincheck',function(req,res){

  if(req.body.username=="admin" && req.body.password=="admin"){
    res.render('admin')
  }

});

app.post("/stationsubmit", function (req, res) {


    var cityid = req.body.cityid;
    var stationtitle = req.body.stationtitle;
    var stationdesc = req.body.stationdesc;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var isactive = req.body.isactive;
console.log(cityid);

    // con.connect(function(err) {

        // if (err) throw err;

        var sql = "INSERT INTO smartcity.station (`city_id`, `station_title`, `station_desc`, `lat`, `lng`, `isactive`) VALUES ('"+cityid+"','"+stationtitle+"', '"+stationdesc+"', '"+latitude+"', '"+longitude+"', '"+isactive+"')";

        mysql_connection.executeQuery(sql, function (err, result) {

            if (err) throw err;

            console.log("1 record inserted");

            res.render("/stationsubmit");
        });
    // }


})


app.post("/stationupdate", function (req, res) {


    var stationid= req.body.stationid;
    //var stationtitle = req.body.stationtitle;
    var stationdesc = req.body.stationdesc;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var isactive = req.body.isactive;
    //console.log(cityid);

    // con.connect(function(err) {

    // if (err) throw err;

    var sql = "UPDATE smartcity.station SET station_desc='"+stationdesc+"', lat='"+latitude+"', lng='"+longitude+"', isactive='"+isactive+"' WHERE station_id='"+stationid+"'";

    mysql_connection.executeQuery(sql, function (err, result) {

        if (err) throw err;

        console.log("1 record updated");

        res.render("/stationmanagement");
    });
    // }


})
app.post("/stationdelete", function (req, res) {


    var stationid = req.body.stationid;
    console.log(stationid);



    // con.connect(function(err) {

    // if (err) throw err;

    var sql = "DELETE FROM smartcity.station WHERE station_id ='"+stationid+"'";

    mysql_connection.executeQuery(sql, function (err, result) {

        if (err) throw err;

        console.log("1 record deleted");

        res.render("stationdelete");
    });
    // }


})

app.post("/sensorsubmit", function (req, res) {


    var sensorserial = req.body.sensorserial;
    var stationid = req.body.stationid;
    var sensortitle = req.body.sensortitle;
    var sensordesc = req.body.sensordesc;
    var isactive = req.body.isactive;



    // con.connect(function(err) {
    //
    //     if (err) throw err;

        var sql = "INSERT INTO smartcity.sensor (`station_id`, `sensor_title`, `sensor_desc`, `sensor_serial`, `isactive`) VALUES ('"+stationid+"','"+sensortitle+"', '"+sensordesc+"', '"+sensorserial+"', '"+isactive+"')";

        mysql_connection.executeQuery(sql, function (err, result) {

            if (err) throw err;

            console.log("1 record inserted");

            res.render("sensormanagement");


        });

});

app.post("/sensorupdate", function (req, res) {


    var sensorserial = req.body.sensorserial;
    var sensorid = req.body.sensorid;
    //  var sensortitle = req.body.sensortitle;
    var sensordesc = req.body.sensordesc;
    var isactive = req.body.isactive;
    //console.log(cityid);

    // con.connect(function(err) {

    // if (err) throw err;

    var sql = "UPDATE smartcity.sensor SET sensor_serial='" + sensorserial + "', sensor_desc='" + sensordesc + "', isactive='" + isactive + "' WHERE sensor_id='" + sensorid + "'";

    mysql_connection.executeQuery(sql, function (err, result) {

        if (err) throw err;

        console.log("1 record updated");

        res.render("/sensormanagement");
    });
});






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next();
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
