const getAllcommunity = ()=>{
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/community", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
}


const getMessageById = (communtyId: string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `/community/${communtyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  
  const communityService = {
    getAllcommunity,
    getMessageById
  };
  
  export default communityService;