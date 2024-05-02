const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

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
app.post('/api/review/new', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/appointment/new', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);

    await newAppointment.save();

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE 
app.delete('/api/caregiver/delete/:id', async (req, res) => {
  const caregiverId = req.params.id;

  try {
    const deletedCaregiver = await Caregiver.findByIdAndDelete(caregiverId);

    if (!deletedCaregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }

    res.status(200).json({ message: 'Caregiver deleted successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error deleting caregiver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete('/api/client/delete/:id', async (req, res) => {
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
app.delete('/api/appointment/delete/:id', async (req, res) => {
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
app.delete('/api/review/delete/:id', async (req, res) => {
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
app.put('/api/client/update/:id', async (req, res) => {
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
app.put('/api/appointment/update/:id', async (req, res) => {
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
app.put('/api/review/update/:id', async (req, res) => {
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
app.put('/api/caregiver/update/:id', async (req, res) => {
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
app.post('/api/caregiver/increment-patients/:id', async (req, res) => {
  const caregiverId = req.params.id;

  try {
      const updatedCaregiver = await Caregiver.findByIdAndUpdate(
          caregiverId,
          { $inc: { 'caregiver.total_patients': 1 } },
          { new: true }
      );

      if (!updatedCaregiver) {
          return res.status(404).json({ message: 'Caregiver not found' });
      }

      res.status(200).json(updatedCaregiver);
  } catch (error) {
      console.error('Error updating caregiver:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
