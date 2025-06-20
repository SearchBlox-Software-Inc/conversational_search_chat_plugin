import SkeletonItem from '../basicComponents/skeletonItem/';

import styles from './styles/resultsSkeleton.module.scss';
import resultsStyles from './styles/results.module.scss';


// ==========================================================================================


function ResultsSkeleton({number}) {
   return (
      <div className={styles.resultSkeleton}>
            <div className={styles.skeletonContent}>
               <SkeletonItem className={styles.skeletonHeading} />
               <div className={resultsStyles.resultsContainerSkeleton}>
               {[...Array(number)].map((_, i) => (
               <div key={i} className={styles.skeletonTitleContainer}>
                  <SkeletonItem className={styles.skeletonTitle} />
               </div>
               ))}
               </div>
            </div>
      </div>
   );
}


export default ResultsSkeleton;