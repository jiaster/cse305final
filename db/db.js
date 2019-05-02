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
        const getIdQuery = 'SELECT * FROM Cart WHERE customer=?';
        db.all(getIdQuery, [id], (err, rows) => {
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
    }

    
};