var mysql = require("mysql");
var inquirer = require("inquirer");
var exit=false;
// var product_name="";
// var department_name="";
// var price=0;
// var quantity=0;
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
    startManager();
  });
 
  var startManager= function(){
    if (!exit){
        inquirer
      .prompt([
          {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
              "Show all the items for sale",
              "Show all the low inventory",
              "Add new product to inventory",
              "Add to the inventory",
              "Exit the App"
            ]
          }
      ]).then(function(answer) {
        switch (answer.action) {
        case  "Show all the items for sale":
          show_items();

          break;
  
        case "Show all the low inventory":
         low_inventory();
          break;
  
        case "Add new product to inventory":
          add_product();
          break;
  
        case "Add to the inventory":
          add_inventory();
          break;

        case "Exit the App":
          exit = true;
          break;
        }
  
      });
    }
  } 

  var show_items= function()
    {
        var query= "SELECT * FROM PRODUCTS";
        connection.query(query, function (err, res) {

            if (err) throw err;
    
            for (var i = 0; i < res.length; i++) {
                console.log("Product ID: " + res[i].ITEM_ID + " || Product Name: " +
                    res[i].PRODUCT_NAME + " || Price: " + res[i].PRICE + "|| Quantity: "+ res[i].STOCK_QUANTITY);
            }
            startManager();
        });
        //connection.end();
       
    }
  var low_inventory= function()
    {
        var query= "SELECT * FROM PRODUCTS WHERE STOCK_QUANTITY<5";
        connection.query(query, function (err, res) {

            if (err) throw err;
    
            for (var i = 0; i < res.length; i++) {
                console.log("\n\nProduct ID: " + res[i].ITEM_ID + " || Product Name: " +
                    res[i].PRODUCT_NAME + " || Price: " + res[i].PRICE + "|| Quantity: "+ res[i].STOCK_QUANTITY);
            }
            startManager();

        });
        //connection.end();
       
    }
var add_product= function(){
    inquirer.prompt([
        {
          name:"product_name",
          type:"input",
          message: "Please state the product name:",
         
        },
        {
            name:"department_name",
            type: "input",
            message:"Please state Department: ",
           
        },
        {
            name:"price",
            type: "input",
            message:"Please state the price per unit: ",
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
    connection.query("INSERT INTO PRODUCTS SET ?", {
        PRODUCT_NAME: answer.product_name,
        DEPARTMENT_NAME: answer.department_name,
        PRICE: answer.price,
        STOCK_QUANTITY: answer.quantity
    }, function (err, res) {
        if (err) {
            throw err;
        } else {
            console.log("\n\n");
            console.log("\n\n****************** \n\n product was added successfully! \n\n");

        }
        startManager();
    });
});}
var add_inventory= function(){
    //show_items();
    // inquirer : ask product id and new quantity
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
    ]).then(function (answer)
        {
        // log new quantity to a var (updatedStockQuantity)
        var updatedStockQuantity=answer.quantity;
        var productID=answer.productID;
        var query= "UPDATE PRODUCTS SET? WHERE?";
            connection.query(query,[
            {
            STOCK_QUANTITY: updatedStockQuantity
            },
            {
            ITEM_ID:productID 
            }
        ],  function (err, res) 
        {
        if (err) throw err; 
        console.log("\n\n ***************************************")
        console.log("\n\n successfully added to the inventory");
        console.log("\n\n\n\n")
        //show_items();
        startManager();
        });
        
        });
   
      
}

