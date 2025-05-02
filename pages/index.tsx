import styles from '@styles/home.module.css';
import SideBar from '@components/sidebar';
import NavBar from '@components/navbar';
import Communities from '@components/communities';
import { useEffect, useState } from 'react';
import MessageOverview from '@components/messages';
import MessageService from '@services/messagesService';



const Home: React.FC= ()=>{
    const [messages, setMessages]= useState<Array<Message>>();
    const [error, setError] = useState<string>();

    const getMessages = async()=>{
        setError("");
        const response = await MessageService.getAllMessages();

        if (!response.ok) {
            setError(response.statusText);
        } else {
            const messages = await response.json();
            setMessages(messages);
        }
    }

    useEffect(()=>{
        getMessages();
    },[]);
    return(
        <div className={styles.pageLayout}>
                <SideBar />
                <section className={styles.mainContent}>
                    <NavBar/>
                    <MessageOverview 
                    messages={messages}/>  
                    <Communities />
                </section>
            </div>
    )
}

export default Home;







