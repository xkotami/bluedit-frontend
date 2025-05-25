import { useState, useEffect } from 'react';
import { UserData } from '@types';

export const useUser = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [userError, setUserError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const response = sessionStorage.getItem('user');
            if (response) {
                const parsedResponse = JSON.parse(response);
                if (!parsedResponse.id || !parsedResponse.email) {
                    throw new Error('Invalid user data format');
                }

                const userData: UserData = {
                    token: parsedResponse.token,
                    email: parsedResponse.email,
                    id: parsedResponse.id,
                };
                setUserData(userData);
            }
        } catch (err) {
            setUserError(err instanceof Error ? err.message : 'Failed to load user data');
        } finally {
            setIsUserLoading(false);
        }
    }, []);

    return { userData, isUserLoading, userError };
};