import Redis from '../utils/redisclient';

(async () => {
  try {
    await redis.set('test_key', 'Hello Redis!');
    const value = await redis.get('test_key');
    console.log('Value of test_key:', value);  // Should print: Hello Redis!
  } catch (err) {
    console.error('Redis test error:', err);
  } finally {
    redis.disconnect();
  }
})();
