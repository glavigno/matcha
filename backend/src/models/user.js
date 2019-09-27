const db = require("../database/connection");
const bcrypt = require("bcryptjs");

// Queries
async function getUsers() {
  let result;
  const query = { text: "SELECT * FROM users" };
  try {
    result = await db.pool.query(query);
    return result.rows;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function getUserId(userId) {
  let result;
  const query = {
    text: "SELECT id FROM users WHERE id=$1",
    values: [userId]
  };
  try {
    result = await db.pool.query(query);
    return result.rowCount == 1 ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function userExists(email) {
  let result;
  const query = {
    text: "SELECT * FROM users WHERE email=$1",
    values: [email]
  };
  try {
    result = await db.pool.query(query);
    return result.rowCount == 1 ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function findUser(email) {
  let result;
  const query = {
    text: `SELECT * FROM users WHERE email=$1`,
    values: [email]
  };
  try {
    result = await db.pool.query(query);
    return result.rowCount == 1 ? result.rows[0] : false;
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
}

/* ----INSERT INTO DB--------------------------------------------------------------------- */

async function registerUser(user, key) {
  let result;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  const query = {
    text: `INSERT INTO
                users (
                  firstname,
                  lastname,
                  email,
                  login,
                  age,
                  password,
                  key
                )
                VALUES($1, $2, $3, $4, $5, $6, $7)`,
    values: [
      user.firstName,
      user.lastName,
      user.email,
      user.login,
      user.age,
      hashedPassword,
      key
    ]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function saveSettings(userId, form) {
  let result;
  const {
    login,
    firstname,
    lastname,
    minage,
    maxage,
    gender,
    orientation,
    perimeter,
    bio,
    city,
    latitude,
    longitude,
    tags,
    avatar
  } = form;

  const formattedTags = `{${tags.join(",")}}`;
  const query = {
    text: `UPDATE users
            SET (login, firstname, lastname, gender, minage, maxage, orientation, perimeter, bio, city, latitude, longitude, is_complete, tags, avatar) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            WHERE id = $16`,
    values: [
      login,
      firstname,
      lastname,
      gender,
      minage,
      maxage,
      orientation,
      perimeter,
      bio,
      city,
      latitude,
      longitude,
      true,
      formattedTags,
      avatar,
      userId
    ]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
}

async function savePictures(userId, pictures) {
  let result;
  const secureUrls = pictures.map(e => e.secure_url);
  const formattedPics = `{${secureUrls.join(",")}}`;
  const query = {
    text: `UPDATE users
            SET avatar = $1
            WHERE id = ${userId}`,

    values: [formattedPics]
  };
  try {
    result = await db.pool.query(query);
    return result ? pictures : false;
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
}

/* ----GET CONTEXT USER------------------------------------------------------------------- */

async function getContextUser(email) {
  let result;
  const query = {
    text: `SELECT id, firstname, lastname, gender, age, avatar, login, email, perimeter, minage, maxage, orientation, city, is_complete, score, tags, lastconnection, latitude, longitude FROM users WHERE email=$1`,
    values: [email]
  };
  try {
    result = await db.pool.query(query);
    return result.rows[0];
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
}

/* ----GET SEARCH / MATCHER PROFILES------------------------------------------------------ */

async function hasLiked(user, likedUser) {
  let result;
  const query = {
    text: `SELECT * FROM likes WHERE user_id = $1 AND liked_user_id = $2`,
    values: [user, likedUser]
  };
  try {
    result = await db.pool.query(query);
    return result.rowCount !== 0 ? true : false;
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
}

async function getSuggestedProfiles(searchedGender, both, userGender, userId) {
  let result;
  searchedGender = searchedGender === 1 ? 1 : 2;
  userGender = userGender === 1 ? 1 : 2;
  const query = {
    text: `SELECT id, firstname, lastname, gender, age, avatar, login, email, perimeter, minage, maxage, orientation, city, is_complete, score, latitude, longitude, bio, logged, tags, lastconnection, palette,
        EXISTS(SELECT * FROM likes WHERE user_id = $1 AND liked_user_id = users.id) AS hasliked,
        EXISTS(SELECT * FROM likes WHERE user_id = users.id AND liked_user_id = $1) AS isliked,
        EXISTS(SELECT * FROM blocks WHERE blocked_id = users.id AND blocker_id = $1) AS hasblocked,
        EXISTS(SELECT * FROM blocks WHERE blocker_id = users.id AND blocked_id = $1) AS isblocked
        FROM users WHERE
        (gender = $2 OR gender = $3) AND (orientation = 3 OR orientation = $4)
        AND (id <> $5)`,
    values: [
      userId,
      searchedGender,
      both ? 2 : searchedGender,
      userGender,
      userId
    ]
  };
  try {
    result = await db.pool.query(query);
    return result.rows;
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
}

async function getUserInfo(userId) {
  let result;
  const query = {
    text: `SELECT * FROM users WHERE id=$1`,
    values: [userId]
  };
  try {
    result = await db.pool.query(query);
    return result.rows[0];
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function getOneUser(userId, currentUserId) {
  let result;
  const query = {
    text: `SELECT id, firstname, lastname, gender, age, avatar, login, email, perimeter, minage, maxage, orientation, city, is_complete, score, latitude, longitude, bio, tags, logged, lastconnection, avatar, palette,
        EXISTS(SELECT * FROM likes WHERE user_id = $1 AND liked_user_id = users.id) AS hasliked,
        EXISTS(SELECT * FROM likes WHERE user_id = users.id AND liked_user_id = $1) AS isliked,
        EXISTS(SELECT * FROM blocks WHERE blocked_id = $2 AND blocker_id = $1) AS hasblocked,
        EXISTS(SELECT * FROM blocks WHERE blocked_id = $1 AND blocker_id = $2) AS isblocked
        FROM users WHERE id=$2`,
    values: [currentUserId, userId]
  };
  try {
    result = await db.pool.query(query);
    return result.rows[0];
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function connectUser(userId, status) {
  let result;
  const query = {
    text: `UPDATE users SET logged = $1, lastconnection = localtimestamp WHERE id = $2`,
    values: [status, userId]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function getNotification(id) {
  let result;
  const query = {
    text: `SELECT * FROM notifications WHERE visited_id = $1 ORDER BY timestamp DESC`,
    values: [id]
  };
  try {
    result = await db.pool.query(query);
    return result ? result.rows : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function getUnreadNotification(id) {
  let result;
  const query = {
    text: `SELECT * FROM notifications WHERE visited_id = $1 AND unread = true`,
    values: [id]
  };

  try {
    result = await db.pool.query(query);
    return result ? result.rows.length : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function readNotification(id) {
  let result;
  const query = {
    text: `UPDATE notifications SET unread = false WHERE visited_id = $1`,
    values: [id]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function saveNotification(req, res) {
  const { type, visited, visitor, timestamp } = req.body;
  const save = async (type, visited, visitor, timestamp) => {
    let result;
    const query = {
      text: `INSERT INTO notifications (type, visited_id, visitor_firstname, timestamp) VALUES($1, $2, $3, $4)`,
      values: [type, visited, visitor, timestamp]
    };
    try {
      result = await db.pool.query(query);
      return result ? true : false;
    } catch (err) {
      console.log("Error executing query", err.message);
    }
  };
  save(type, visited, visitor, timestamp);
  if (type === 1) save(type, req.body.visitorId, "null", timestamp);
}

async function updateUserScore(visited, score) {
  let result;
  const query = {
    text: `UPDATE users SET score = $1 WHERE id = $2 `,
    values: [score, visited]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function updateUserInfo(id, key, value) {
  let result;
  const query = {
    text: `UPDATE users SET ${key} = $1 WHERE id = $2`,
    values: [value, id]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function keyChecker(key) {
  let result;
  const query = {
    text: `SELECT * FROM users WHERE key = $1`,
    values: [key]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function validateAccount(email) {
  let result;
  const query = {
    text: `UPDATE users SET auth = NOT auth WHERE email = $1`,
    values: [email]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function checkUserStatus(email) {
  let result;
  const query = {
    text: `SELECT * from users WHERE email = $1 AND auth = true`,
    values: [email]
  };
  try {
    result = await db.pool.query(query);
    return result.rowCount;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function reportUser(reporterUserId, reportedUserId) {
  let result;
  const query = {
    text: `INSERT INTO reports (reporter_id, reported_id) VALUES($1, $2)`,
    values: [reporterUserId, reportedUserId]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function hasReported(reporterUserId, reportedUserId) {
  let result;
  const query = {
    text: `SELECT * FROM reports WHERE reporter_id = $1 AND reported_id = $2`,
    values: [reporterUserId, reportedUserId]
  };
  try {
    result = await db.pool.query(query);
    return result.rowCount;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function blockUser(blockerUserId, blockedUserId) {
  let result;
  const query = {
    text: `INSERT INTO blocks (blocker_id, blocked_id) VALUES($1, $2)`,
    values: [blockerUserId, blockedUserId]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function getUserPrivateKey(email) {
  let result;
  const query = {
    text: `SELECT key FROM users WHERE email = $1`,
    values: [email]
  };
  try {
    result = await db.pool.query(query);
    return result.rows[0].key;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function resetUserPassword(password, key) {
  let result;
  const query = {
    text: `UPDATE users SET password = $1 WHERE key = $2`,
    values: [password, key]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function resetUserPassword(password, key) {
  let result;
  const query = {
    text: `UPDATE users SET password = $1 WHERE key = $2`,
    values: [password, key]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

async function getBlockStatus(userId, currentUserId) {
  let result;
  const query = {
    text: `SELECT * FROM blocks WHERE blocker_id = $1 AND blocked_id = $2`,
    values: [userId, currentUserId]
  };
  try {
    result = await db.pool.query(query);
    return result.rowCount;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
}

module.exports = {
  getSuggestedProfiles,
  getUsers,
  getOneUser,
  getUserId,
  userExists,
  registerUser,
  findUser,
  saveSettings,
  savePictures,
  getContextUser,
  connectUser,
  getNotification,
  getUnreadNotification,
  readNotification,
  saveNotification,
  updateUserInfo,
  getUserInfo,
  keyChecker,
  validateAccount,
  checkUserStatus,
  reportUser,
  blockUser,
  getUserPrivateKey,
  resetUserPassword,
  updateUserScore,
  hasReported,
  getBlockStatus
};