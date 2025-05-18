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

export default {
    getAllCommunities,
    getCommunityById,
    findCommunityByPostId,
}