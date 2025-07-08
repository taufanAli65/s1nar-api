const express = require("express")
const cors = require("cors");
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
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const narasiRoutes = require("./routes/narasiRoutes");
app.use("/narasi", narasiRoutes);

const pembayaranRoutes = require("./routes/pembayaranRoutes");
app.use("/pembayaran", pembayaranRoutes);

const ideaRoutes = require("./routes/ideaRoutes");
app.use("/idea", ideaRoutes);

const contentRoutes = require("./routes/contentRoutes");
app.use("/content", contentRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

app.listen(8010, () => {
    console.log("http://localhost:8010")
})