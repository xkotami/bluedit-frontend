import styles from '@styles/home.module.css';
import { ArrowRight } from 'lucide-react';



type props = {
    messages: Array<Message>
}

const MessageOverview: React.FC<props>= ()=>{
    return(
        <div>
            <h3>Direct messages <ArrowRight className={styles['icon']}/></h3>
            {messages &&(
                <ul>
                    <li>{message}</li>
                </ul>
            )}
        </div>
    )
}

export default MessageOverview;




