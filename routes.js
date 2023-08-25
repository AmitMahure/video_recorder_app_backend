const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Import the User model

const User = require('./models/User'); // Create the User model



// User registration and login routes
// router.post('/register', async (req, res) => {
//   // Register new user logic
// });


router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        email,
        password: hashedPassword,
        name,
      });
  
      await newUser.save();
  
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });



// router.post('/login', async (req, res) => {
//   // Login user logic and issue JWT
// });



router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare provided password with hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
  
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error logging in:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });



// // Recording routes
// router.post('/record/start', (req, res) => {
//   // Start recording logic
// });

router.post('/record/start', (req, res) => {
    const userId = req.user; // Assuming you've implemented user authentication middleware
    // You should also have access to the "mediaRecorder" instance here
  
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Implement logic to start recording using the "mediaRecorder" instance
    // For example, you might start recording the user's webcam and audio
  
    // Return success response
    return res.status(200).json({ message: 'Recording started' });
  });
  



// router.post('/record/stop', (req, res) => {
//   // Stop recording logic
// });

router.post('/record/stop', (req, res) => {
    const userId = req.user; // Assuming you've implemented user authentication middleware
    // You should also have access to the "mediaRecorder" instance here
  
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Implement logic to stop recording using the "mediaRecorder" instance
    // For example, you might stop the webcam and audio recording, save the recorded data, etc.
  
    // Return success response
    return res.status(200).json({ message: 'Recording stopped' });
  });
ṣ    

module.exports = router;
