const express=require("express")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const userRoute=require("./routes/user")
const authRoute=require("./routes/auth")
const productRoute=require("./routes/product")
const cartRoute=require("./routes/cart")
const orderRoute=require("./routes/order")
const stripeRoute = require("./routes/stripe");
const searchRoute = require("./routes/searchBar");
const cors=require("cors")

const app=express();

dotenv.config();

mongoose.connect(process.env.MONGO_URL
).then(()=>console.log("DB connection successful!"))
.catch((err)=>{
    console.log(err);
})

app.use(express.json());
app.use(cors({
    origin:["https://imart.onrender.com","http://localhost:3000"]
}));

app.use("/auth",authRoute)
app.use("/users",userRoute)
app.use("/products",productRoute)
app.use("/carts",cartRoute)
app.use("/orders",orderRoute)
app.use("/checkout", stripeRoute);
app.use("/search", searchRoute);


app.listen(process.env.PORT||5000,()=>{
    console.log("Server started")
})
