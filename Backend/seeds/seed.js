require('dotenv').config();
const db = require('../models');

async function seed() {
  try {
    await db.sequelize.sync({ alter: true });
    console.log('Database synchronized');

    // Create users (idempotent - safe to re-run)
    const [admin, adminCreated] = await db.User.findOrCreate({
      where: { email: 'admin@store.com' },
      defaults: {
        birthDate: '1990-01-15',
        password: 'admin123',
        role: 'admin'
      }
    });
    console.log(adminCreated ? 'Admin user created:' : 'Admin user already exists:', admin.email);

    const [user, userCreated] = await db.User.findOrCreate({
      where: { email: 'user@store.com' },
      defaults: {
        birthDate: '1995-06-20',
        password: 'user123',
        role: 'user'
      }
    });
    console.log(userCreated ? 'Regular user created:' : 'Regular user already exists:', user.email);

    // Create products (idempotent - skip if already seeded)
    const existingProductCount = await db.Product.count();
    if (existingProductCount === 0) {
      const products = await db.Product.bulkCreate([
        { name: 'Wireless Bluetooth Headphones', description: 'High-quality over-ear headphones with noise cancellation and 30h battery life.', price: 299.99, stock: 50 },
        { name: 'Mechanical Keyboard RGB', description: 'Compact 75% mechanical keyboard with hot-swappable switches and per-key RGB.', price: 449.90, stock: 30 },
        { name: 'Ergonomic Mouse', description: 'Vertical ergonomic mouse with adjustable DPI and silent clicks.', price: 189.90, stock: 45 },
        { name: 'USB-C Hub 7-in-1', description: 'Multiport adapter with HDMI 4K, USB 3.0, SD card reader, and PD charging.', price: 159.90, stock: 60 },
        { name: '27" 4K Monitor', description: 'IPS panel, 60Hz, 99% sRGB, USB-C with 65W power delivery.', price: 2499.00, stock: 15 },
        { name: 'Webcam Full HD 1080p', description: 'Autofocus webcam with built-in microphone and privacy shutter.', price: 249.90, stock: 40 },
        { name: 'Standing Desk Mat', description: 'Anti-fatigue mat for standing desks, ergonomic cushioned surface.', price: 129.90, stock: 35 },
        { name: 'Laptop Stand Aluminum', description: 'Adjustable aluminum laptop stand with ventilation and cable management.', price: 199.90, stock: 25 },
        { name: 'Noise Cancelling Earbuds', description: 'True wireless earbuds with ANC, transparency mode, and 8h battery.', price: 599.90, stock: 20 },
        { name: 'Desk Organizer Wood', description: 'Handcrafted wooden desk organizer with phone stand and pen holder.', price: 89.90, stock: 55 },
        { name: 'USB Desk Lamp', description: 'LED desk lamp with adjustable brightness, color temperature, and USB charging port.', price: 149.90, stock: 30 },
        { name: 'Cable Management Kit', description: 'Complete cable management solution with clips, sleeves, and velcro ties.', price: 59.90, stock: 100 },
      ]);
      console.log(`${products.length} products created`);
    } else {
      console.log(`Products already seeded (${existingProductCount} found), skipping`);
    }

    console.log('\nSeed completed successfully!');
    console.log('Admin login: admin@store.com / admin123');
    console.log('User login:  user@store.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
