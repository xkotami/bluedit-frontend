import { ArrowRight } from "lucide-react"
import styles from '@styles/community.module.css'
import Community from "pages/community"

type props={
    community:Array<Community>
}

const CommunityOverview: React.FC<props> = () => {
    return(
        <div>
            <h3>Communities <ArrowRight className={styles['icon']}/></h3>
            {Community &&(
                <ul>
                    <li>{community}</li>
                </ul>
            )}
        </div>
    )
}

export default CommunityOverview;