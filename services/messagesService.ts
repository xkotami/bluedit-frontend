const getAllMessages = ()=>{
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
}


const getMessageById = (messageId: string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `/messages/${messageId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  
  const MessageService = {
    getAllMessages,
    getMessageById
  };
  
  export default MessageService;