const { get } = require('mongoose');
const Product = require('../models/Product');

//second
//here below we are aggregating multiple condition and creating one query to the server
const getProductStats = async (req, res) => { 
  try {
    
    const result = await Product.aggregate([
      {
        $match: {
          inStock: true,
          price: { $gte: 70 },
        },
      },
      //if there are more stages,the array of filtered documents would go to the next stage.But since we have only one stage,we will get the result of this stage in the result variable
      //stage 2: group documents
      {
        $group: {
          _id: "$category", //what do you want to group by.In this case, "$category" means that documents will be grouped by the category field. The $ sign indicates that category is a field in the documents.

          //The $avg operator calculates the average value of the specified field. Here, "$price" indicates that we want to calculate the average of the price field for each group of documents. The $ sign indicates that price is a field in the documents.
          ////"$price" give me average of all the price belongs to this category specified by _id.This is a new field that we are creating in the output documents. You can name this field anything you like. In this case, avgPrice is used to store the average price of the products in each category.
          //The result of this aggregation pipeline will be an array of documents, each representing a category and the average price of products in that category. Example is below
          avgPrice: {
            $avg: "$price",
          },
          count: {
            $sum: 1,
          }
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: result,
    });


  } catch (error) {
    console.log(e);
    res.status(500).json({ 
      success: false,
      message: 'Some error occured!' });
  }
}


//third
//and here we will learn some common aggregation operators
const getProductAnalysis = async (req, res) => { 
  try {

    const result = await Product.aggregate([
      {
        $match: {
          category: "Category 1",
        },
      },
      //When _id is set to null in the $group stage of an aggregation pipeline, it means that all the documents that pass through the previous stages will be grouped together into a single group. Essentially, you are not grouping by any specific field, and all documents are aggregated into one group.
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$price",
          },
          averagePrice: {
            $avg: "$price",
          },
          maxPrice: {
            $max: "$price",
          },
          minPrice: {
            $min: "$price",
          },
        },
      },
      {
        //Operator: This operator is used to include or exclude fields in the output documents.
        $project: {
          _id: 0, // Excludes the _id field from the output documents. By default, the _id field is included in the output, so setting it to 0 explicitly excludes it.
          totalRevenue: 1, //Includes the totalRevenue field in the output documents. The value 1 indicates that the field should be included.
          averagePrice: 1,
          maxPrice: 1,
          minPrice: 1,
          priceRange: {
            $subtract: ["$maxPrice", "$minPrice"], //the subtraction will occur in the order you pass in the array. In MongoDB's aggregation framework, the $subtract operator subtracts the second value from the first value.
          },
        },
      },
    ]);
    

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
}






//first
const insertSampleProducts = async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: "Product 11",
        price: 52.99,
        category: "Category 1",
        inStock: true,
        tags: ["tag1", "tag2"],
      },
      {
        name: "Product 12",
        price: 28.99,
        category: "Category 2",
        inStock: false,
        tags: ["tag3", "tag4"],
      },
      {
        name: "Product 13",
        price: 67.99,
        category: "Category 3",
        inStock: true,
        tags: ["tag5", "tag6"],
      },
      {
        name: "Product 14",
        price: 49.99,
        category: "Category 4",
        inStock: true,
        tags: ["tag7", "tag8"],
      },
      {
        name: "Product 15",
        price: 56.99,
        category: "Category 5",
        inStock: false,
        tags: ["tag9", "tag10"],
      },
      {
        name: "Product 16",
        price: 62.99,
        category: "Category 6",
        inStock: true,
        tags: ["tag11", "tag12"],
      },
      {
        name: "Product 17",
        price: 70.99,
        category: "Category 7",
        inStock: false,
        tags: ["tag13", "tag14"],
      },
      {
        name: "Product 18",
        price: 83.99,
        category: "Category 1",
        inStock: true,
        tags: ["tag15", "tag16"],
      },
      {
        name: "Product 19",
        price: 128.99,
        category: "Category 9",
        inStock: true,
        tags: ["tag17", "tag18"],
      },
      {
        name: "Product 20",
        price: 146,
        category: "Category 10",
        inStock: false,
        tags: ["tag19", "tag20"],
      },
    ];

    const result = await Product.insertMany(sampleProducts);
    
    res.status(201).json({
      success: true,
      message: `inserted ${result.length} products`,
      data: result,
    });
  } catch (error) {
    console.log(e);
    res.status(500).json({ 
      success: false,
      message: 'Some error occured!' });
  }
};


module.exports = { insertSampleProducts, getProductStats, getProductAnalysis };

/*
Yes, the insertMany method creates multiple documents based on the model and saves them to the database. The sampleProducts array contains multiple product objects, and insertMany will insert each of these objects as a separate document in the database.
The result will include an array of the inserted documents. Each document in the array will have the same properties as the objects in sampleProducts, plus an _id field automatically generated by MongoDB.

result:
[
  {
    _id: '603d2f2f8c1b2c001c8e4e1a',
    name: 'Product 1',
    price: 10.99,
    category: 'Category 1',
    inStock: true,
    tags: ['tag1', 'tag2'],
    __v: 0
  },

  ....etc.
]


*/



/*
explanation of aggregate method:
Why is price represented as an object?
In MongoDB, when you use operators like $gte (greater than or equal to), you need to specify them within an object. This is because MongoDB uses a specific syntax to define query operators. We also put match operator into the object.
1.$match Stage: This is an aggregation stage that filters documents.
2.Criteria Object: Inside the $match stage, you define the criteria for filtering documents. Each field you want to filter on is specified as a key in this object.
3.Operators: For fields where you need to use comparison operators (like $gte, $lte, etc.), you need to use an object to specify the operator and its value.


in the aggregation pipeline, each stage is represented as an object. The $match stage itself is an object, and it is one of the stages in the pipeline. The aggregation pipeline is an array of such stage objects.
The array [ ... ] contains the stages of the pipeline.
The object { $match: { ... } } is a single stage in the pipeline.



The result of this $match stage will be an array of documents that meet both criteria. These filtered documents are then passed to the next stage in the pipeline (if there is one). Since your pipeline has only one stage, the result will be the array of filtered documents.
An aggregation pipeline is a sequence of stages that process documents in a collection. Each stage transforms the documents as they pass through the pipeline. The output of one stage becomes the input for the next stage.

In MongoDB, operators like $match, $gte, $lte, etc., need to be specified within objects due to the syntax rules of MongoDB's query language. This allows MongoDB to clearly distinguish between field names and operators.
those operators are query operators.We are making a query to the database to get the documents that match the specified criteria.To do so we are using aggregate method and passing an array of stages to it.So that we can process transforms on documents by that aggregation pipeline(chain of stages).
our first pipeline stage is
{
        $match: {
          inStock: true,
          price: { $gte: 80 },
        }
      }
      
this.
*/


/*
Grouping result:
[
  {
    "_id": "Category 1",
    "avgPrice": 85.5
  },
  {
    "_id": "Category 2",
    "avgPrice": 90.0
  }
  // ... more categories
]

explanation of the flow of two stages:

First Stage: $match
Purpose: Filter documents based on specified criteria.
Criteria: inStock is true and price is greater than or equal to 70.
Result: An array of documents that meet these criteria.

Second Stage: $group
Purpose: Group the filtered documents by the category field and calculate the average price for each category.
Grouping Field: category
Aggregation: Calculate the average price ($avg) for each group.

The result of this aggregation pipeline will be an array of documents, each representing a category and the average price of products in that category. 

$sum:1
Purpose: The $sum: 1 expression is used to count the number of documents in each group.
How It Works: For each document in the group, $sum: 1 adds 1 to the sum. This effectively counts the total number of documents in each group.

example:
[
  {
    "_id": "Category 1",
    "avgPrice": 85, // (80 + 90) / 2
    "count": 2 // Two documents in Category 1
  },
  {
    "_id": "Category 2",
    "avgPrice": 100, // Only one document in Category 2
    "count": 1 // One document in Category 2
  }
]
*/