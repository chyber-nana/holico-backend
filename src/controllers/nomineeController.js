const prisma = require("../prisma/client");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (fileBuffer, folder = "holico/nominees") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });

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

    let imageUrl = null;

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploaded.secure_url;
    }

    const nominee = await prisma.nominee.create({
      data: {
        name,
        bio: bio || "",
        categoryId: Number(categoryId),
        image: imageUrl,
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

    let imageUrl = existing.image;

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploaded.secure_url;
    }

    const nominee = await prisma.nominee.update({
      where: { id },
      data: {
        name,
        bio: bio || "",
        categoryId: Number(categoryId),
        image: imageUrl,
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