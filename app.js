const express = require('express');
const db = require('./db/db.js');
const bodyParser = require('body-parser');
const serveStatic = require("serve-static")
const path = require('path');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(serveStatic(path.join(__dirname, 'dist')));
const PORT = process.env.PORT || 80;
//const INDEX = path.join(__dirname, 'index.html');




// Get all items
app.get('/items', (req, res) => {
    db.getItems((err, result) => {
        if (err) {
            console.log("err");
            console.log(err);
            res.status(400).send({
                success: false
            });
        }
        else {
            res.status(200).send({
                items: result
            });
        }
    });
});

//Get item by id
app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.getItem(id, (err, result) => {
        if (err) {
            console.log("err");
            console.log(err);
            res.status(400).send({
                success: false
            });
        }
        if (result != undefined && result.length != 0) {
            res.status(200).send({
                cart: result
            });
        }
        else {
            res.status(404).send({
                success: false,
                message: 'id not found'
            });
        }
    });
});

// Modify item by id
app.post('/items/:id', (req, res) => {
    console.log(req.body);
    if (!req.body.name) {
        res.status(400).send({
            success: false,
            message: 'body is missing'
        });
    } else {
        const item = req.body;
        db.updateItem(item, (err, result) => {
            if (err) {
                console.log("err");
                console.log(err);
                res.status(400).send({
                    success: false
                });
            }
            else {
                res.status(200).send({
                    success: true
                });
            }
        });
    }
});

// delete item by id
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.deleteItem(id, (err, result) => {
        if (err) {
            console.log("err");
            console.log(err);
            res.status(400).send({
                success: false
            });
        }
        res.status(200).send({
            success: true
        });
    });

});

//Get carts by ID
app.get('/cart/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.getCartByID(id, (err, result) => {
        if (err) {
            console.log("err");
            console.log(err);
            res.status(400).send({
                success: false
            });
        }
        if (result != undefined && result.length != 0) {
            res.status(200).send({
                cart: result
            });
        }
        else {
            res.status(404).send({
                success: false,
                message: 'id not found'
            });
        }
    });
});

// add an item or update quantity o an item to cart
app.post('/cart/:id', (req, res) => {
    const customerid = parseInt(req.params.id);
    const item = req.body.item;
    const quantity = req.body.quantity;
    const type = req.body.type;
    if (type === 'add') {
        db.addToCart(customerid, item, quantity, (err, result) => {
            if (err) {
                console.log("err");
                console.log(err);
                res.status(400).send({
                    success: false
                });
            }
            else {
                res.status(200).send({
                    success: true
                });
            }
        });
    } else if (type === 'update') { //update quantity of item
        db.updateCart(customerid, item, quantity, (err, result) => {
            if (err) {
                console.log("err");
                console.log(err);
                res.status(400).send({
                    success: false
                });
            }
            else {
                res.status(200).send({
                    success: true
                });
            }
        });
    }
});
//delete item from cart id
app.delete('/cart/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = req.body.item;
    db.deleteFromCart(id, item, (err, result) => {
        if (err) {
            console.log("err");
            console.log(err);
            res.status(400).send({
                success: false
            });
        }
        else {
            res.startus(200).send({
                sucess: true
            });
        }
    });
});
// create new order
app.post('/order/:id', (req, res) => {
    const customerid = parseInt(req.params.id);
    const total = req.body.total;
    const payment = req.body.payment;
    const items = req.body.items;
    db.createNewOrder(customerid, total, payment, (err, orderid) => {
        if (err) {
            console.log("err");
            console.log(err);
            res.status(400).send({
                success: false
            });
        }
        else {
            console.log(orderid);
            itemsArr = [];
            items.forEach(item => {
                itemsArr.push([orderid, item.id, item.quantity]);
            });
            console.log(itemsArr);
            db.addItemToOrder(itemsArr, (err, result) => {
                if (err) {
                    console.log("error");
                    console.log(err);
                }
            })
            res.status(200).send({
                success: true
            });
        }
    });
});
//Get items in order
app.get('/order/:id', (req, res) => {
    const orderid = parseInt(req.params.id);
    db.getItemsInOrder(orderid, (err, result) => {
        if (err) {
            console.log("err");
            console.log(err);
            res.status(400).send({
                success: false
            });
        }
        else {
            res.status(200).send({
                order: result
            });
        }
    });
});
// get orders by customer
app.get('/customer/orders/:id', (req, res) => {
    const customerid = parseInt(req.params.id);
    //console.log(req.body);
    //const customerid = req.body.id;
    db.getOrders(customerid, (err, result) => {
        if (err) {
            console.log("err");
            console.log(err);
            res.status(400).send({
                success: false
            });
        }
        else {
            res.status(200).send({
                orders: result
            });
        }
    });
});
//get customer info
app.get('/customer/:id', (req, res) => {
    const customerid = parseInt(req.params.id);
    db.getCustomer(customerid, (err, customerinfo) => {
        if (err) {
            console.log("err");
            console.log(err);
            res.status(400).send({
                success: false
            });
        }
        else {
            db.getAddresses(customerid, (err, addresses) => {
                if (err) {
                    console.log("err");
                    console.log(err);
                    res.status(400).send({
                        success: false
                    });
                }
                else {
                    db.getPayments(customerid, (err, payments) => {
                        if (err) {
                            console.log("err");
                            console.log(err);
                            res.status(400).send({
                                success: false
                            });
                        }
                        else {
                            res.status(200).send({
                                customerinfo: customerinfo,
                                addresses: addresses,
                                payments: payments
                            });
                        }
                    });
                }
            });
        }
    });
});

/*
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});
*/

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/style.css', function (req, res) {
    res.sendFile(path.join(__dirname + '/style.css'));
});
app.get('/tables.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/tables.js'));
});
app.get('/tabulator.min.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/tabulator.min.js'));
});
app.get('/tabulator.min.css', function (req, res) {
    res.sendFile(path.join(__dirname + '/tabulator.min.css'));
});
app.listen(PORT);
console.log(`server running on port ${PORT}`)