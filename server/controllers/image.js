export const uploadImage = async (req, res) => {
  try {
    const { picturePath } = req.body;
    res.status(200).json(picturePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
