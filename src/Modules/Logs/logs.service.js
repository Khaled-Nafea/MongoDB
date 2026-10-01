import db from '../../DB/connection.js';
import logModel from '../../DB/Models/log.model.js';
import { ObjectId } from 'mongodb';

export const createCappedCollection = async (req, res) => {
  try {
    await db.createCollection('logs', {
      capped: true,
      size: 1048576
    });

    return res.status(200).json({ ok: 1 });

  } catch (err) {
    if (err.codeName === 'NamespaceExists' || err.code === 48) {
      return res.status(400).json({ message: "Collection 'logs' already exists." });
    }

    return res.status(500).json({ error: err.message });
  }
};

export const insertLog = async (req, res) => {
  try {
    let logData = req.body;

    if (typeof logData === 'string') {
      logData = JSON.parse(logData);
    }

    if (logData.book_id) {
      logData.book_id = new ObjectId(logData.book_id);
    }

    const result = await logModel.insertOne(logData);

    return res.status(201).json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
