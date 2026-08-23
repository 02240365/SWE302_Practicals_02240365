/**
 * Wraps the "send an email/notification" side effect behind a small
 * interface. In production this could call a real email API; in tests
 * it is trivially replaced with a fake that just records calls, with no
 * console output and no real network/API key involved.
 */
class NotificationService {
  sendOrderConfirmation(order) {
    // In this lab project we just log; a real implementation would call
    // an email/SMS provider using credentials from environment
    // configuration (never hardcoded in source).
    console.log(`Order confirmation sent to ${order.customerName} (order #${order.id}).`);
  }
}

module.exports = { NotificationService };
