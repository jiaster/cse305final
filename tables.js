const url = window.location.origin;
var user;
var cart;
var orders;
var total = 0;
var addressSelect = $(`#addressSelect`);

var itemstable = new Tabulator("#itemstable", {
    height: 200,
    layout: "fitColumns", //fit columns to width of table (optional)
    columns: [ //Define Table Columns
        { title: "Name", field: "Name", sorter: "string" },
        { title: "Brand", field: "Brand", sorter: "string", sortable: true },
        { title: "Category", field: "Category", sorter: "string" },
        { title: "Price", field: "Price", sorter: "number", sortable: true }

    ],
    rowClick: (e, row) => {
        //console.log(row.getData());
        if (user != undefined) {
            if (user != 'admin') {
                addToCart(row.getData(), () => {
                    updateCart();
                });
            } else {
                editItem(row.getData());
            }
        }
    },
});
var carttable = new Tabulator("#cart", {
    height: 200,
    layout: "fitColumns", //fit columns to width of table (optional)
    columns: [ //Define Table Columns
        { title: "Name", field: "Name", sorter: "string" },
        { title: "Unit Price", field: "Price", sorter: "number" },
        { title: "Quantity", field: "Quantity", sorter: "number" },
        { title: "Total", field: "Total", sorter: "number" }
    ],
    rowClick: function (e, row) {
        console.log(row);
        removeFromCart(row.getData(), () => {
            updateCart();
        });
    },
});
var cartmodal = new Tabulator("#cartmodal", {//cart in modal
    height: 200,
    layout: "fitColumns",
    columns: [
        { title: "Name", field: "Name", sorter: "string" },
        { title: "Unit Price", field: "Price", sorter: "number" },
        { title: "Quantity", field: "Quantity", sorter: "number" },
        { title: "Total", field: "Total", sorter: "number" }
    ]
});
var orderstable = new Tabulator("#orders", {
    height: 200,
    layout: "fitColumns", //fit columns to width of table (optional)
    columns: [ //Define Table Columns
        { title: "Order ID", field: "OrderID", sorter: "number" },
        { title: "Date", field: "Date", sorter: "date" },
        { title: "Total", field: "Total", sorter: "number" },
        { title: "Status", field: "Status", sorter: "string" }
    ],
    rowClick: function (e, row) {
        console.log(row);
        orderitemsmodal.clearData();
        $(`#ordersBox`).modal('toggle');
        //console.log(row.getData().OrderID);
        const orderItemsURL = `${url}/order/${row.getData().OrderID}`;
        console.log(orderItemsURL);
        fetch(orderItemsURL)
            .then(data => { return data.json() })
            .then(res => {
                console.log(res);
                //orderitemsmodal.setData(res.order);
                res.order.forEach(item => {
                    var getItemURL = `${url}/items/${item.Item}`;
                    fetch(getItemURL)//get orders
                        .then(data => { return data.json() })
                        .then(res => {
                            console.log(res);
                            res["cart"][0].Total = (res["cart"][0].Price) * (res["cart"][0].Quantity);
                            orderitemsmodal.addData(res["cart"][0]);
                        })
                });
            });
    },
});
var orderitemsmodal = new Tabulator("#orderItems", {
    height: 200,
    layout: "fitColumns", //fit columns to width of table (optional)
    columns: [ //Define Table Columns
        { title: "Name", field: "Name", sorter: "string" },
        { title: "Unit Price", field: "Price", sorter: "number" },
        { title: "Quantity", field: "Quantity", sorter: "number" },
        { title: "Total", field: "Total", sorter: "number" }
    ]
});

var addressestable = new Tabulator("#addresses", {
    height: 200,
    layout: "fitColumns", //fit columns to width of table (optional)
    columns: [ //Define Table Columns
        { title: "Name", field: "AddressName", sorter: "string" },
        { title: "Address Line", field: "AddressLine", sorter: "string" },
        { title: "Zip Code", field: "Zip", sorter: "number" },
        { title: "Country", field: "Country", sorter: "string" }
    ],
    rowClick: function (e, row) {
        console.log(row);
    },
});
var paymentstable = new Tabulator("#payments", {
    height: 200,
    layout: "fitColumns", //fit columns to width of table (optional)
    columns: [ //Define Table Columns
        { title: "Name", field: "Name", sorter: "string" },
        { title: "Type", field: "Type", sorter: "string" },
        { title: "Card", field: "Card", sorter: "string" },
        { title: "Card Expiry Date", field: "CardExpiry", sorter: "number" }
    ],
    rowClick: function (e, row) {
        console.log(row);
    },
});
function updateOrders() {
    const getOrderURL = `${url}/customer/orders/${user}`;
    fetch(getOrderURL)//get orders
        .then(data => { return data.json() })
        .then(res => {
            console.log(res);
            orders = res["orders"];
            orderstable.setData(orders);
        })
}

$('#changeUser').submit(() => {
    user = $('#user').val();
    if (user != 'admin') {//if integer
        user = $('#user').val();

        const getIDURL = `${url}/customer`;
        var data = {
            username: user
        };
        fetch(getIDURL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => { return data.json() })
            .then(res => {
                console.log(res);
                if ($.isEmptyObject(res)) {
                    $('#userid').text('USERNAME NOT FOUND');
                } else {
                    $('#userid').text(user);
                    user = res.id.CustomerID;
                    const getCustomerInfo = `${url}/customer/${user}`;
                    fetch(getCustomerInfo)//get orders
                        .then(data => { return data.json() })
                        .then(res => {
                            console.log(`user set to ${user}`);
                            updateCart();
                            updateOrders();
                            console.log(res);
                            $(`#username`).val(res["customerinfo"].Username);
                            $(`#firstName`).val(res["customerinfo"].FirstName);
                            $(`#lastName`).val(res["customerinfo"].LastName);
                            $(`#email`).val(res["customerinfo"].Email);
                            $(`#phone`).val(res["customerinfo"].Phone);
                            addressestable.setData(res["addresses"]);
                            paymentstable.setData(res["payments"]);
                            //orders = res["orders"];
                            //orderstable.setData(orders);
                        })
                }
            });



        return false;
    } else {
        console.log('logged in as employee')
        $('#userid').text(user);
        carttable.clearData();
        orderstable.clearData();
        addressestable.clearData();
        paymentstable.clearData();

        return false;
    }
});

function addToCart(item, callback) {
    //determine if item is already in cart
    var inCart = false;
    var quantity = 1;
    if (carttable.getData().legnth != 0) {
        carttable.getData().forEach(cartItem => {
            if (cartItem.Name === item.Name) {
                console.log('item in cart');
                inCart = true;
                quantity = (cartItem.Quantity) + 1;
            }
        });
    }
    var type;
    if (inCart === false) {
        type = 'add';
    } else {
        type = 'update';
    }
    const addToCartURL = `${url}/cart/${user}`;
    var data = {
        item: item.ItemID,
        type: type,
        quantity: quantity
    };
    //console.log(data);
    fetch(addToCartURL, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(data => { return data.json() })
        .then(res => {
            callback();
        });

};
// remove 1 item from cart
function removeFromCart(item, callback) {
    //determine if item should be removed for -1 quantity
    var newQuantity = 1;
    if (carttable.getData().legnth != 0) {
        carttable.getData().forEach(cartItem => {
            if (cartItem.Name === item.Name) {
                newQuantity = (cartItem.Quantity) - 1;
            }
        });
    }
    var type;
    if (newQuantity === 0) {
        type = 'DELETE';//delete
    } else {
        type = 'POST';//-1 quantity
    }
    const cartURL = `${url}/cart/${user}`;
    var data = {
        item: item.Item,
        quantity: newQuantity
    };
    console.log(data);
    fetch(cartURL, {
        method: type,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(data => { return data.json() })
        .then(res => {
            callback();
        });

};

function updateCartTotal() {
    var cart = carttable.getData();
    console.log(cart);
    if (cart === undefined || cart.length === 0) {
        total = 0;
    } else {
        cart.forEach(item => {
            total += item.Total;
        });
    }
    console.log(total);
    $('#cartTotal').text(total.toFixed(2));
};
//place order
$('#checkout').on('click', (event) => {
    var addressid;
    var paymentid;
    addressestable.getData().forEach(address => {
        if (address.AddressName === $(`#addressSelect`).val()) {//get address id
            addressid = address.id;
        }
    });
    paymentstable.getData().forEach(payment => {
        if (payment.Name === $(`#paymentSelect`).val()) {//get payment id
            paymentid = payment.PaymentID;
        }
    });
    var items = [];
    carttable.getData().forEach(item => {
        items.push(item);
    });
    var data = {
        total: $(`#checkoutTotal`).text(),
        payment: paymentid,
        address: addressid,
        items: items
    };

    const placeOrderURL = `${url}/order/${user}`;
    fetch(placeOrderURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(data => { return data.json() })
        .then(res => {
            updateOrders();//show new order
            //empty cart
            const deleteCart = `${url}/cart/${user}`;
            fetch(deleteCart, {
                method: 'DELETE'
            })
                .then(data => { return data.json() })
                .then(res => {
                    //refresh cart table
                    carttable.clearData();
                    $(`#cartTotal`).text('0.00');
                });

        });
});
// open checkout modal
$('#checkoutButton').on('click', (event) => {
    $(`#checkoutTotal`).text(total.toFixed(2));
    var addresses = addressestable.getData();
    for (var i = 0; i < addresses.length; i++) {
        var opt = document.createElement('option');
        opt.value = addresses[i].AddressName;
        opt.innerHTML = addresses[i].AddressName;
        $(`#addressSelect`).append(opt);
    }
    var payments = paymentstable.getData();
    for (var i = 0; i < payments.length; i++) {
        var opt = document.createElement('option');
        opt.value = payments[i].Name;
        opt.innerHTML = payments[i].Name;
        $(`#paymentSelect`).append(opt);
    }
    cartmodal.setData(carttable.getData());
});
//Change user info
$('#editUserButton').on('click', (event) => {
    var userName = $('#username').val();
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    var data = {
        username: userName,
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone
    };

    const updateCustomerURL = `${url}/customer/${user}`;
    fetch(updateCustomerURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(data => { return data.json() })
        .then(res => {
            $('#userid').text(userName);
        });
});
// register new user
$('#registerUserButton').on('click', (event) => {
    var username = $('#newUsername').val();
    var firstName = $('#newFirstName').val();
    var lastName = $('#newLastName').val();
    var email = $('#newEmail').val();
    var phone = $('#newPhone').val();
    var data = {
        username: username,
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone
    };
    console.log(data);
    const newCustomerURL = `${url}/newcustomer`;
    fetch(newCustomerURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(data => { return data.json() })
        .then(res => {
            console.log(res);
            $('#userid').text(username);
            user=res.newid;
            $(`#username`).val(username);
            $(`#firstName`).val(firstName);
            $(`#lastName`).val(lastName);
            $(`#email`).val(email);
            $(`#phone`).val(phone);
        });
});
//add new address
$('#newAddress').on('click', (event) => {
    var id = user;
    var addressName = $('#addressName').val();
    var addressLine = $('#addressLine').val();
    var zipcode = $('#zipcode').val();
    var country = $('#country').val();
    var data = {
        id: id,
        AddressName: addressName,
        AddressLine: addressLine,
        Zip: zipcode,
        Country: country
    };

    const newAddressURL = `${url}/customer/${user}/address`;
    fetch(newAddressURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(data => { return data.json() })
        .then(res => {
            addressestable.addData(data);
        });
});
//add new payment
$('#newpayment').on('click', (event) => {
    var id = user;
    var name = $('#paymentname').val();
    var type = $('#paymenttype').val();
    var card = $('#paymentcard').val();
    var cardexpiry = $('#paymentcardexpiredate').val();
    var data = {
        id: id,
        Name: name,
        Type: type,
        Card: card,
        CardExpiry: cardexpiry
    };

    const newPaymentURL = `${url}/customer/${user}/payment`;
    fetch(newPaymentURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(data => { return data.json() })
        .then(res => {
            paymentstable.addData(data);
        });
});
function editItem(item) {
    console.log(item);
    $(`#editItemBox`).modal('toggle');
    $('#itemID').val(item.ItemID);
    $('#itemName').val(item.Name);
    $('#itemBrand').val(item.Brand);
    $('#itemCategory').val(item.Category);
    $('#itemPrice').val(item.Price);
    $('#itemQuantity').val(item.Quantity);
}
//edit item modal submit
$('#editItem').on('click', (event) => {
    var id = $(`#itemID`).val();
    var itemName = $('#itemName').val();
    var brand = $('#itemBrand').val();
    var category = $('#itemCategory').val();
    var price = $('#itemPrice').val();
    var quantity = $('#itemQuantity').val();
    var data = {
        itemID: id,
        name: itemName,
        brand: brand,
        category: category,
        price: price,
        quantity: quantity
    };

    const ediItemURL = `${url}/items/${id}`;
    fetch(ediItemURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(data => { return data.json() })
        .then(res => {
            updateItems();
            //$(`#editItemBox`).modal('toggle');
        });
});
//update items table
function updateItems() {
    const itemURL = `${url}/items`;
    var items;
    fetch(itemURL)
        .then(data => { return data.json() })
        .then(res => {
            items = res["items"];
            itemstable.setData(items);
            //console.log(items);
        });
};
updateItems();
//update cart contents
function updateCart() {
    const cartURL = `${url}/cart/${user}`;
    //console.log(cartURL);
    fetch(cartURL)//get cart
        .then(data => { return data.json() })
        .then(res => {
            var count = 0;
            cart = res["cart"];
            if (cart === undefined || cart.length === 0) {
                carttable.clearData();
                updateCartTotal();
            } else {
                cart.forEach((item) => {
                    const itemURL = `${url}/items/${item.Item}`;
                    fetch(itemURL)
                        .then(data => { return data.json() })
                        .then(res => {
                            console.log(res);
                            item.Price = res["cart"][0].Price;
                            item.Name = res["cart"][0].Name;
                            item.Total = item.Quantity * res["cart"][0].Price;
                            carttable.setData(cart);
                            total = 0;
                            updateCartTotal();
                        });
                });
            }
        })
};