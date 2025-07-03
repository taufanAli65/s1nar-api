const express = require("express")
const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sinar-app-dpsi-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const app = express()

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

const narasiRoutes = require("./routes/narasiRoutes");
app.use("/narasi", narasiRoutes);

const pembayaranRoutes = require("./routes/pembayaranRoutes");
app.use("/pembayaran", pembayaranRoutes);

const ideaRoutes = require("./routes/ideaRoutes");
app.use("/idea", ideaRoutes);

const contentRoutes = require("./routes/contentRoutes");
app.use("/content", contentRoutes);

app.listen(3000, () => {
    console.log("http://localhost:3000")
})