const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize environment variables
dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB URI
const uri = process.env.MONGO_URI;
const dbName = 'VitalPoint';
const userCollection = 'user'; 
const appointmentsCollection = 'userDetails'; 
const doctorCollection = 'doctorList';

let db;

// Connect to MongoDB for appointments and user login (MongoClient)
MongoClient.connect(uri)
  .then(client => {
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit if connection fails
  });

// Middleware to check if database is connected
app.use((req, res, next) => {
  if (!db) {
    return res.status(500).send('Database not connected');
  }
  next();
});

// POST: Login Route - Verify username and password
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.collection(userCollection).findOne({ username });

    if (!user) {
      return res.status(401).send('Invalid username or password');
    }

    if (password === user.password) {
      res.status(200).json(user);
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error logging in');
  }
});

// POST: Create a new appointment
app.post('/appointments', async (req, res) => {
  const { name, address, email, age, gender, dateTime, doctor } = req.body;

  if (!name || !address || !email || !age || !gender || !dateTime || !doctor) {
      return res.status(400).send('All fields are required.');
  }

  try {
      const existingAppointment = await db.collection(appointmentsCollection).findOne({
          doctor,
          dateTime,
      });

      if (existingAppointment) {
          return res.status(409).send('This doctor is already booked for the selected time.');
      }

      const patientId = Math.floor(Math.random() * 1000000);

      const newAppointment = {
          patientId,
          name,
          doctor,
          contact: address,
          email,
          dateTime,
          createdAt: new Date(),
      };

      // Insert new appointment into the database
      const result = await db.collection(appointmentsCollection).insertOne(newAppointment);

      if (result.acknowledged) {
          res.status(201).send('Appointment scheduled successfully');
      } else {
          res.status(500).send('Error scheduling appointment');
      }
  } catch (error) {
      console.error('Error saving appointment:', error);
      res.status(500).send('Error scheduling appointment');
  }
});


// GET: Fetch all appointments
app.get('/appointments', async (req, res) => {
  try {
    const appointments = await db.collection(appointmentsCollection).find().toArray();
    console.log('Appointments in DB:', appointments);  // Log the appointments to check
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).send('Error fetching appointments');
  }
});

// DELETE: Delete an appointment
app.delete('/appointments/:id', async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const result = await db.collection(appointmentsCollection).deleteOne({ _id: new ObjectId(appointmentId) });
    if (result.deletedCount > 0) {
      res.status(200).send('Appointment deleted');
    } else {
      res.status(404).send('Appointment not found');
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).send('Error deleting appointment');
  }
});

// POST: Add a doctor to the doctorList collection
app.post('/addDoctor', async (req, res) => {
  const { doctor, user } = req.body;

  if (!doctor.name || !doctor.specialty || !doctor.gender || !doctor.days || !doctor.start_time || !doctor.end_time || !doctor.email || !doctor.password) {
    return res.status(400).send('All doctor fields are required.');
  }

  if (!user.username || !user.password || !user.name) {
    return res.status(400).send('All user fields are required.');
  }

  try {
    const existingDoctor = await db.collection(doctorCollection).findOne({ email: doctor.email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor with this email already exists' });
    }

    const existingUser = await db.collection(userCollection).findOne({ username: user.username });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this username already exists' });
    }

    const doctorId = `DOC-${Math.floor(Math.random() * 1000000)}`;
    const newDoctor = {
      doctorId,
      name: doctor.name,
      specialty: doctor.specialty,
      gender: doctor.gender,
      days: doctor.days,
      start_time: doctor.start_time,
      end_time: doctor.end_time,
      email: doctor.email,
      password: doctor.password,
      createdAt: new Date(),
    };

    const newUser = {
      username: user.username,
      password: user.password,
      name: user.name,
      createdAt: new Date(),
    };

    // Log the doctor and user data before inserting
    console.log('Adding new doctor and user:', newDoctor, newUser);

    await db.collection(doctorCollection).insertOne(newDoctor);
    await db.collection(userCollection).insertOne(newUser);

    res.status(200).json({ message: 'Doctor and user added successfully' });
  } catch (err) {
    console.error('Error adding doctor and user:', err);
    res.status(500).json({ message: 'Error adding doctor and user', error: err.message });
  }
});

// GET: Fetch all doctors
app.get('/doctors', async (req, res) => {
  try {
    const doctors = await db.collection(doctorCollection).find().toArray();
    const doctorsWithPrefix = doctors.map(doctor => ({
      ...doctor,
      name: `Dr. ${doctor.name}`,
    }));

    res.status(200).json(doctorsWithPrefix);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).send('Error fetching doctors');
  }
});

// DELETE: Delete a doctor by doctorId
app.delete('/deleteDoctor/:id', async (req, res) => {
  const doctorId = req.params.id;

  try {
    const result = await db.collection(doctorCollection).deleteOne({ doctorId: doctorId });
    if (result.deletedCount > 0) {
      res.status(200).send('Doctor deleted');
    } else {
      res.status(404).send('Doctor not found');
    }
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).send('Error deleting doctor');
  }
});

// Serve static files (index.html)
app.use(express.static(__dirname));  // Serve files from the root directory

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
