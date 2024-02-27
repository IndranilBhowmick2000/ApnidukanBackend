const mongoose = require("mongoose");

//connection url
const connection_url = "mongodb+srv://indranilbhowmick2:<password>@cluster0.cnrhljt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.set('strictQuery',true)
mongoose.connect(connection_url).then(()=>console.log("database is connected"))
.catch((error)=>console.log("error"))

module.exports= mongoose;
