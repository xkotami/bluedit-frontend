import Head from 'next/head';
import SideBar from '@components/sidebar';
import styles from '@styles/community.module.css';
import { useEffect, useState } from 'react';
import communityService from '@services/communityService';
import CommunityOverview from '@components/communities';

const Community: React.FC = ()=>{
    const [community, setCommunity]= useState<Array<Message>>();
    const [error, setError] = useState<string>();

    const getCommunity = async()=>{
        setError("");
        const response = await communityService.getAllcommunity();

        if (!response.ok) {
            setError(response.statusText);
        } else {
            const communities= await response.json();
            setCommunity(community);
        }
    }

    useEffect(()=>{
        getCommunity();
    },[]);
    return(
        <>
            <Head>
                <title>Setback | Profile</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            </Head>
            <div className={styles.pageLayout}>
                <SideBar />
                    <CommunityOverview 
                    community={communities} />
                </main>
            </div>

            
        </>
    )

}

export default Community;