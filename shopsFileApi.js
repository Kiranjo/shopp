let express=require("express");
let app=express();
app.use(express.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
//const port =2410;
var port=process.env.PORT ||2410;

app.listen(port,()=>console.log(`Node app listening on port ${port}!`));
let {shopsData}=require("./shopsFileData.js");
let fs=require("fs");
let fname="shops.json";
//console.log(shopsData);

app.get("/resetData",function(req,res){
    let data=JSON.stringify(shopsData);
    fs.writeFile(fname,data,function(err){
        if(err) res.status(404),send(err);
        else res.send("Data in file is reset");
    });
});


 app.get("/shops",function(req,res){
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let shopsArray=JSON.parse(data);
            let shops=shopsArray.shops;
            res.send(shops);
        }
    });
});

app.post("/shops",function(req,res){
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if (err){ res.status(404).send(err+"error in read part");
   }
        else{
            let shopsArray=JSON.parse(data);
            let newShop={...body };
            shopsArray.shops.push(newShop);
            let data1=JSON.stringify(shopsArray);
          
            fs.writeFile(fname,data1,function (err){
                if(err){ res.status(404).send(err+"err in write part")
            }
                else{ 
                  
                    res.send(newShop)
                };
            });
        }
    });
});

app.get("/products",function(req,res){
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let shopsArray=JSON.parse(data);
            let shops=shopsArray.products;
            res.send(shops);
        }
    });
});
app.get("/products/:id",function(req,res){
    let id=+req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let shopsArray=JSON.parse(data);
            let shop=shopsArray.products.find((st)=>st.productId===id);
          if(shop)  res.send(shop);
          else res.status(404).send("No purchase found");
        }
    });
});
app.post("/products",function(req,res){
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if (err){ res.status(404).send(err+"error in read part");
   }
        else{
            let shopsArray=JSON.parse(data);
            let newShop={...body };
            shopsArray.products.push(newShop);
            let data1=JSON.stringify(shopsArray);
          
            fs.writeFile(fname,data1,function (err){
                if(err){ res.status(404).send(err+"err in write part")
            }
                else{ 
                  
                    res.send(newShop)
                };
            });
        }
    });
});

app.put("/products/:id",function(req,res){
    let body=req.body;
    let id=+req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if (err) res.status(404).send(err);
        else{
            let customersArray=JSON.parse(data);
            let index=customersArray.products.findIndex((st)=>st.productId===id);
            console.log(index);
            if(index>=0){
                updatedCustomer={...customersArray[index],...body};
                customersArray.products[index]=updatedCustomer;
                console.log(customersArray);
            let data1=JSON.stringify(customersArray);
            fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else res.send(updatedCustomer);
            });
        }else res.status(404).send("NO customer found");
    }
    });
});

 /*app.put("/products/:id",function(req,res){
    let body=req.body;
    let id=+req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if (err) res.status(404).send(err);
        else{
            let productsArray=JSON.parse(data);
            let index=productsArray.products.findIndex((st)=>st.productId==id);
            if(index>=0){
                updatedProduct={...productsArray[index],...body};
                productsArray[index]=updatedProduct;
            let data1=JSON.stringify(productsArray);
            console.log(data1);
            fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else res.send(updatedProduct);
            });
        }else res.status(404).send("NO product found");
    }
    });
});*/


app.get("/purchases",function(req,res){
    let shop=req.query.shop;
    let product=req.query.product;
    let sort=req.query.sort;
    console.log(product);

    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let shopsArray=JSON.parse(data);
            let shops=shopsArray.purchases;
          //  console.log(shops);
            if(shop){
                let shop1=shop.split("st");
                console.log(shop1);
             shops=shops.filter((st)=>shop1.find((b1)=>b1==st.shopId));
               }
               if(product){
                   let proArr1=product.split(",");    
           shops=shops.filter((rs)=>proArr1.find((b1)=>
            {
               let arr=b1.split("pr");
            return  arr.find((b1)=>b1==rs.productid);
           }));
        }
            if(sort==="QtyAsc"){
                shops.sort((st1,st2)=>+st1.quantity-(+st2.quantity));
            }
            if(sort==="QtyDesc"){
                shops.sort((st1,st2)=>+st2.quantity-(+st1.quantity));
            }
            if(sort==="ValueAsc"){
                shops.sort((st1,st2)=>+st1.quantity*+st1.price-(+st2.quantity*+st2.price));
            }
            if(sort==="ValueDesc"){
                shops.sort((st1,st2)=>+st2.quantity*+st2.price-(+st1.quantity*+st1.price));
            }
            res.send(shops);
        }
    });
});
app.get("/purchases/shops/:id",function(req,res){
    let id=+req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let shopsArray=JSON.parse(data);
            let shop=shopsArray.purchases.filter((st)=>st.shopId===id);
          if(shop)  res.send(shop);
          else res.status(404).send("No purchase found");
        }
    });
});
app.get("/purchases/products/:id",function(req,res){
    let id=+req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let shopsArray=JSON.parse(data);
            let shop=shopsArray.purchases.filter((st)=>st.productid===id);
          if(shop)  res.send(shop);
          else res.status(404).send("No purchase found");
        }
    });
});

app.get("/totalPurchase/shop/:id",function(req,res){
    let id=+req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let shopsArray=JSON.parse(data);
           let find=shopsArray.purchases.filter((st)=>st.shopId===id);
           console.log(find);
           let shop=find.reduce((acc,curr)=>{
            return acc+(curr.price*curr.quantity);
           },0)
           console.log("total val",shop);
       if (shop) res.send("total val="+shop);
          else res.status(404).send("No purchase found");
        }
    });
});
app.get("/totalPurchase/product/:id",function(req,res){
    let id=+req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let shopsArray=JSON.parse(data);
            let find=shopsArray.purchases.filter((st)=>st.productid===id);
            console.log(find);
            let shop=find.reduce((acc,curr)=>{
             return acc+(curr.price*curr.quantity);
            },0)
            console.log("total val",shop);
        if (shop) res.send("total val="+shop);
          else res.status(404).send("No purchase found");
        }
    });
});
app.post("/purchases",function(req,res){
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if (err){ res.status(404).send(err+"error in read part");
   }
        else{
            let shopsArray=JSON.parse(data);
            let newShop={...body };
            shopsArray.purchases.push(newShop);
            let data1=JSON.stringify(shopsArray);
          
            fs.writeFile(fname,data1,function (err){
                if(err){ res.status(404).send(err+"err in write part")
            }
                else{ 
                  
                    res.send(newShop)
                };
            });
        }
    });
});





