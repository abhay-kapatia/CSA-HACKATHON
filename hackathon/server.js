var express = require("express");
var path = require("path");
var sql = require("mysql");
var app = express();

app.use(express.static("public"));

app.listen(5151, function () {
    console.log("server started");
})

app.get("/raise", function (req, resp) {
    var filepath = path.join(path.resolve(), "public", 'RaiseFund.html');
    resp.sendFile(filepath);
})

var dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "csa-hackathon",
}
//to check that connected or not
var dbcon = sql.createConnection(dbConfig);
dbcon.connect(function (err, req, resp) {
    if (err)
        console.log("Nada");
    else
        console.log("Tada");
})

var fileupload = require("express-fileupload");// to upload file in server install npm install express-fileupload
const req = require("express/lib/request");
app.use(fileupload());

app.use(express.urlencoded({ extended: true }));

app.post("/raise-s", function (req, resp) {
    //console.log(req.body.mbl);
    //var name=req.body.user;
    //req.body.user=name;
    if (req.files == null) {
        req.body.prfname = "default_profile_avatar.svg"
    }
    else {
        //for uploading file in server
        req.body.prfname = req.files.input_file.name;
        var data = path.join(path.resolve(), "public", "uploads", req.files.input_file.name);
        req.files.input_file.mv(data);
    }
    //var data=[req.body.txtname,req.body.email,req.body.mbl,req.body.adr,req.body.city];

    var data = [req.body.title, req.body.name, req.body.mail, req.body.num, req.body.msg, req.body.amt];
    dbcon.query("insert into fundraise values(?,?,?,?,?,?)", data, function (err) {
        if (err) {
            resp.send(err.message);
        }
        else {
            resp.send("Tada");
        }
    })

    //resp.send(req.body);
})

app.post("/donate-s", function (req, resp) {
    //console.log(req.body.mbl);
    //var name=req.body.user;
    //req.body.user=name;
    //var data=[req.body.txtname,req.body.email,req.body.mbl,req.body.adr,req.body.city];
    var data = [req.body.name, req.body.mail, req.body.num, req.body.amt];
    dbcon.query("insert into donate values(?,?,?,?,0)", data, function (err) {
    if (err) {
        resp.send(err.message);
    }else{
        resp.send("tada2");
    }
})  
    //pay(data,req,resp);

    //resp.send(req.body);
})
app.post("/donate-s2", function (req, resp) {
    //console.log(req.body.mbl);
    //var name=req.body.user;
    //req.body.user=name;
    //var data=[req.body.txtname,req.body.email,req.body.mbl,req.body.adr,req.body.city];
    var data = [req.body.payment_id, req.body.mail];
    dbcon.query("update donate set payment_id=? where mail=?", data, function (err) {
    if (err) {
        resp.send(err.message);
    }else{
        resp.send("tada3");
    }
})  
    //pay(data,req,resp);

    //resp.send(req.body);
})

app.post("/challenge-s", function (req, resp) {
    //console.log(req.body.mbl);
    //var name=req.body.user;
    //req.body.user=name;
    if (req.files == null) {
        req.body.picname = "default_profile_avatar.svg"
    }
    else {
        //for uploading file in server
        req.body.picname = req.files.pic.name;
        var data = path.join(path.resolve(), "public", "uploads", req.files.pic.name);
        req.files.pic.mv(data);
    }
    //var data=[req.body.txtname,req.body.email,req.body.mbl,req.body.adr,req.body.city];

    var data = [req.body.email, req.body.caption, req.body.picname];
    dbcon.query("insert into challenge values(?,?,?,0)", data, function (err) {

        if (err) {
            resp.send(err.message);
        }
        else {
            resp.send("Tada");
            //counter++;
        }
    })

    //resp.send(req.body);
})

app.get("/client-fetch", function (req, resp) {
    dbcon.query("select * from fundraise", function (err, res) {
        if (err)
            resp.send(err);
        else
            resp.send(res);

    })
})

