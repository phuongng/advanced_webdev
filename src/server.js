const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable All CORS Requests for development
app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connect("mongodb+srv://cosc617:admin@kindredapp.s34qhh0.mongodb.net/kindred", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error: ", err));

const Caregiver = require("./models/caregiver"); // Create the Caregiver model
const Appointment = require("./models/appointment");
const Review = require("./models/review");
const Client = require("./models/client");

// Nodemailer Transporter
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'phenxejs@gmail.com', //throwaway email
    pass: 'ffob dvfb imfn odiz'
  }
});

/* Sample API call setup, uses mongoose model schema */
// GET
app.get("/api/caregiver", async (req, res) => {
  try {
    const { name } = req.query; // Extract name from query parameters
    if (name) {
      // If a name is provided, search for a specific caregiver
      const caregiver = await Caregiver.findOne({ 'fullname': name });
      if (!caregiver) {
        return res.status(404).json({ error: "Caregiver not found" });
      }
      res.json(caregiver);
    } else {
      // If no name is provided, return all caregivers
      const caregivers = await Caregiver.find();
      res.json(caregivers);
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get("/api/client", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
app.get("/api/review", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
app.get("/api/appointment", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// POST
app.post('/api/caregiver/new', async (req, res) => {
  try {
    const newCaregiver = new Caregiver(req.body);
    await newCaregiver.save();

    res.status(201).json(newCaregiver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/client/new', async (req, res) => {
  try {
    const newClient = new Client(req.body);
    await newClient.save();

    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/review/new', authenticateToken, async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/appointment/new', authenticateToken, async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);

    const client = await Client.findById(newAppointment.clientID);

    const caregiver = await Caregiver.findById(newAppointment.caregiverID);

    if (!client || !caregiver) {
      return res.status(404).json({ error: 'Client or Caregiver not found' });
    }

    await newAppointment.save();

    function html(patientFirstName, patientLastName, fullname, dateTime, serviceNeeded) {
      return `
        <h1>Appointment Confirmation</h1>
        <p>Patient Name: ${patientFirstName} ${patientLastName}</p>
        <p>Caregiver Name: ${fullname}</p>
        <p>Appointment Date and Time: ${dateTime}</p>
        <p>Service Needed: ${serviceNeeded}</p>
      `;
    }

    const mailOptions = {
      from: 'phenxejs@gmail.com', // throwaway email
      to: client.personalInfo.email,
      subject: `Kindred Appointment Confirmation on ${newAppointment.dateTime}`,
      text: `Appointment Confirmation\n\nPatient Name: ${client.personalInfo.patientFirstName} ${client.personalInfo.patientLastName}\nCaregiver Name: ${caregiver.fullname}\nAppointment Date and Time: ${newAppointment.dateTime}\nService Needed: ${newAppointment.serviceNeeded}`,
      html: html(client.personalInfo.patientFirstName,
        client.personalInfo.patientLastName,
        caregiver.fullname,
        newAppointment.dateTime,
        newAppointment.serviceNeeded)
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Appointment confirmation email sent:', info.response);
      }
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/client/login', async (req, res) => {
  try {
    const client = await Client.findOne({ 'login.username': req.body.username });
    if (client == null) {
      return res.status(400).json({ message: 'Client not found' });
    }
    if (await bcrypt.compare(req.body.password, client.login.password)) {
      const accessToken = jwt.sign({ name: client.login.username }, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).json({ accessToken: accessToken, message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Wrong Password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE 
app.delete('/api/caregiver/delete/:id', authenticateToken, async (req, res) => {
  const caregiverId = req.params.id;
  try {
    const caregiver = await Caregiver.findByIdAndDelete(caregiverId);
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }
    res.status(200).json({ message: 'Caregiver deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete('/api/client/delete/:id', authenticateToken, async (req, res) => {
  const clientId = req.params.id;

  try {
    const deletedClient = await Client.findByIdAndDelete(clientId);

    if (!deletedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete('/api/appointment/delete/:id', authenticateToken, async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete('/api/review/delete/:id', authenticateToken, async (req, res) => {
  const reviewId = req.params.id;

  try {
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT
app.put('/api/client/update/:id', authenticateToken, async (req, res) => {
  const clientId = req.params.id;
  const updateData = req.body;

  try {
    const updatedClient = await Client.findByIdAndUpdate(clientId, updateData, { new: true });

    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.put('/api/appointment/update/:id', authenticateToken, async (req, res) => {
  const appointmentId = req.params.id;
  const updateData = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, updateData, { new: true });

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.put('/api/review/update/:id', authenticateToken, async (req, res) => {
  const reviewId = req.params.id;
  const updateData = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(reviewId, updateData, { new: true });

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.put('/api/caregiver/update/:id', authenticateToken, async (req, res) => {
  const caregiverId = req.params.id;
  const updateData = req.body;

  try {
    const updatedCaregiver = await Caregiver.findByIdAndUpdate(caregiverId, updateData, { new: true });

    if (!updatedCaregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }

    res.status(200).json(updatedCaregiver);
  } catch (error) {
    console.error('Error updating caregiver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API to increment total patients for a caregiver
app.post('/api/caregiver/increment-patients/:name', async (req, res) => {
  const caregiverName = req.params.name;

  try {
    const updatedCaregiver = await Caregiver.findOneAndUpdate(
      { 'caregiver.caregiver_name': caregiverName },
      { $inc: { 'caregiver.total_patients': 1 } },
      { new: true }
    );

    if (!updatedCaregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }

    res.status(200).json(updatedCaregiver);
  } catch (error) {
    console.error('Error updating caregiver by name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Authenticate Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  })
}
