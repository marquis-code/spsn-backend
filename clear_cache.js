const { createClient } = require('redis');

const client = createClient({
  url: 'redis://default:1fxx9kAvbzQTgZvoe0UXlP82v7tpqy1B@redis-13040.crce219.us-east-1-4.ec2.cloud.redislabs.com:13040'
});

client.on('error', err => console.log('Redis Client Error', err));

async function run() {
  await client.connect();
  await client.del('all_conferences');
  console.log('Cache cleared');
  await client.quit();
}

run();
