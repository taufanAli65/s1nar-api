const multer = require("multer");
const { supabase } = require("../supabaseClient"); // <-- updated import

// Expected field name: "foto"
const upload = multer();

const uploadFotoSupabase = [
  upload.single("foto"),
  async (req, res, next) => {
    // If file is not present, allow next
    if (!req.file) {
      req.fotoUrl = null;
      return next();
    }
    try {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `narasi/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error } = await supabase
        .storage
        .from("s1nar-app")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) return res.status(500).json({ error: error.message });

      const { data: publicUrlData } = supabase
        .storage
        .from("s1nar-app")
        .getPublicUrl(fileName);

      req.fotoUrl = publicUrlData.publicUrl;
      next();
    } catch (err) {
      // MulterError: Unexpected field
      if (err.name === "MulterError" && err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ error: "Field file harus bernama 'foto'" });
      }
      res.status(500).json({ error: err.message });
    }
  }
];

module.exports = uploadFotoSupabase;
