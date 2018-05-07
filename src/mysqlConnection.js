var mysql = require('mysql');

var pool  = mysql.createPool({
  host     : 'smartcity281.csjl3uczphdg.us-west-1.rds.amazonaws.com',
  user     : 'cmpe281user',
  password : 'qwerty1234',
  database : 'smartcity'
});
 

exports.executeQuery = function(query, callback){

	pool.getConnection(function(err, connection) {
	  // connected! (unless `err` is set)
	  console.log("Connection Successful");
	  	if(err){
	  		console.log(err);
	  		callback(err);
	  	}
	  	else{
		 	connection.query(query, function (error, results, fields) {
			    // And done with the connection.
			    connection.release();
			 
			    // Handle error after the release.
			    if (error) {
			    	callback(error);
			    }
			    else{
			    	callback(null, results);
			    }
			 
			    // Don't use the connection here, it has been returned to the pool.
		  	});	  	
	  	}

	});
}