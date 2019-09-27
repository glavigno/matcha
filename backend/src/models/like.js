const db = require("../database/connection");

const setLike = async obj => {
  let result;
  const { user, likedUser, interested } = obj;
  const query = {
    text: `INSERT INTO
                likes (
                  liked_user_id,
                  interested,
                  user_id
                )
                VALUES($1, $2, $3)`,
    values: [likedUser, interested, user]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
};

const DelLike = async obj => {
  let result;
  const { user, likedUser } = obj;
  const query = {
    text: `DELETE from likes WHERE liked_user_id = $1 AND user_id = $2`,
    values: [likedUser, user]
  };
  try {
    result = await db.pool.query(query);
    return result ? true : false;
  } catch (err) {
    console.log("Error executing query", err.message);
  }
};

module.exports = {
  setLike,
  DelLike
};
