const functions = require("firebase-functions");
const axios = require("axios");
const admin = require("firebase-admin");

admin.initializeApp();

exports.getWeather = functions.https.onRequest(async (req, res) => {
  // CORS beállítás
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  const city = req.query.city || req.body.city;

  if (!city) {
    res.status(400).json({ error: "Város név kötelező!" });
    return;
  }

  try {
    // API kulcs a Firebase config-ból
    const apiKey = functions.config().weather.key;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=hu`;

    const { data } = await axios.get(url);

    // Opcionális: keresés mentése Firestore-ba
    try {
      await admin.firestore().collection("searchHistory").add({
        city: data.name,
        country: data.sys.country,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (firestoreError) {
      console.error("Firestore hiba:", firestoreError);
      // Nem blokkoljuk a választ, ha a Firestore hiba történt
    }

    res.json(data);
  } catch (error) {
    console.error("Weather API hiba:", error.message);
    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data.message || "Időjárás lekérése sikertelen",
      });
    } else {
      res.status(500).json({ error: "Szerver hiba történt" });
    }
  }
});

// Keresési előzmények lekérése
exports.getSearchHistory = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  try {
    const snapshot = await admin
      .firestore()
      .collection("searchHistory")
      .orderBy("timestamp", "desc")
      .limit(10)
      .get();

    const history = [];
    snapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() });
    });

    res.json(history);
  } catch (error) {
    console.error("Firestore lekérés hiba:", error);
    res.status(500).json({ error: "Előzmények lekérése sikertelen" });
  }
});

