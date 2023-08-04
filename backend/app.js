const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/FosDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Continue with your application logic
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  
  
  
  

  
  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['seller', 'customer'], required: true },
  });
  
  const User = mongoose.model('User', userSchema);
  module.exports = User;


// restaurant.model.js
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},

  
});

 const Restaurant = mongoose.model('Restaurant', restaurantSchema);
 module.exports = Restaurant;
 
 app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({
    username,
    password: hashedPassword,
    role
  });

  try {
    // Save the user to the database
    await newUser.save();

    // Return a success message
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    // Handle any errors that occur during registration
    res.status(500).json({ message: 'Registration failed', error });
  }
});


// menuitem.model.js


const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
  restaurantname: { type: String, required: true }, // Update the type to String

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

});

 const MenuItem= mongoose.model('MenuItem', menuItemSchema);

// menuitemRoutes.js


module.exports= MenuItem;

 // Get user details
app.get('/users/:id', (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving user details', error });
    });
});
 
 app.post('/login', async(req, res) => {
  const { username, password, role } = req.body;
  const user = await User.findOne({ username, role });

  if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials password' });
  }

  const token = jwt.sign({ userId: user._id }, 'secret_key');
  res.cookie('token', token, { httpOnly: true });
  res.json({ user });
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});


// Add a new restaurant
app.post('/restaurants', (req, res) => {
  const { name, owner ,user} = req.body;

  const restaurant = new Restaurant({ name, owner ,user});

  restaurant.save()
    .then((newRestaurant) => {
      res.status(201).json(newRestaurant);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error creating restaurant', error });
    });
});

// Update a restaurant
app.put('/restaurants/:id', (req, res) => {
  const { id } = req.params;
  const { name, owner ,user} = req.body;

  Restaurant.findByIdAndUpdate(id, { name, owner ,user}, { new: true })
    .then((updatedRestaurant) => {
      if (!updatedRestaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      res.json(updatedRestaurant);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error updating restaurant', error });
    });
});

// Delete a restaurant
app.delete('/restaurants/:id', (req, res) => {
  const { id } = req.params;

  Restaurant.findByIdAndDelete(id)
    .then((deletedRestaurant) => {
      if (!deletedRestaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      res.json({ message: 'Restaurant deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error deleting restaurant', error });
    });
});

// Get all restaurants
app.get('/restaurants', (req, res) => {
  Restaurant.find()
    .then((restaurants) => {
      res.json(restaurants);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving restaurants', error });
    });
});


app.get('/users', (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving users', error });
    });
});




// Add a new menu item
app.post('/menuitems', (req, res) => {
  const { name, price, restaurantId} = req.body;

  const menuItem = new MenuItem({ name, price, restaurant: restaurantId});

  menuItem.save()
    .then((newMenuItem) => {
      res.status(201).json(newMenuItem);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error creating menu item', error });
    });
});
app.post('/menuitem', (req, res) => {
  const { name, price, restaurantName } = req.body; // Change `restaurantId` to `restaurantName`

  const menuItem = new MenuItem({ name, price, restaurantname: restaurantName }); // Pass the restaurantName instead of restaurantId

  menuItem.save()
    .then((newMenuItem) => {
      res.status(201).json(newMenuItem);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error creating menu item', error });
    });
});


// menuitemRoutes.js (continued)

// Update a menu item
app.put('/menuitems/:id', (req, res) => {
  const { id } = req.params;
  const { name, price ,user} = req.body;

  MenuItem.findByIdAndUpdate(id, { name, price ,user}, { new: true })
    .then((updatedMenuItem) => {
      if (!updatedMenuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      res.json(updatedMenuItem);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error updating menu item', error });
    });
});

// Delete a menu item
app.delete('/menuitems/:id', (req, res) => {
  const { id } = req.params;

  MenuItem.findByIdAndDelete(id)
    .then((deletedMenuItem) => {
      if (!deletedMenuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      res.json({ message: 'Menu item deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error deleting menu item', error });
    });
});


app.get('/restaurants/:restaurantName/:userId/menuitems', (req, res) => {
  const { restaurantName } = req.params;

  MenuItem.find({ restaurantname: restaurantName})
    .then((menuItems) => {
      res.json(menuItems);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving menu items', error });
    });
});

// Get all menus
app.get('/menus', (req, res) => {
  MenuItem.find()
    .then((menus) => {
      res.json(menus);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving menus', error });
    });
});



// cart.model.js


const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

const Cart= mongoose.model('Cart', cartSchema);

// cartRoutes.js


module.exports  = Cart;

app.get('/cart/:userId', (req, res) => {
  const userId = req.params.userId;

  Cart.findOne({ user: userId })
    .populate('items.menuItem')
    .exec()
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      res.json({ cart });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving cart', error });
    });
});



// Add an item to the cart
app.post('/cart', (req, res) => {
  const { user, menuItem, quantity } = req.body;

  Cart.findOne({ user })
    .then((cart) => {
      if (cart) {
        // Cart exists, add the item to the existing cart
        const existingItemIndex = cart.items.findIndex((item) => item.menuItem.toString() === menuItem);

        if (existingItemIndex !== -1) {
          // Item already exists in the cart, update the quantity
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          // Item doesn't exist in the cart, add it
          cart.items.push({ menuItem, quantity });
        }

        cart.save()
          .then(() => {
            res.json({ message: 'Item added to cart successfully' });
          })
          .catch((error) => {
            res.status(500).json({ message: 'Error adding item to cartttttt', error });
          });
      } else {
        // Cart doesn't exist, create a new cart
        const newCart = new Cart({ user, items: [{ menuItem, quantity }] });

        newCart.save()
          .then(() => {
            res.json({ message: 'Item added to cart successfully' });
          })
         
// cartRoutes.js (continued)

.catch((error) => {
  res.status(500).json({ message: 'Error adding item to cart', error });
});
}
})
.catch((error) => {
res.status(500).json({ message: 'Error finding cart', error });
});
});

// Update the quantity of an item in the cart
app.put('/cart/:cartId/item/:itemId', (req, res) => {
const { cartId, itemId } = req.params;
const { quantity } = req.body;

Cart.findOneAndUpdate(
{ _id: cartId, 'items._id': itemId },
{ $set: { 'items.$.quantity': quantity } },
{ new: true }
)
.then((updatedCart) => {
if (!updatedCart) {
return res.status(404).json({ message: 'Cart or item not found' });
}
res.json(updatedCart);
})
.catch((error) => {
res.status(500).json({ message: 'Error updating cart', error });
});
});

// cartRoutes.js (continued)

// Clear all items from the cart
app.delete('/cart/:cartId', (req, res) => {
  const { cartId } = req.params;

  Cart.findByIdAndUpdate(cartId, { items: [] }, { new: true })
    .then((updatedCart) => {
      if (!updatedCart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      res.json(updatedCart);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error clearing items from cart', error });
    });
});


// Delete an item from the cart
app.delete('/cart/:cartId/item/:itemId', (req, res) => {
const { cartId, itemId } = req.params;

Cart.findOneAndUpdate(
{ _id: cartId },
{ $pull: { items: { _id: itemId } } },
{ new: true }
)
.then((updatedCart) => {
if (!updatedCart) {
return res.status(404).json({ message: 'Cart or item not found' });
}
res.json(updatedCart);
})
.catch((error) => {
res.status(500).json({ message: 'Error deleting item from cart', error });
});
});

 
// order.model.js


const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart'},
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  paymentMethod: {
    type: String,
    enum: ['online', 'cash-on-delivery'],
    default: 'online',
  },
  address: { type: String, required: true },
  phone: { type: String, required: true },
    // Other fields of the order model
  items: [{
      quantity: { type: Number, required: true },
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      price:{type:Number, ref: 'MenuItem'},
      name:{type:String, ref: 'MenuItem'},
    }]
});

 const Order  = mongoose.model('Order', orderSchema);


// orderRoutes.js


module.exports = Order;


app.post('/orders', async (req, res) => {
  try {
    const { user, address, phone, items } = req.body;

    const newOrder = new Order({ user, address, phone, items });

    const createdOrder = await newOrder.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
});


// Update the status of an order
app.put('/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  Order.findByIdAndUpdate(id, { status }, { new: true })
    .then((updatedOrder) => {
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json(updatedOrder);
    })
    .catch((error) => {


res.status(500).json({ message: 'Error updating order', error });
});
});

// Get all items for an order
app.get('/orders/:orderId/items', (req, res) => {
  const { orderId } = req.params;

  Order.findById(orderId)
    .populate('items.menuItem')
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const items = order.items.map((item) => ({
        quantity: item.quantity,
        menuItem: {
          _id: item.menuItem._id,
          name: item.menuItem.name,
          price: item.menuItem.price,
          // Add any additional properties you want to include
        },
      }));

      res.json({ items });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving items for the order', error });
    });
});



// Get all orders placed by a user
app.get('/orders/user/:userId', (req, res) => {
  const { userId } = req.params;

  Order.find({ user: userId })
    .populate('user')
    .populate({
      path: 'cart',
      populate: {
        path: 'items.menuItem',
        model: 'MenuItem',
      },
    })
    .then((orders) => {
      res.json(orders);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving orders', error });
    });
});


// Get order details
app.get('/orders/:id', (req, res) => {
const { id } = req.params;

Order.findById(id)
.populate('user')
.populate({
  path: 'cart',
  populate: {
    path: 'items.menuItem',
    model: 'MenuItem',
  },
})
.then((order) => {
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
})
.catch((error) => {
  res.status(500).json({ message: 'Error retrieving order details', error });
});
});

 

// paymentRoutes.js


const stripe = require('stripe')('sk_test_51N6SwUSJOjQ7Q7Aq9jz7p0HID3x73FHTTRCZdDsXmX22QESpM5Edt33PzQNuY6kB5HgIZfudTiWmeSzp7oj3gtgi00OSsVD4Hm');

module.exports = stripe;


app.post('/payment', async (req, res) => {
  const { name, cardNumber, expirationMonth, expirationYear, cvc } = req.body;

  try {
    // Create a PaymentMethod with the Stripe API
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber,
        exp_month: expirationMonth,
        exp_year: expirationYear,
        cvc: cvc,
      },
      billing_details: {
        name: name,
      },
    });

    // Create a PaymentIntent using the PaymentMethod
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // The payment amount in cents (₹1.00)
      currency: 'INR',
      payment_method_types: ['card'],
      payment_method: paymentMethod.id,
    });

    // Return the client secret to the frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});