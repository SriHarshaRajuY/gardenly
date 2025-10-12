// Import required modules
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// =======================
// MongoDB Connection
// =======================
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gardenly', {
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout for server selection
    bufferCommands: false // Disable command buffering
})
.then(() => {
    console.log('Successfully connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit if connection fails
});

// =======================
// Schemas
// =======================

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }, // Admin, Seller, Buyer, Expert, etc.
    expertise: { type: String, default: 'General' }, // Default for experts
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true }
});

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, default: 'General' },
    image: { type: String },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantity: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    sold_at: { type: Date } // Optional date for last sold
});

// Ticket Schema
const ticketSchema = new mongoose.Schema({
    requester: { type: String, required: true },
    subject: { type: String, required: true },
    type: { type: String, required: true }, // Issue type: General, Technical, Billing
    description: { type: String, required: true },
    status: { type: String, default: 'Open' },
    expert_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attachment: { type: String },
    resolution: { type: String },
    created_at: { type: Date, default: Date.now },
    resolved_at: { type: Date } // Resolution timestamp
});

// Order Schema
const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
        category: { type: String }
    }],
    total: { type: Number, required: true },
    customer_name: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    order_id: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now }
});

// Cart Schema
const cartSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
        category: { type: String }
    }],
    updated_at: { type: Date, default: Date.now }
});

// =======================
// Models
// =======================
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Ticket = mongoose.model('Ticket', ticketSchema);
const Order = mongoose.model('Order', orderSchema);
const Cart = mongoose.model('Cart', cartSchema);

// =======================
// Default Data
// =======================

const defaultUsers = [
    { username: 'admin', password: 'admin123', role: 'Admin', expertise: null, email: 'admin@example.com', mobile: '1234567890' },
    { username: 'seller1', password: 'seller123', role: 'Seller', expertise: null, email: 'seller1@example.com', mobile: '2345678901' },
    { username: 'buyer1', password: 'buyer123', role: 'Buyer', expertise: null, email: 'buyer1@example.com', mobile: '3456789012' },
    { username: 'admin2', password: 'admin456', role: 'Admin', expertise: null, email: 'admin2@example.com', mobile: '4567890123' },
    { username: 'seller2', password: 'seller789', role: 'Seller', expertise: null, email: 'seller2@example.com', mobile: '5678901234' },
    { username: 'seller3', password: 'seller101', role: 'Seller', expertise: null, email: 'seller3@example.com', mobile: '6789012345' },
    { username: 'buyer2', password: 'buyer456', role: 'Buyer', expertise: null, email: 'buyer2@example.com', mobile: '7890123456' },
    { username: 'buyer3', password: 'buyer789', role: 'Buyer', expertise: null, email: 'buyer3@example.com', mobile: '8901234567' },
    { username: 'delivery1', password: 'delivery123', role: 'Delivery Manager', expertise: null, email: 'delivery1@example.com', mobile: '9012345678' },
    { username: 'expert1', password: 'expert123', role: 'Expert', expertise: 'General', email: 'expert1@example.com', mobile: '0123456789' },
    { username: 'expert2', password: 'expert456', role: 'Expert', expertise: 'Technical', email: 'expert2@example.com', mobile: '1234509876' },
    { username: 'expert3', password: 'expert789', role: 'Expert', expertise: 'Billing', email: 'expert3@example.com', mobile: '2345098761' }
];

const defaultProducts = [
    { 
        name: 'Peace Lily, Spathiphyllum - Plant', 
        description: 'The Peace Lily, scientifically known as Spathiphyllum, is a stunning houseplant celebrated for its elegant white blooms and lush green foliage.', 
        price: 165.00, 
        category: 'Plants', 
        image: './public/images/plantspics/p1.png', 
        quantity: 20, 
        sold: 5
    },
    { 
        name: 'Parijat Tree, Parijatak, Night Flowering Jasmine - Plant', 
        description: 'The Parijat tree is known for its nocturnal blooms and sweet aroma, symbolizing love and devotion.', 
        price: 259.00, 
        category: 'Plants', 
        image: './public/images/plantspics/p2.png', 
        quantity: 15, 
        sold: 3
    },
    { 
        name: 'Raat Ki Rani, Raat Rani, Night Blooming Jasmine - Plant', 
        description: 'Raat Ki Rani is a fragrant shrub that blooms after dusk, filling the air with a sweet fragrance.', 
        price: 499.00, 
        category: 'Plants', 
        image: './public/images/plantspics/p3.png', 
        quantity: 10, 
        sold: 2
    }
];

// =======================
// Initialize Database
// =======================
async function initializeDatabase() {
    try {
        console.log('Starting database initialization...');

        // Wait for MongoDB connection
        await mongoose.connection.asPromise();
        console.log('MongoDB connection established');

        // Clear existing collections
        console.log('Clearing collections...');
        await User.deleteMany({});
        await Product.deleteMany({});
        await Ticket.deleteMany({});
        await Order.deleteMany({});
        await Cart.deleteMany({});
        console.log('Collections cleared');

        // Insert default users
        console.log('Inserting default users...');
        const users = await User.insertMany(defaultUsers);
        console.log('Default users inserted:', users.length);

        // Link seller_id for default products
        const seller = users.find(u => u.username === 'seller1');
        if (!seller) throw new Error('Default seller not found');

        const updatedProducts = defaultProducts.map(product => ({
            ...product,
            seller_id: seller._id,
            sold_at: product.sold > 0 ? new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) : null
        }));

        // Insert default products
        console.log('Inserting default products...');
        const products = await Product.insertMany(updatedProducts);
        console.log('Default products inserted:', products.length);

        console.log('Database initialization completed successfully');
        return true;
    } catch (error) {
        console.error('Error initializing database:', error.message);
        throw error;
    }
}

// =======================
// Exports
// =======================
module.exports = {
    User,
    Product,
    Ticket,
    Order,
    Cart,
    initializeDatabase
};
