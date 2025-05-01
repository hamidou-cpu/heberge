// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route pour servir le fichier HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/animation-construction.html'));
});

// Envoi du formulaire
app.post('/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Config Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // utilise la variable d'environnement
      pass: process.env.EMAIL_PASS, // utilise la variable d'environnement
    },
  });

  const mailOptions = {
    from: email, // Email de l'utilisateur (client)
    to: 'contact@begecgroup.com', // Email de l'entreprise
    subject: 'Nouveau message du formulaire de contact',
    html: `
      <h3>Informations de contact</h3>
      <p><strong>Nom:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Téléphone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `,
  };
  

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email envoyé avec succès' });
  } catch (err) {
    console.error('Erreur lors de l’envoi de l’email:', err);
    res.status(500).json({ message: 'Erreur lors de l’envoi de l’email' });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});