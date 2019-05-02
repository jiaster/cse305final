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
        db.all(updateItemQuery, [item.category,item.price,item.quantity,item.brand,item.name,item.itemID], (err, rows) => {
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
        db.all(addToCartQuery, [item,quantity,id], (err, rows) => {
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
        db.all(query, [quantity,item,id], (err, rows) => {
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
    createNewOrder: function (customer, total, payment, callback) {
        const query = 'INSERT INTO orders (customer,total,payment) VALUES (?,?,?)';
        const query2 = 'SELECT last_insert_rowid()';
        db.all(query, [customer, total, payment], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                db.get(query2, [],(err, row) => {
                    if (err) {
                        callback(err);
                    }
                    else {
                        //console.log(row);
                        //console.log(row['last_insert_rowid()']);
                        callback(null,row['last_insert_rowid()']);
                    }
                });
            }
        });
    },
    //add item to an order
    addItemToOrder: function (itemid, orderid, quantity, callback) {
        const query = 'INSERT INTO order (customer, total, payment) VALUES (?,?,?)'
        db.all(query, [id, total, payment], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, null);
            }
        });
    },

};