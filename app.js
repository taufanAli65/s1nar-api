const express = require("express")
const admin = require("firebase-admin");
const serviceAccount = require("./service_account.json");
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

app.listen(3000, () => {
    console.log("http://localhost:3000")
})