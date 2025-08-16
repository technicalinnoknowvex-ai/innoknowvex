import Hiringpartners from './HiringPartner'
import ImageMarquee from './ImageMarquee'
import styles from './styles/Partner.module.scss'
export default function Partner(){
    return (
        <div className={styles.layout}>
            <img src="./images/SoftStar.svg"
             alt="star"
             width={30}
             height={30} />
            <h1>Our Partners</h1>
            <p>SEE BRANDS THAT TRUSTS US</p>

            <ImageMarquee/>
            <p>HIRING PARTNERS</p>

            <Hiringpartners/>

        </div>
    )
}