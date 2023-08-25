


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const router = express.Router();

const PORT = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const JWT_SECRET_KEY = '1d77f6048da93d6958749c64db98d822e412dcdcd72b311b21b2e0c05120b3d47667e9c672d5b8161a0043e217b1444465c7d79c4d148058a03755e2889e5a01';

app.use(cors());
app.use(express.json());

// Set up MongoDB connection
mongoose.connect('mongodb://0.0.0.0:27017/mern_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User = mongoose.model('User', { email: String, name: String });

// Add routes here (see below)

app.listen(PORT, () => {
  console.log("run code")
  console.log(`Server is running on port ${PORT}`);
});


app.post('/login', async (req, res) => {
  const { email, name } = req.body;
  try {
    const user = await User.create({ email, name });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Perform login validation and return token
  const token = generateToken(); // Replace with your token generation logic
  res.json({ token });
});

app.post('/api/record/upload', (req, res) => {
  // Handle the uploaded video file here
  res.status(200).send('Video uploaded successfully');
});



// app.post('/login', async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (user) {
//       // Generate and send JWT token
//       // ... (implement JWT token generation and sending)
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     res.status(400).json({ error: 'Login failed' });
//   }
// });
app.post('/login', async (req, res) => {
  console.log("Run code")
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '1h' });
  
        res.status(200).json({ token });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Login failed' });
    }
  });

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findByIdAndDelete(userId);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});


router.post('/upload', async (req, res) => {
  try {
    // Assuming you're using multer for handling file uploads
    const multer = require('multer');
    const storage = multer.memoryStorage();
    const upload = multer({ storage }).single('video');

    upload(req, res, async (err) => {
      if (err) {
        console.error('Error uploading video:', err);
        return res.status(500).json({ error: 'Video upload failed' });
      }

      // Access the uploaded video data
      const videoFile = req.file;
      if (!videoFile) {
        return res.status(400).json({ error: 'No video file provided' });
      }

      // Process and store the videoFile as needed
      // ...

      // Respond with a success message
      return res.status(200).json({ message: 'Video uploaded successfully' });
    });
  } catch (error) {
    console.error('Error handling video upload:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// ... (other routes)
