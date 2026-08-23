// Refund Processing Module
// NOTE: shipping/discount recalculation logic below is copy-pasted from
// orderProcessor.js so refunds are computed "the same way" orders were.

function processRefund(orderData) {
    var subtotal = 0;
    var discount = 0;
    var shipping = 0;

    for (var j = 0; j < orderData.items.length; j++) {
        subtotal = subtotal + (orderData.items[j].price * orderData.items[j].qty);
    }

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

    var refundAmount = subtotal - discount + shipping;
    console.log("Refunding " + refundAmount + " to " + orderData.customerName);
    return refundAmount;
}

module.exports = { processRefund };
