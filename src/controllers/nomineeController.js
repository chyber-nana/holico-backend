const prisma = require("../prisma/client");

const buildImageUrl = (req, file) => {
  if (!file) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
};

exports.getNominees = async (_req, res) => {
  try {
    const nominees = await prisma.nominee.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(nominees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createNominee = async (req, res) => {
  try {
    const { name, bio, categoryId } = req.body;

    const nominee = await prisma.nominee.create({
      data: {
        name,
        bio: bio || "",
        categoryId: Number(categoryId),
        image: buildImageUrl(req, req.file),
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(nominee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNominee = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, bio, categoryId } = req.body;

    const existing = await prisma.nominee.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Nominee not found" });
    }

    const nominee = await prisma.nominee.update({
      where: { id },
      data: {
        name,
        bio: bio || "",
        categoryId: Number(categoryId),
        image: req.file ? buildImageUrl(req, req.file) : existing.image,
      },
      include: {
        category: true,
      },
    });

    res.json(nominee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNominee = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.nominee.delete({
      where: { id },
    });

    res.json({ message: "Nominee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};