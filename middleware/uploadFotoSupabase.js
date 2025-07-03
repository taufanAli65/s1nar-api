const multer = require("multer");
const supabase = require("../app");

const upload = multer();

const uploadFotoSupabase = [
  upload.single("foto"),
  async (req, res, next) => {
    if (!req.file) {
      req.fotoUrl = null;
      return next();
    }
    try {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `narasi/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error } = await supabase
        .storage
        .from("foto-narasi")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) return res.status(500).json({ error: error.message });

      const { data: publicUrlData } = supabase
        .storage
        .from("foto-narasi")
        .getPublicUrl(fileName);

      req.fotoUrl = publicUrlData.publicUrl;
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

module.exports = uploadFotoSupabase;
