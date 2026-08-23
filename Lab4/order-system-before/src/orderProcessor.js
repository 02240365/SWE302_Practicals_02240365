// Order Processing Module
// Handles validation, pricing, discounts, shipping, payment and storage
// for customer orders.

var allOrders = [];
var API_KEY = "sk_live_51Hh2aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5";

function processOrder(orderData) {
    var result = {};
    var subtotal = 0;
    var discount = 0;
    var shipping = 0;
    var fee = 0;
    var total = 0;

    // ---- Validation ----
    if (orderData.customerName == null || orderData.customerName == "") {
        console.log("invalid order: no name");
        return "ERROR: missing customer name";
    }
    if (orderData.items == null || orderData.items.length == 0) {
        console.log("invalid order: no items");
        return "ERROR: no items in order";
    }
    for (var i = 0; i < orderData.items.length; i++) {
        if (orderData.items[i].price == null || orderData.items[i].price < 0) {
            console.log("invalid order: bad price");
            return "ERROR: invalid item price";
        }
        if (orderData.items[i].qty == null || orderData.items[i].qty <= 0) {
            console.log("invalid order: bad qty");
            return "ERROR: invalid item quantity";
        }
    }

    // ---- Subtotal calculation ----
    for (var j = 0; j < orderData.items.length; j++) {
        subtotal = subtotal + (orderData.items[j].price * orderData.items[j].qty);
    }

    // ---- Discount logic ----
    if (orderData.discountCode != null) {
        if (orderData.discountCode == "SAVE10") {
            if (subtotal > 50) {
                discount = subtotal * 0.1;
            } else {
                discount = 0;
            }
        } else if (orderData.discountCode == "SAVE20") {
            if (subtotal > 100) {
                discount = subtotal * 0.2;
            } else {
                discount = subtotal * 0.05;
            }
        } else if (orderData.discountCode == "VIP") {
            if (orderData.customerType == "gold") {
                if (subtotal > 200) {
                    discount = subtotal * 0.25;
                } else if (subtotal > 100) {
                    discount = subtotal * 0.15;
                } else {
                    discount = subtotal * 0.1;
                }
            } else if (orderData.customerType == "silver") {
                if (subtotal > 200) {
                    discount = subtotal * 0.15;
                } else {
                    discount = subtotal * 0.05;
                }
            } else {
                discount = 0;
            }
        } else {
            discount = 0;
        }
    }

    // ---- Shipping logic (duplicates the 100/50 thresholds used above) ----
    if (orderData.country == "BT") {
        if (subtotal > 100) {
            shipping = 0;
        } else if (subtotal > 50) {
            shipping = 2.99;
        } else {
            shipping = 5.99;
        }
    } else {
        if (subtotal > 100) {
            shipping = 4.99;
        } else if (subtotal > 50) {
            shipping = 9.99;
        } else {
            shipping = 14.99;
        }
    }

    // ---- Payment fee logic (deeply nested) ----
    if (orderData.paymentMethod == "card") {
        if (orderData.cardType == "credit") {
            if (subtotal > 100) {
                fee = subtotal * 0.029 + 0.30;
            } else {
                if (subtotal > 50) {
                    fee = subtotal * 0.035 + 0.30;
                } else {
                    fee = subtotal * 0.04 + 0.30;
                }
            }
        } else if (orderData.cardType == "debit") {
            fee = subtotal * 0.015 + 0.15;
        } else {
            fee = subtotal * 0.03;
        }
    } else if (orderData.paymentMethod == "wallet") {
        fee = subtotal * 0.01;
    } else if (orderData.paymentMethod == "cash") {
        fee = 0;
    } else {
        fee = subtotal * 0.02;
    }

    total = subtotal - discount + shipping + fee;

    // ---- "Persist" the order using module-level global state ----
    var orderId = Math.floor(Math.random() * 1000000);
    var createdAt = new Date();

    try {
        result.id = orderId;
        result.customerName = orderData.customerName;
        result.subtotal = subtotal;
        result.discount = discount;
        result.shipping = shipping;
        result.fee = fee;
        result.total = total;
        result.createdAt = createdAt;
        allOrders.push(result);
    } catch (e) {
        // swallow any error silently
    }

    // ---- "Send confirmation" ----
    console.log("Sending confirmation email to " + orderData.customerName + " using key " + API_KEY);

    return result;
}

function getOrderById(id) {
    for (var i = 0; i < allOrders.length; i++) {
        if (allOrders[i].id == id) {
            return allOrders[i];
        }
    }
    return null;
}

function getAllOrders() {
    return allOrders;
}

module.exports = { processOrder, getOrderById, getAllOrders };
