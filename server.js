

const express = require("express");
const cors = require("cors");
// const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const Products = require("./products");
const Orders = require("./Orders");

const Users = require("./Users");

// const Address= require("./Address")

const stripe = require("stripe")("sk_test_51OnCUhSJZYdrsnMjdO3e16aDbOrJjy1SFjomlt9v4BjK5TDZhpwG2tjG37CzCgCx7Pqce7Tz7IeLOOpjEnQrL6ud001e9Zohcx");

const app = express();
// const EC= require("./Controller")


const port = 8000;


//middleware
app.use(express.json());
app.use(cors());//due to different ports in frontend and backend


// API

app.get("/", (req, res) => res.status(200).send("Home Page"));


// //connection url
// const connection_url = "mongodb+srv://indranilbhowmick2:<ganger100>@cluster0.cnrhljt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// mongoose.set('strictQuery',true)
// mongoose.connect(connection_url).then(()=>console.log("database is connected"))
// .catch((e)=>console.log("error"))

//api to add products(to navbar)
app.post('/products/add', (req, res) => {
  const productDetail = req.body;

  console.log("Product Detail >>>>", productDetail);

  Products.create(productDetail).then((data) => {
    if (data) {
      res.status(201).send(data);
    }
  }).catch((err) => res.status(500).send(err.message))
})


//api to get products from db (to Home,js)
// app.get('/products/get',EC.getproducts)
app.get("/products/get", (req, res) => {

  Products.find().then((data) => {
    if (data) {
      res.status(200).send(data);
    }
  }).catch((err) => res.status(500).send(err))

});


//api for payment(to payment.jsx)
app.post("/payment/create", async (req, res) => {
  const total = req.body.amount;
  console.log("Payment Request recieved for this ruppess", total);

  const payment = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: "inr",
  });

  res.status(201).send({
    clientSecret: payment.client_secret,
  });
});


// API TO add ORDER DETAILS(to payment.jsx)

app.post("/orders/add", (req, res) => {
  const products = req.body.basket;
  const price = req.body.price;
  const email = req.body.email;
  const address = req.body.address;

  const orderDetail = {
    products: products,
    price: price,
    address: address,
    email: email,
  };
  // console.log("order details=",orderDetail);

  Orders.create(orderDetail).then((result)=>{
    if (result) {
      console.log("order added to database >> ", result);
    }
  }).catch((err)=> console.log(err)) 
  // (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("order added to database >> ", result);
  //   }
  // });
});

// app.post("/orders/get", (req, res) => {
//   const email = req.body.email;
//   Orders.find((err,result)=>{
//     if (err) {
//       console.log(err);
//     } else {
//       const userOrders = result.filter((order) => order.email === email);
//       res.send(userOrders);
//     }
//   })
// })



app.post("/orders/get", (req, res) => {
  const email = req.body.email;

  Orders.find().then((result)=>{
    if (result) {
      const userOrders = result.filter((order) => order.email === email);//to filter out email of two different user who ordered
      res.send(userOrders);
    }
  }).catch((err)=>console.log(err)) 
  
 
});


// API for SIGNUP

app.post("/auth/signup", async (req, res) => {
  const { email, password, fullName } = req.body;

  const encrypt_password = await bcrypt.hash(password, 10);

  const userDetail = {
    email: email,
    password: encrypt_password,
    fullName: fullName,
  };

  const user_exist = await Users.findOne({ email: email });

  if (user_exist) {
    res.send({ message: "The Email is already in use !" });
  } else {
    Users.create(userDetail).then((result)=>{
      if (result) {
        res.send({ message: "User Created Succesfully" });
      }
    }).catch((err)=> res.status(500).send({ message: err.message }))
  }
});

// Users.create(userDetail, (err, result) => {
//   if (err) {
//     res.status(500).send({ message: err.message });
//   } else {
//     res.send({ message: "User Created Succesfully" });
//   }
// });


// API for LOGIN

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const userDetail = await Users.findOne({ email: email });

  if (userDetail) {
    if (await bcrypt.compare(password, userDetail.password)) {
      res.send(userDetail);
    } else {
      res.send({ error: "invaild Password" });
    }
  } else {
    res.send({ error: "user is not exist" });
  }
});


// API for Address

// app.post("/auth/address", async (req, res) => {
//   const {  fullName,
//     phone,
//     flat,
//     city,
//     state } = req.body;

//   // const encrypt_phone = await bcrypt.hash(phone, 10);

//   const addressDetail = {
//     fullName: fullName,
//     phone:phone,
//     flat:flat,
//     city:city,
//     state:state
//   };

//   const address_exist = await Address.findOne({ phone: phone });

//   if (address_exist) {
//     res.send(addressDetail);
//   } else {
//     Address.create(addressDetail).then((result)=>{
//       if (result) {
//         res.send(addressDetail);
//       }
//     }).catch((err)=> res.status(500).send({ message: err.message }))
//   }
// });



app.listen(port, () => {
  console.log(`server is running on port number ${port}`);
});


