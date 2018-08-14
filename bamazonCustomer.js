var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    //  username
    user: "root",
    //  password
    password: "root",
    database: "bamazon"
  });
  connection.connect(function(err) {
    if (err) throw err;
    show_items();
  });
       
var show_items=function() {
        
    var query = "SELECT * FROM PRODUCTS";
    connection.query(query, function (err, res) {

        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].ITEM_ID + " || Product Name: " +
                res[i].PRODUCT_NAME + " || Price: " + res[i].PRICE);
        }

       
requestProduct();
    });
  }

  var requestProduct=function(){
      inquirer.prompt([
        {
          name:"productID",
          type:"input",
          message: "Please state the product id :",
          validate: function(value)
          {
              if (isNaN(value)=== false){
                  return true;
              }
              else false;
          }
        },
        {
            name:"quantity",
            type: "input",
            message:"Please state the quantity: ",
            validate: function(value)
            {
              if (isNaN(value)=== false){
                  return true;
              }
              else false;
            } 
        }
    ]).then(function (answer){
        // Queries database for selected product.
        var query = "SELECT PRODUCT_NAME, PRICE, STOCK_QUANTITY, DEPARTMENT_NAME FROM products WHERE ?";
        connection.query(query, {
            ITEM_ID: answer.productID
        }, function (err, res) {

            if (err) throw err;

            var available_quantity= res[0].STOCK_QUANTITY;
            var price_per_unit = res[0].PRICE;
            //var productSales = res[0].product_sales;
            var productDepartment = res[0].DEPARTMENT_NAME;

            // Check if there's enough inventory  to process user's request.
            if (available_quantity >= answer.quantity) {
                    
                // Processes user's request passing in data to complete purchase.
               completePurchase(available_quantity, price_per_unit, productDepartment, answer.productID, answer.quantity);
            } else {

                // Tells user there isn't enough stock left.
                console.log("There isn't enough stock left!");

                // Lets user request a new product.
                requestProduct();
            }
        });
    })
  }

  var completePurchase= function(available_quantity,price,productDepartment,productID,quantity){
      var updatedStockQuantity=available_quantity-quantity;
      var totalPrice=price*quantity;

      var query="UPDATE PRODUCTS SET ? WHERE? ";
     
      connection.query(query,[{
          STOCK_QUANTITY: updatedStockQuantity
      },{
         ITEM_ID:productID 
      }],  function (err, res) {

        if (err) throw err; 
        // Tells user purchase is a success.
        console.log("Yay, your purchase is complete.");

        // Display the total price for that purchase.
        console.log("total price="+ totalPrice);
        console.log("\n Your purchase is complete without payment (Add payment method later) Cheers ");
    });

  };
  


