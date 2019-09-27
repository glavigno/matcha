export const filterConvs = (Convs, userId) => {
  const tmpArray = Convs.filter(conv => !conv.block);
  return tmpArray.map(conv => {
    return conv.id1 !== userId
      ? {
          id: conv.id,
          firstname: conv.firstname1,
          id_receiver: conv.id1,
          avatar: conv.avatar1,
          logged: conv.logged1,
          preview: conv.preview,
          preview_sender: conv.preview_sender,
          unread: conv.unread
        }
      : {
          id: conv.id,
          id_receiver: conv.id2,
          firstname: conv.firstname2,
          avatar: conv.avatar2,
          logged: conv.logged2,
          preview: conv.preview,
          preview_sender: conv.preview_sender,
          unread: conv.unread
        };
  });
};

export const enterRoom = (socketContext, roomId) => {
  if (Object.keys(socketContext).length > 0) {
    socketContext.emit("createChatroom", roomId);
  }
};

export const quitRoom = (socketContext, roomId) => {
  if (Object.keys(socketContext).length > 0) {
    socketContext.emit("quitChatroom", roomId);
  }
};

export const readConv = async (convId, token, userId) => {
  const res = await fetch(`/chat/readconv`, {
    headers: { token: token, match_id: convId, user: userId }
  });
  try {
    if (res) {
      if (res.status === 200) {
        return true;
      } else {
        console.log("Access denied!");
      }
    }
  } catch (err) {
    console.log(err);
  }
};
