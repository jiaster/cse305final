const sqlite3 = require('sqlite3');
const path = require('path')
const dbPath = path.resolve(__dirname, 'CSE305.db')

// Open database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    else { console.log('Connected to database.'); }
});

module.exports = {
    // Get all menu sections
    getItems: function (callback) {
        const getAllQuery = 'SELECT * FROM Item';
        db.all(getAllQuery, [], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                let items = [];

                rows.forEach((row) => {
                    items.push(row);
                    //console.log(row);
                });
                callback(null, items);
                //console.log(items);
            }
        });
    },
    //Get item by id
    getItem: function (id, callback) {
        const getItemQuery = 'SELECT * FROM Item WHERE ItemID=?';
        db.all(getItemQuery, [id], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                let items = [];

                rows.forEach((row) => {
                    items.push(row);
                    //console.log(row);
                });
                callback(null, items);
                //console.log(items);
            }
        });
    },
    //update item given ID
    updateItem: function (item, callback) {
        const updateItemQuery = 'UPDATE item SET category = ?, price = ?, quantity = ?, brand = ?, name = ? WHERE itemID = ?';
        db.all(updateItemQuery, [item.category, item.price, item.quantity, item.brand, item.name, item.itemID], (err, rows) => {
            if (err) {
                //console.log(err);
                //throw err;//CATCH
                callback(err);
            }
            else {
                callback(null, null);
            }
        });
    },
    // Delete item given id
    deleteItem: function (id, callback) {
        const deleteItemQuery = 'DELETE FROM item WHERE itemid = ?';
        db.all(deleteItemQuery, [id], (err, rows) => {
            if (err) {
                callback(err);
            } else {
                callback(null, null);
            }

        });
    },
    // Get Cart by ID
    getCartByID: function (id, callback) {
        const getCartQuery = 'SELECT * FROM Cart WHERE customer=?';
        db.all(getCartQuery, [id], (err, rows) => {
            if (err) {
                //console.log(err);
                //throw err;//CATCH
                callback(err);
            }
            else {
                let cart = [];

                rows.forEach((row) => {
                    cart.push(row);
                    console.log(row);
                });
                console.log(cart);
                callback(null, cart);
            }
        });
    },

    // Add an item to cart
    addToCart: function (id, item, quantity, callback) {
        const addToCartQuery = 'INSERT INTO cart (item,quantity,customer) VALUES (?,?,?)';
        db.all(addToCartQuery, [item, quantity, id], (err, rows) => {
            if (err) {
                //console.log(err);
                callback(err);
            }
            else {
                callback(null, null);
            }
        });
    },

    //update quantity of an item in cart
    updateCart: function (id, item, quantity, callback) {
        const query = 'UPDATE cart SET quantity = ? WHERE item = ? AND customer = ?';
        db.all(query, [quantity, item, id], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, null);
            }
        });
    },

    // detlet item from cart
    deleteFromCart: function (id, item, callback) {
        const query = 'DELETE FROM cart WHERE customer = ? AND item = ?';
        db.all(query, [id, item], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, null);
            }
        });
    },
    //create new order and resturns that new order's id
    createNewOrder: function (customer, total, payment, address, callback) {
        const query = 'INSERT INTO orders (customer,total,payment,address) VALUES (?,?,?,?)';
        const query2 = 'SELECT last_insert_rowid()';
        db.all(query, [customer, total, payment, address], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                db.get(query2, [], (err, row) => {
                    if (err) {
                        callback(err);
                    }
                    else {
                        //console.log(row);
                        //console.log(row['last_insert_rowid()']);
                        callback(null, row['last_insert_rowid()']);
                    }
                });
            }
        });
    },
    //add item to an order
    addItemToOrder: function (items, callback) {
        const query = 'INSERT INTO ordercontains (orderid, item, quantity) VALUES (?,?,?)';
        items.forEach(item => {
            console.log(item[1]);
            db.all(query, [item[0], item[1], item[2]], (err, rows) => {
                if (err) {
                    callback(err);
                }
            });
            callback(null, null);
        });
    },
    // get items in orderid
    getItemsInOrder: function (orderid, callback) {
        const query = 'SELECT item,quantity FROM ordercontains WHERE orderid = ?';
        db.all(query, [orderid], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                let order = [];
                console.log(rows);
                rows.forEach((row) => {
                    order.push(row);
                    console.log(row);
                });
                console.log(order);
                callback(null, order);
            }
        });
    },
    //get orders for customer
    getOrders: function (customerid, callback) {
        const query = 'SELECT orderid,total,status,date FROM orders WHERE customer = ?';
        db.all(query, [customerid], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                let orders = [];
                console.log(rows);
                rows.forEach((row) => {
                    orders.push(row);
                    console.log(row);
                });
                console.log(orders);
                callback(null, orders);
            }
        });
    },

    getCustomer: function (customerid, callback) {
        const query = 'SELECT * FROM customer WHERE customerid = ?';
        db.get(query, [customerid], (err, row) => {
            if (err) {
                callback(err);
            }
            else {
                console.log(row);
                callback(null, row);
            }
        });
    },

    editCustomer: function (customerid, firstName, lastName, email, phone, callback) {
        const query = 'UPDATE customer SET firstname = ?, lastname = ?, email = ?, phone = ? WHERE customerid = ?';
        db.run(query, [firstName, lastName, email, phone, customerid], (err, row) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, null);
            }
        });
    },

    addCustomer: function (firstName, lastName, email, phone, callback) {
        const query = 'INSERT INTO customer (firstName,lastName,email,phone) VALUES (?,?,?,?)';
        const query2 = 'SELECT last_insert_rowid()';
        db.run(query, [firstName, lastName, email, phone], (err, row) => {
            if (err) {
                callback(err);
            }
            else {
                db.get(query2, [], (err, row) => {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, row['last_insert_rowid()']);
                    }
                });
            }
        });
    },

    getAddresses: function (customerid, callback) {
        const query = 'SELECT * FROM address WHERE customer = ?';
        db.all(query, [customerid], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                let addresses = [];
                console.log(rows);
                rows.forEach((row) => {
                    addresses.push(row);
                });
                callback(null, addresses);
            }
        });
    },

    getPayments: function (customerid, callback) {
        const query = 'SELECT * FROM payment WHERE customer = ?';
        db.all(query, [customerid], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                let payments = [];
                console.log(rows);
                rows.forEach((row) => {
                    payments.push(row);
                });
                callback(null, payments);
            }
        });
    },

    // Add address ti customrer
    addAddress: function (customer, addressline, addressname, zipcode, country, callback) {
        const query = 'INSERT INTO address (customer, addressline, addressname,zip, country) VALUES (?,?,?,?,?)';
        db.run(query, [customer, addressline, addressname, zipcode, country], (err) => {
            if (err) {
                callback(err);
            }
        });
        callback(null, null);
    }


};