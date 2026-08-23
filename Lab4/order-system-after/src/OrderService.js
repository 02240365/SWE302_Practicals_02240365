const { validateOrder } = require("./OrderValidator");
const { calculateSubtotal } = require("./PricingCalculator");
const { calculateDiscount } = require("./DiscountCalculator");
const { calculateShipping } = require("./ShippingCalculator");
const { calculatePaymentFee } = require("./PaymentFeeCalculator");

/**
 * Coordinates validation, pricing and persistence for a single order.
 * Every collaborator (repository, notifier, id generator, clock) is
 * injected through the constructor instead of being reached for
 * globally. That means a test can swap in fakes/stubs for all of them
 * and assert on deterministic output — no real dates, no real random
 * IDs, no real console output, no shared module-level state.
 */
class OrderService {
  constructor(orderRepository, notificationService, idGenerator, clock) {
    this._orderRepository = orderRepository;
    this._notificationService = notificationService;
    this._idGenerator = idGenerator;
    this._clock = clock;
  }

  placeOrder(orderData) {
    validateOrder(orderData);

    const subtotal = calculateSubtotal(orderData.items);
    const discount = calculateDiscount(subtotal, orderData.discountCode, orderData.customerType);
    const shipping = calculateShipping(subtotal, orderData.country);
    const fee = calculatePaymentFee(subtotal, orderData.paymentMethod, orderData.cardType);
    const total = subtotal - discount + shipping + fee;

    const order = {
      id: this._idGenerator.nextId(),
      customerName: orderData.customerName,
      subtotal,
      discount,
      shipping,
      fee,
      total,
      createdAt: this._clock.now(),
    };

    this._orderRepository.save(order);
    this._notificationService.sendOrderConfirmation(order);

    return order;
  }

  getOrderById(id) {
    return this._orderRepository.findById(id);
  }

  getAllOrders() {
    return this._orderRepository.findAll();
  }
}

module.exports = { OrderService };
