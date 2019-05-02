const express = require('express');
const db = require('./db/db.js');
const bodyParser = require('body-parser');
const Promise = require('promise');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

// updates a cart with id with items

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});