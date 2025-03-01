const express = require('express');
const connectToDB = require('./database/db');
require('dotenv').config();
const app = express();
const productRoutes = require('./routes/product-routes');
const bookRoutes = require('./routes/book-routes');


const port = process.env.PORT || 3000;
connectToDB();



app.use(express.json());
app.use("/products", productRoutes);
app.use("/reference",bookRoutes);



app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
});



//we will learn
//understand the aggregation pipeline
//using common aggregation operators
//understanding document references
//populating referenced documents
