const express=require("express");

const app=express();

app.use('/test',(req,res)=>{
    res.send("Hello from the server");
})
app.use('/',(req,res)=>{
    res.send("Hello from the dashboard");
})


app.listen(3000,()=>{
    console.log("Successfully listening on port 3000");
});
