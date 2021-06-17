const path=require('path');
const express=require('express');
const hbs=require('hbs');
const bodyParser=require('body-parser');
const mongodb=require('mongodb');
const app=express();
var MongoClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/abdemo2";

//create connection

var dbo;
MongoClient.connect(url,function(err,db){
    if(err) throw err;
    //console.log("Database created!");
    dbo=db.db("crud_db");   
})
//connect to database
// conn.connect((err) =>{
//     if(err) throw err;
//     console.log('Mysql Connected...');
// });

//set views files
app.set('views',path.join(__dirname,'views'));

//set view engine
app.set('view engine','hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//set public folder as static folder for static file

app.use('/assests',express.static(__dirname+ '/public'));

//route for homepage

app.get('/',(req,res) =>{
    var mysort={name:1};
    //dbo.collection("product").find({},function(err,results){
        dbo.collection("product").find().sort(mysort).toArray (function(err,results){
        if(err) throw err;
        //console.log("1 record inserted!");
        res.render("product_views",{results:results});
        //db.close();
    });
});

//route for insert data

app.post('/saveproduct',(req, res)=>{
    let data = {product_id:req.body.id, product_name:req.body.name, product_price:req.body.price};
    dbo.collection("product").insertOne(data,function(err,res){
        if(err) throw err;
        console.log("1 record inserted!");
        //db.close();
       
    });
    res.redirect("/")
   
});

app.get('/productadd',(req,res)=>{
    res.render('product_a');
});

app.get('/productdelete/:name',(req, res)=>  {
    const name=req.params.name;
    console.log(name);
    var myquery = {product_name:name}
    dbo.collection("product").deleteOne(myquery, function(err,result){
        if(err) throw err;
        console.log("1 document deleted");
           });
           res.redirect("/");
    });


    app.get('/productedit/:name',(req, res)=> {
        const name=req.params.name;
        console.log(name);
        var obj = {"product_name": name};
        dbo.collection("product").findOne(obj,function(err,result){
          if(err) throw err;
          console.log(result.product_name);
          res.render('product_edit',{
          results: result
        });
        });
        });
  
        app.post('/updateproduct', (req,res)=>{
          let data ={product_id:req.body.id, product_name:req.body.name, product_price:req.body.price};
          var myquery = {product_name: req.body.name};
          var newvalues = {$set: {product_name: req.body.name, product_price:req.body.price}};
           dbo.collection("product").updateOne(myquery, newvalues, function(err,res){
               if(err) throw err;
               console.log("1 document updated");
           });
           res.redirect("/");
    });


//server listening 
app.listen(8000,()=>{
    console.log('Server is running at port 8000');
});