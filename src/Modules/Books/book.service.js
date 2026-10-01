import db from '../../DB/connection.js';
import bookModel from '../../DB/Models/book.model.js';

export const createBooksCollection = async (req, res) => {
  try {
    await db.createCollection('books', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['title'],
          properties: {
            title: {
              bsonType: 'string',
              minLength: 1,
              description: 'title must be a non-empty string and is required'
            }
          }
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    });
    return res.status(200).json({ ok: 1 });

  } catch (err) {
    if (err.codeName === 'NamespaceExists' || err.code === 48) {
      return res.status(400).json({ message: "Collection 'books' already exists." });
    }

    return res.status(500).json({ error: err.message });
  }
};

export const createBookIndex = async (req, res) => {
  try {
    const indexName = await bookModel.createIndex({ title: 1 });

    return res.status(200).json(indexName);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const addBook = async (req, res) => {
  try {
    const book = await bookModel.insertOne(req.body);
    return res.status(200).json(book);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const addBooks = async (req, res) => {
  try {
    let booksData = req.body;

    if (typeof booksData === 'string') {
      booksData = JSON.parse(booksData);
    }

    const result = await db.collection('books').insertMany(booksData);

    return res.status(201).json({
      acknowledged: result.acknowledged,
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateBookTitle = async (req, res) => {
  try {
    const { title } = req.params;

    const result = await bookModel.updateOne(
      { title: title },
      { $set: { year: 2022 } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({
      acknowledged: result.acknowledged,
      modifiedCount: result.modifiedCount
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getBookByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ message: "Title query parameter is required" });
    }

    const book = await bookModel.findOne({
      title: { $regex: title, $options: 'i' }
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const books = await bookModel.find().toArray();
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getBooksByYearRange = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "Both 'from' and 'to' query parameters are required" });
    }

    const books = await bookModel.find({
      year: { 
        $gte: Number(from), 
        $lte: Number(to) 
      }
    }).toArray();

    return res.status(200).json(books);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getBooksByGenre = async (req, res) => {
  try {
    const { genre } = req.query;

    if (!genre) {
      return res.status(400).json({ message: "Genre query parameter is required" });
    }

    const books = await bookModel.find({
      genres: { $regex: genre, $options: 'i' }
    }).toArray();

    return res.status(200).json(books);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getBooksSkipLimit = async (req, res) => {
  try {
    const books = await bookModel.find()
      .sort({ year: -1 })
      .skip(2)
      .limit(3)
      .toArray();

    return res.status(200).json(books);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getBooksByIntegerYear = async (req, res) => {
  try {
    const books = await bookModel.find({
      year: { $type: "int" }
    }).toArray();

    return res.status(200).json(books);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getBooksExcludeGenres = async (req, res) => {
  try {
    const books = await bookModel.find({
      genres: { $nin: ["Horror", "Science Fiction"] }
    }).toArray();

    return res.status(200).json(books);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteBooksBeforeYear = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Year query parameter is required" });
    }
    const result = await bookModel.deleteMany({
      year: { $lt: Number(year) }
    });

    return res.status(200).json({
      acknowledged: result.acknowledged,
      deletedCount: result.deletedCount
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getBooksAggregate1 = async (req, res) => {
  try {
    const books = await bookModel.aggregate([
      {
        $match: {
          year: { $gt: 2000 }
        }
      },
      {
        $sort: {
          year: -1
        }
      }
    ]).toArray();

    return res.status(200).json(books);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getBooksAggregate2 = async (req, res) => {
  try {
    const books = await bookModel.aggregate([
      {
        $match: {
          year: { $gt: 2000 }
        }
      },
      {
        $project: {
          _id: 0,
          title: 1,
          author: 1,
          year: 1
        }
      }
    ]).toArray();

    return res.status(200).json(books);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getBooksAggregate3 = async (req, res) => {
  try {
    const books = await bookModel.aggregate([
      {
        $unwind: "$genres"
      },
      {
        $project: {
          _id: 0,
          title: 1,
          genres: 1
        }
      }
    ]).toArray();

    return res.status(200).json(books);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getBooksAggregate4 = async (req, res) => {
  try {
    
    const result = await db.collection('logs').aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'book_id',
          foreignField: '_id',
          as: 'book_details'
        }
      },
      {
        $project: {
          _id: 0,
          action: 1,
          'book_details.title': 1,
          'book_details.author': 1,
          'book_details.year': 1
        }
      }
    ]).toArray();

    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};