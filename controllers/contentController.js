const contentService = require("../services/contentService");

exports.updateContentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const content = await contentService.updateContentStatus(req.params.id, status);
    res.json(content);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
