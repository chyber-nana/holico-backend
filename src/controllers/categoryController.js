const prisma = require('../prisma/client');

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        nominees: {
          orderBy: {
            voteCount: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        nominees: {
          orderBy: {
            voteCount: 'desc',
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, slug } = req.body;

    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    if (existingCategory) {
      return res.status(409).json({ message: 'Category name or slug already exists' });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        slug,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, slug } = req.body;
    const categoryId = Number(req.params.id);

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const duplicate = await prisma.category.findFirst({
      where: {
        id: { not: categoryId },
        OR: [{ name }, { slug }],
      },
    });

    if (duplicate) {
      return res.status(409).json({ message: 'Category name or slug already exists' });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        description,
        slug,
      },
    });

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};