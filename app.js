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
        else {
            res.status(200).send({
                cart: result
            });
        }
    });
});

// add an item or update quantity or delete an item to/from cart
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
    } else { //update quantity of item
        console.log("update to cart recieved");
        console.log(req.body);
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
    console.log(req.body);
    if (item === undefined) {//empty cart
        console.log('delete cart of ' + id);
        db.deleteCart(id, (err, result) => {
            if (err) {
                console.log("err");
                console.log(err);
                res.status(400).send({
                    success: false
                });
            }
            else {
                res.status(200).send({
                    sucess: true
                });
            }
        });
    } else {
        db.deleteFromCart(id, item, (err, result) => {
            if (err) {
                console.log("err");
                console.log(err);
                res.status(400).send({
                    success: false
                });
            }
            else {
                res.status(200).send({
                    sucess: true
                });
            }
        });
    }
});

// create new order
app.post('/order/:id', (req, res) => {
    const customerid = parseInt(req.params.id);
    const total = req.body.total;
    const payment = req.body.payment;
    const items = req.body.items;
    const address = req.body.address;
    console.log(req.body)
    db.createNewOrder(customerid, total, payment, address, (err, orderid) => {
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
                itemsArr.push([orderid, item.Item, item.Quantity]);
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
//get id via username
app.post('/customer', (req, res) => {
    const username = req.body.username;
    db.getCustomerID(username, (err, id) => {
        if (err) {
            console.log("err");
            console.log(err);
            res.status(400).send({
                success: false
            });
        }
        else {
            res.status(200).send({
                id: id
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
//edit customer info
app.post('/customer/:id', (req, res) => {
    const customerid = parseInt(req.params.id);
    const username = req.body.username;
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;
    const phone = req.body.phone;
    console.log(req.body)
    db.editCustomer(customerid, username, firstName, lastName, email, phone, (err, result) => {
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
});
//add new customer
app.post('/newcustomer', (req, res) => {
    const username = req.body.username;
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;
    const phone = req.body.phone;
    console.log(req.body);
    db.addCustomer(username, firstName, lastName, email, phone, (err, result) => {
        if (err) {
            console.log("err");
            console.log(err);
            res.status(400).send({
                success: false
            });
        }
        else {
            console.log(result);
            res.status(200).send({
                success: true,
                newid: result
            });
        }
    });
});
// add address
app.post('/customer/:id/address', (req, res) => {
    const id = parseInt(req.params.id);
    const addressname = req.body.AddressName;
    const addressline = req.body.AddressLine;
    const zipcode = req.body.Zip;
    const country = req.body.Country;
    //console.log(req.body);
    db.addAddress(id, addressname, addressline, zipcode, country, (err, result) => {
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
});
// add payment
app.post('/customer/:id/payment', (req, res) => {
    const id = parseInt(req.params.id);
    const name = req.body.Name;
    const type = req.body.Type;
    const card = req.body.Card;
    const cardexpiry = req.body.CardExpiry;
    //console.log(req.body);
    db.addPayment(id, name, type, card, cardexpiry, (err, result) => {
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