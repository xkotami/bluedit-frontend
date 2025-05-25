const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const getAllCommunities = async () => {
    return fetch(`${BASE_URL}/community/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const getCommunityById = async (id: number) => {
    return fetch(`${BASE_URL}/community/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const findCommunityByPostId = async (postId: number) => {
    return fetch(`${BASE_URL}/community/post/${postId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const getCommunitiesOfUser = async (token: string) => {
    return fetch(`${BASE_URL}/community/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

const createCommunity = async (name: string, description: string, token: string) => {
    return fetch(`${BASE_URL}/community/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify( { name, description } )
    });
};

export default {
    getAllCommunities,
    getCommunityById,
    findCommunityByPostId,
    getCommunitiesOfUser,
    createCommunity,
}