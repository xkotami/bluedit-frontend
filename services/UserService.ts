const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const getAllUsers = async (token: string) => {
    return fetch(`${BASE_URL}/user/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

const findUserById = async (id: number, token: string) => {
    return fetch(`${BASE_URL}/user/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

const login = async (credentials: { email: string; password: string }) => {
    return fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
};

const register = async (userData: { username: string; email: string; password: string }) => {
    return fetch(`${BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
};

export default {
    getAllUsers,
    findUserById,
    login,
    register
};