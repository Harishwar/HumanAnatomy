module.exports = router;
var express = require('express');
var router = express.Router();
var mysql  = require('mysql');
var resRows;
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/notes',function(req,res) {
    resRows = "error";
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'gopal',
        database: '297'
    });
    var status;
    connection.connect();
    var queryString = "select username, xcoord, ycoord, message from user where username = '"+req.query.userName+"'";
    console.log(queryString);
    connection.query(queryString, function(err, rows, fields) {
        if (err) throw err;
        //resRows=JSON.stringify(rows);
        res.json(rows);
    });
    console.log(resRows)
    //res.end(resRows);
});

router.post('/notes',function(req,res){

    console.log(req.body);
    var objArray = req.body;
    var olen=objArray.length;
    for(var i=0; i<olen;i++)
    {

        var message = objArray[i].msg;
        var userName= objArray[i].userName;
        var x_coord = objArray[i].x;
        var y_coord = objArray[i].y;
        var connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'gopal',
            database: '297'
        });
        var status;
        connection.connect();

        var inserttablequery = "INSERT INTO user(username,xcoord,ycoord,message) VALUES ('" + userName + "','" + x_coord + "','" + y_coord + "','" + message+"')";
        console.log(inserttablequery);
        connection.query(inserttablequery, function(error, rows, fields) {
            if (error) { return console.log(error);
                res.send(error.body)
                status = 500;
            }
        });
        if(status==500)
        {
            res.status(500)
        }
        else
        {
            res.status(200)
        }
        res.end();
    }


});


module.exports = router;