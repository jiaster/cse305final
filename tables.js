

const url = window.location.origin;
var user = 0;
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
        addToCart(row.getData(), () => {
            updateCart();
        });
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
var orderstable = new Tabulator("#orders", {
    height: 200,
    layout: "fitColumns", //fit columns to width of table (optional)
    columns: [ //Define Table Columns
        { title: "Order ID", field: "OrderID", sorter: "number" },
        { title: "Date", field: "Date", sorter: "date" },
        { title: "Total", field: "Total", sorter: "number" },
        { title: "Status", field: "Status", sorter: "string" }
    ],
    rowClick: function (e, id, data, row) {
        console.log(id);
    },
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
    rowClick: function (e, id, data, row) {
        console.log(id);
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
    rowClick: function (e, id, data, row) {
        console.log(id);
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
    console.log(/^\+?(0|[1-9]\d*)$/.test($('#user').val()));
    if (/^\+?(0|[1-9]\d*)$/.test(user) == true) {//if integer
        user = $('#user').val();
        console.log(`user set to ${user}`);
        $('#userid').text(user);
        //changeUsers();//TODO
        updateCart();
        //calculate totals
        updateOrders();

        const getCustomerInfo = `${url}/customer/${user}`;
        fetch(getCustomerInfo)//get orders
            .then(data => { return data.json() })
            .then(res => {
                console.log(res);
                $(firstName).val(res["customerinfo"].FirstName);
                $(lastName).val(res["customerinfo"].LastName);
                $(email).val(res["customerinfo"].Email);
                $(phone).val(res["customerinfo"].Phone);
                addressestable.setData(res["addresses"]);
                paymentstable.setData(res["payments"]);
                //orders = res["orders"];
                //orderstable.setData(orders);
            })

        return false;
    } else {
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
        if (address.AddressName === $(`#addressSelect`).val()) {
            addressid = address.id;
        }
    });
    paymentstable.getData().forEach(payment => {
        if (payment.Name === $(`#paymentSelect`).val()) {
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
    //console.log(data);

    const addToCartURL = `${url}/order/${user}`;
    fetch(addToCartURL, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(data => { return data.json() })
        .then(res => {
            updateOrders();
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
});
//Change user info
$('#changeUserInfoButton').on('click', (event) => {
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    var data = {
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

        });
});
// register new user
$('#registerButton').on('click', (event) => {
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    var data = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone
    };

    const newCustomerURL = `${url}/customer`;
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
            $('#newid').text(res.newid)
        });
});

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