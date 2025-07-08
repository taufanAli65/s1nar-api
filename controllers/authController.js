const admin = require("firebase-admin");
const db = admin.firestore();

exports.register = async (req, res) => {
  try {
    const { email, password, role, nama, deskripsi, domisili, website, facebook, instagram, linkedin } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: "email, password, and role are required" });
    }
    if (!["creator", "organisasi"].includes(role)) {
      return res.status(400).json({ error: "role must be either 'creator' or 'organisasi'" });
    }

    // Create Firebase Auth user
    let userRecord;
    try {
      userRecord = await admin.auth().createUser({ email, password });
    } catch (e) {
      if (e.code === "auth/email-already-exists") {
        return res.status(400).json({ error: "Email already exists" });
      }
      throw e;
    }

    let userData = {
      email,
      nama,
      uid: userRecord.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      role,
      fotoUrl: req.fotoUrl || null, // tambahkan fotoUrl jika ada
    };

    // Tambahkan field khusus untuk creator
    if (role === "creator") {
      userData.deskripsi = deskripsi || "";
      userData.domisili = domisili || "";
    }

    // Save to users collection
    await db.collection("user").doc(userRecord.uid).set(userData);

    // If organisasi, also save to organisasi collection
    if (role === "organisasi") {
      if (!nama) return res.status(400).json({ error: "nama is required for organisasi" });
      const orgData = {
        nama,
        deskripsi: deskripsi || "",
        website: website || "",
        facebook: facebook || "",
        instagram: instagram || "",
        linkedin: linkedin || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        uid: userRecord.uid,
        email,
        fotoUrl: req.fotoUrl || null, // tambahkan fotoUrl jika ada
      };
      await db.collection("organisasi").doc(userRecord.uid).set(orgData);
    }

    res.status(201).json({ message: "Account created", uid: userRecord.uid, role, fotoUrl: req.fotoUrl || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  // This is a placeholder for email/password login.
  // In production, use Firebase Auth client SDK on frontend to get ID token, then verify here.
  // For demo, accept email & password, verify with Firebase Auth, and return custom token.
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    // Firebase Admin SDK does not support password verification.
    // Instruct client to use Firebase Auth client SDK for login.
    return res.status(400).json({
      error: "Use Firebase Auth client SDK to sign in and send ID token to backend.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
