/**
 * Wraps Math.random() so OrderService never calls it directly.
 * Tests inject a fake with a fixed nextId() instead.
 */
class RandomIdGenerator {
  nextId() {
    return Math.floor(Math.random() * 1000000);
  }
}

/**
 * Wraps `new Date()` so OrderService never calls it directly.
 * Tests inject a fake clock that returns a fixed timestamp.
 */
class SystemClock {
  now() {
    return new Date();
  }
}

module.exports = { RandomIdGenerator, SystemClock };
