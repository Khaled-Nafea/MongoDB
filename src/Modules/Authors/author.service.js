import db from '../../DB/connection.js';

export const createAuthorImplicit = async (req, res) => {
  try {
    const { name, nationality } = req.body;

    const result = await db.collection('authors').insertOne({name, nationality});

    return res.status(201).json({
      message: "Implicit collection created successfully",
      insertedId: result.insertedId
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};