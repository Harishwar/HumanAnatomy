module.exports = router;
var express = require('express');
var router = express.Router();
var mysql  = require('mysql');
var bcrypt = require('bcrypt');
var resRows="";

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/viewmodels', function(req, res) {
    res.render('viewmodels', { title: 'Express' });
});

router.get('/makenote', function(req, res) {
    res.render('makenote', { title: 'Express' });
});

router.get('/makemodels', function(req, res) {
    res.render('makemodels', { title: 'Express' });
});

router.get('/home', function(req, res) {
    res.render('home', { title: 'Express' });
});

router.get('/bodybrowser', function(req, res) {
    res.render('bodybrowser', { title: 'Express' });
});

router.get('/heartviewer', function(req, res) {
    res.render('HeartViewer', { title: 'Express' });
});

router.get('/skeletonviewer', function(req, res) {
    res.render('skeletonViewer', { title: 'Express' });
});

router.get('/bodyviewer', function(req, res) {
    res.render('bodyViewer', { title: 'Express' });
});

router.post('/register',function(req,res){
   var username = req.body.userName_r;
    var pass = req.body.pass_r;
    var name = req.body.flname;
    if(username==undefined || username==""||pass==undefined||pass=="")
    {
        res.render("index", { title: 'Express' });
        return;
    }
    var status = 200;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(pass, salt, function(err, hash) {
            // Store hash in your password DB.
            var connection = mysql.createConnection({
                host     : '*******.cvigtrqbp4hp.us-west-1.rds.amazonaws.com',
                user     : 'root',
                password : 'password',
                database: 'cmpe297'
            });
            connection.connect();

            var inserttablequery = "INSERT INTO Registration(username,password, name) VALUES ('" + username + "','" + hash+"','"+name+"')";
            console.log(inserttablequery);
            connection.query(inserttablequery, function(error, rows, fields) {
                if (error) { return console.log(error);
                    res.send(error.body)
                    status = 500;
                    return;
                }
            });

        });
    });
    if(status==200)
    {
        res.render("index",{ title : "Express"});
    }
    else
    {
        res.render("error",{title:"Express"});
    }
});

router.post('/login', function(req,res){
   var username = req.body.userName;
    var pass = req.body.pass;
    if(username==undefined || username==""||pass==undefined||pass=="")
    {
        res.render("index", { title: 'Express' });
        return;
    }

    var connection = mysql.createConnection({
        host     : '*******.cvigtrqbp4hp.us-west-1.rds.amazonaws.com',
        user     : 'root',
        password : 'password',
        database: 'cmpe297'
    });
    var status;
    connection.connect();
    console.log(connection);
    var queryString = "select username,password from Registration where username = '"+username+"'";
    console.log(queryString);
    connection.query(queryString, function(err, rows, fields) {
        console.log("err"+err);
        console.log(rows);
        resRows=rows;
        if(resRows.length==0)
        {
            res.render("index", { title: 'Express' });
        }
        var passHash = resRows[0].password;
        console.log(passHash);
        bcrypt.compare(pass, passHash, function(err, result) {
            if(result)
            {
                res.render("home", { title: 'Express' });
            }
            else
            {
                res.render("index", { title: 'Express' });
               // res.json({"error":"2", "message":"incorrect credentials"});
            }
        });

    });
    console.log(resRows);
});

router.get('/notes',function(req,res) {
    resRows = "error";
    var connection = mysql.createConnection({
        host     : '*******.cvigtrqbp4hp.us-west-1.rds.amazonaws.com',
        user     : 'root',
        password : 'password',
        database: 'cmpe297'
    });
    var status;
    connection.connect();
    var queryString = "select username, xcoord, ycoord, message, width, height from user where username = '"+req.query.userName+"'";
    console.log(queryString);
    connection.query(queryString, function(err, rows, fields) {
        if (err) throw err;
        //resRows=JSON.stringify(rows);
        console.log(rows);
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
        var width = objArray[i].width;
        var height = objArray[i].height;
        var connection = mysql.createConnection({
            host     : '*******.cvigtrqbp4hp.us-west-1.rds.amazonaws.com',
            user     : 'root',
            password : 'password',
            database: 'cmpe297'
        });
        var status;
        connection.connect();

        var inserttablequery = "INSERT INTO user(username,xcoord,ycoord,message,width,height) VALUES ('" + userName + "','" + x_coord + "','" + y_coord + "','" + message+"','"+width+"','"+height+"')";
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