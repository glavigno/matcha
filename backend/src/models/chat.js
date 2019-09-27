const db = require("../database/connection");
const bcrypt = require("bcryptjs");

const saveMsg = async msgObj => {
  const { sender, content, roomId, receiver } = msgObj;
  let result;
  const query = {
    text: `INSERT INTO
                  messages (
                    sender,
                    content,
                    match_id,
                    receiver,
                    timestamp
                  )
                  VALUES($1, $2, $3, $4, current_timestamp)`,
    values: [sender, content, roomId, receiver]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
};

const getMessagesByMatchId = async matchId => {
  let result;
  const query = {
    text: `SELECT content, sender, timestamp FROM messages WHERE match_id = $1 ORDER BY messages.timestamp ASC`,
    values: [matchId]
  };
  try {
    result = await db.pool.query(query);
    return result.rows;
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
};

async function readConv(matchId, reader) {
  let result;
  const query = {
    text: `UPDATE messages SET unread = false WHERE (match_id = $1 AND receiver = $2)`,
    values: [matchId, reader]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function getNbUnread(userId) {
  let result;
  const query = {
    text: `SELECT COUNT(*) FROM messages WHERE (receiver = $1 AND unread = true)`,
    values: [userId]
  };
  try {
    result = await db.pool.query(query);
    nbUnread = result.rows[0].count;
    return nbUnread;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

const delConvByIdUsers = async (idUser1, idUser2) => {
  let result;
  const query = {
    text: `DELETE from messages WHERE (sender = $1 AND receiver = $2) OR (sender = $2 AND receiver = $1)`,
    values: [idUser1, idUser2]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
};

module.exports = {
  saveMsg,
  getMessagesByMatchId,
  readConv,
  getNbUnread,
  delConvByIdUsers
};
