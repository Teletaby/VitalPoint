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
app.use(
    cors({
        origin: ['http://localhost', 'https://vitalpoint.onrender.com'], // Allowed origins
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
        credentials: true, // If cookies or auth tokens are needed
    })
);

// MongoDB connection
const uri = process.env.MONGO_URI;
const dbName = 'VitalPoint';
const userCollection = 'user';
const appointmentsCollection = 'userDetails';
const doctorCollection = 'doctorList';

let db;

// MongoDB connection with retry logic
async function connectWithRetry() {
    try {
        console.log('Attempting to connect to MongoDB...');
        const client = await MongoClient.connect(uri);
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.error('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    }
}
connectWithRetry();

// Middleware to check if the database is connected
app.use((req, res, next) => {
    if (!db) {
        return res.status(500).send('Database not connected');
    }
    next();
});

// Routes

// POST: Login Route - Verify username and password
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.collection(userCollection).findOne({ username });
        if (user && password === user.password) {
            return res.status(200).json(user);
        }
        res.status(401).send('Invalid username or password');
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
        // Parse `dateTime` to ensure it is a valid Date
        const parsedDateTime = new Date(dateTime);
        if (isNaN(parsedDateTime)) {
            return res.status(400).send('Invalid dateTime format.');
        }

        // Check for existing appointments at the same time
        const existingAppointment = await db.collection(appointmentsCollection).findOne({
            doctor,
            dateTime: parsedDateTime,
        });

        if (existingAppointment) {
            return res.status(409).send('This doctor is already booked for the selected time.');
        }

        // Generate a unique patient ID
        const patientId = `PAT-${Math.floor(Math.random() * 1000000)}`;
        const newAppointment = {
            patientId,
            name,
            doctor,
            contact: address,
            email,
            age,
            gender,
            dateTime: parsedDateTime, // Store as a Date object
            createdAt: new Date(),
        };

        // Insert the new appointment into the database
        const result = await db.collection(appointmentsCollection).insertOne(newAppointment);
        if (result.acknowledged) {
            return res.status(201).send('Appointment scheduled successfully');
        }
        res.status(500).send('Error scheduling appointment');
    } catch (error) {
        console.error('Error saving appointment:', error);
        res.status(500).send('Error scheduling appointment');
    }
});

// GET: Fetch all appointments
app.get('/appointments', async (req, res) => {
    try {
        const appointments = await db.collection(appointmentsCollection).find().toArray();

        // Convert `dateTime` to a readable format before sending to the client
        const formattedAppointments = appointments.map(appointment => ({
            ...appointment,
            dateTime: new Date(appointment.dateTime).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
        }));

        res.status(200).json(formattedAppointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Error fetching appointments');
    }
});

// DELETE: Delete an appointment
app.delete('/appointments/:id', async (req, res) => {
    const appointmentId = req.params.id;

    try {
        const result = await db.collection(appointmentsCollection).deleteOne({
            _id: new ObjectId(appointmentId),
        });
        if (result.deletedCount > 0) {
            return res.status(200).send('Appointment deleted');
        }
        res.status(404).send('Appointment not found');
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).send('Error deleting appointment');
    }
});

// POST: Add a doctor
app.post('/addDoctor', async (req, res) => {
    const { doctor, user } = req.body;

    if (
        !doctor.name ||
        !doctor.specialty ||
        !doctor.gender ||
        !doctor.days ||
        !doctor.start_time ||
        !doctor.end_time ||
        !doctor.email ||
        !doctor.password ||
        !user.username ||
        !user.password ||
        !user.name
    ) {
        return res.status(400).send('All fields are required.');
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
        const newDoctor = { doctorId, ...doctor, createdAt: new Date() };
        const newUser = { ...user, createdAt: new Date() };

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

// DELETE: Delete a doctor and their associated login credentials
app.delete('/deleteDoctor/:id', async (req, res) => {
    const doctorId = req.params.id;

    try {
        // Find the doctor to get their email
        const doctor = await db.collection(doctorCollection).findOne({ doctorId });

        if (!doctor) {
            return res.status(404).send('Doctor not found');
        }

        // Delete the doctor from the doctor collection
        const doctorDeletionResult = await db.collection(doctorCollection).deleteOne({ doctorId });

        if (doctorDeletionResult.deletedCount === 0) {
            return res.status(404).send('Doctor not found');
        }

        // Delete the associated user from the user collection
        const userDeletionResult = await db.collection(userCollection).deleteOne({ username: doctor.email });

        if (userDeletionResult.deletedCount > 0) {
            return res.status(200).send('Doctor and their credentials deleted successfully');
        } else {
            return res.status(200).send('Doctor deleted, but no associated credentials found');
        }
    } catch (error) {
        console.error('Error deleting doctor and their credentials:', error);
        res.status(500).send('Error deleting doctor and their credentials');
    }
});

// Test route to check database connection
app.get('/test-db-write', async (req, res) => {
    try {
        const testDoc = { test: 'test', timestamp: new Date() };
        const result = await db.collection('testCollection').insertOne(testDoc);
        res.status(200).send({ success: true, insertedId: result.insertedId });
    } catch (error) {
        console.error('Database write test failed:', error);
        res.status(500).send({ success: false, error: error.message });
    }
});

// Serve static files
app.use(express.static(__dirname));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
