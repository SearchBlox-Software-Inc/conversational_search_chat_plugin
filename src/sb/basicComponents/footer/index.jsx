
import commonStyles from './../../css/common.module.scss';
import styles from './footer.module.scss';
import SBLogoSRC from '../../../assets/images/sb-logomain.png';

// ==========================================================================================


function Footer() {
   return (
      <footer className={styles.sbFooter}>
         <div className={commonStyles.contentWrapper}>
            <p className={styles.poweredBy}>Powered by</p>
            <a href="https://www.searchblox.com" target="_blank" rel="noreferrer" className={styles.sbFooterLogo} title="SearchBlox Software">
               <img width="120px" alt="SearchBlox Software logo" src={SBLogoSRC} loading="lazy" />
            </a>
            <p className={styles.copyright}>
               &copy;&nbsp;{new Date().getFullYear()} SearchBlox Software, Inc. All rights reserved.
            </p>
         </div>
      </footer>
   );
}


export default Footer;