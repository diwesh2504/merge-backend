const express=require('express');
const app=express();
const mongodb=require('mongodb');
const bodyParser=require('body-parser');
const cors=require('cors');
//const url="mongodb://localhost:27017";
const url="mongodb+srv://admin:admin123@cluster0.sln75.mongodb.net/merge?retryWrites=true&w=majority";
app.use(bodyParser());
app.use(cors());

app.post("/addtodos", async (req,res)=>{
    try{
       let client=await mongodb.connect(url); 
       let db=client.db("merge");
       let data=await db.collection("todo").insertOne({
           "_id":req.body.id,
           "title":req.body.title
       })
       
       res.send(data.ops);
       client.close();
    }catch(err){
        console.log("Couldnt add todos");
    }
});

app.get("/gettodos", async (req,res)=>{
    try{
        let client=await mongodb.connect(url); 
        let db=client.db("merge");
        let data=await db.collection("todo").find().toArray();
        res.send(data);
        client.close(); 

    }catch(err){
        console.log("Couldnt get todos")
    }
})
app.get("/deletetodos/:id", async (req,res)=>{
    console.log(req.params.id);
    try{
        let client=await mongodb.connect(url); 
        let db=client.db("merge");
        db.collection("todo").deleteOne({
            "_id":+req.params.id
        })
        res.send({"action":"Delete"});
        console.log("Delete")
        client.close(); 

    }catch(err){
        console.log("Couldnt get todos")
    }
})
app.get("/getstatus", async(req,res)=>{
    try{
        let client=await mongodb.connect(url); 
        let db=client.db("merge");
        let data=await db.collection("status").find().toArray();
        res.send(data);
        client.close(); 
    }catch(err){
        console.log("Couldnt Fetch Status")
    }
})

app.post("/addstatus", async (req,res)=>{
    try{
       let client=await mongodb.connect(url); 
       let db=client.db("merge");
       let data=await db.collection("status").insertOne({
           "_id":req.body.id,
           "status":req.body.status,
           "likes":0
       })
       console.log(data);
       res.send(data.ops);
       client.close();
    }catch(err){
        console.log("Couldnt add status");
    }
});
app.get('/likes/:id', async (req,res)=>{
    console.log(req.params)
    try{
        let client=await mongodb.connect(url);
        let db=client.db("merge");
        let data=await db.collection("status").findOneAndUpdate(
            { "_id" : +req.params.id },
             { $inc: { "likes" : 1} },
             {returnOriginal:false}
        );
        console.log(data);
        res.send(data.value);
        client.close();
    }catch(err){
        console.log(err)
    }

})
app.listen(process.env.PORT||4040,()=>{
    console.log("listening");
} )