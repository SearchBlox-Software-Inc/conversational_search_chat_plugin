import { useState } from 'react';
import PropTypes from 'prop-types';

import useSearchStore from '../../stores/searchStore';

import ResultItem from './ResultItem';

import DbOverlay from '../basicComponents/overlay/DBOverlay';
import EmailOverlay from '../basicComponents/overlay/EmailOverlay';
import PDFViewer from '../basicComponents/overlay/PDFViewer';
import Overlay from '../basicComponents/overlay/index';

import resultsStyles from './styles/results.module.scss';
import resultItemStyles from './styles/resultItem.module.scss';
import commonStyles from '../css/common.module.scss';


const totalResults = 8; // Total number of results to be shown
const initialResults = 3; // Number of results to be shown first


//  ------------------------------


function DefaultResults({ loadMoreActive, setLoadMoreActive }) {

   const [overlayShown, setOverlayShown] = useState(false);
   const [overlayResult, setOverlayResult] = useState({});
   const [showmore, setshowMore] = useState(false)



   //  ------------------------------


   const response = useSearchStore(state => state.response);
   const { results, resultInfo } = response;
   const filterName = useSearchStore(state => state.filterName);


   //  ------------------------------


   function handleClose() {
      setOverlayShown(false);
      setOverlayResult({});
   }


   function getDBOverlayTitle() {
      const { title, uid } = overlayResult;

      return title?.trim().length ? title : uid;
   }


   function getPDFOverlayTitle() {
      const { url, filename } = overlayResult;

      return (
         <a href={url} target='_blank' rel="noreferrer">
            {filename || url}
            &nbsp; <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M13 3L16.293 6.293 9.293 13.293 10.707 14.707 17.707 7.707 21 11 21 3z"></path><path d="M19,19H5V5h7l-2-2H5C3.897,3,3,3.897,3,5v14c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2v-5l-2-2V19z"></path></svg>
         </a>
      );
   }


   //  ------------------------------


   const currentContentType = overlayResult.contenttype ? overlayResult.contenttype.toLowerCase() : undefined;

   const contentTypeIsDB = ['db', 'csv', 'mongodb'].includes(currentContentType) || overlayResult.isStructured;
   const contentTypeIsPDF = currentContentType == 'pdf';
   const contentTypeIsEmail = currentContentType == 'email';

   const overlayTitle = contentTypeIsDB ?
      getDBOverlayTitle()
      :
      contentTypeIsPDF ?
         getPDFOverlayTitle()
         :
         contentTypeIsEmail ?
            overlayResult.subject
            :
            '';


   const overlayContent = contentTypeIsDB ?
      <DbOverlay overlayResult={overlayResult} />
      :
      contentTypeIsPDF ?
         <PDFViewer overlayResult={overlayResult} />
         :
         contentTypeIsEmail ?
            <EmailOverlay overlayResult={overlayResult} />
            :
            null;


   // reduce the results count to the given total results count
   const FinalResult = results && results.slice(0, totalResults);
   // check if results length is less or equal to the initial count + 1
   const displayInitial = FinalResult && FinalResult.length <= initialResults + 1 ? initialResults + 1 : initialResults;
   // check if view more clicked if not display initial results count
   const ToogleResults = showmore ? totalResults : displayInitial;


   return (
      <>
         <div className={commonStyles.commonHeading}>
            <svg  stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M15.8787 4.87866H3.87872V6.87866H15.8787V4.87866Z" fill="currentColor"></path><path d="M15.8787 8.87866H3.87872V10.8787H15.8787V8.87866Z" fill="currentColor"></path><path d="M3.87872 12.8787H11.8787V14.8787H3.87872V12.8787Z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M13.7574 12.7573C12.5858 13.9289 12.5858 15.8284 13.7574 17C14.681 17.9236 16.0571 18.1191 17.1722 17.5864L18.7071 19.1213L20.1213 17.7071L18.5864 16.1722C19.1191 15.057 18.9236 13.681 18 12.7573C16.8284 11.5858 14.9289 11.5858 13.7574 12.7573ZM15.1716 15.5858C15.5621 15.9763 16.1953 15.9763 16.5858 15.5858C16.9763 15.1952 16.9763 14.5621 16.5858 14.1716C16.1953 13.781 15.5621 13.781 15.1716 14.1716C14.7811 14.5621 14.7811 15.1952 15.1716 15.5858Z" fill="currentColor"></path></svg>
            <h2>Results</h2>
         </div>
         <ul className={resultsStyles.resultsList}>
            {
               FinalResult && FinalResult.slice(0, ToogleResults).map((result, i) => (
                  <li key={`result-${i}`}>
                     <ResultItem
                        result={result}
                        highlight={resultInfo.highlight}
                        setOverlayShown={setOverlayShown}
                        setOverlayResult={setOverlayResult}
                        resultindex={i + 1}
                     />
                  </li>
               ))
            }
            {showmore || FinalResult.length <= displayInitial ?
               null :
               <a className={`${resultItemStyles.result} ${resultItemStyles.viewMoreText}`} href="javascript:void(0)" onClick={() => setshowMore(true)}>
                  <span className={`${resultItemStyles.viewMoreText}`}>View {FinalResult.length - initialResults} more</span>
               </a>
            }
         </ul>

         <Overlay open={overlayShown}>
            <Overlay.Title onClose={handleClose}>
               {overlayTitle}
            </Overlay.Title>

            <Overlay.Content>
               {overlayContent}
            </Overlay.Content>
         </Overlay>
      </>
   );
}


DefaultResults.propTypes = {
   loadMoreActive: PropTypes.bool,
   setLoadMoreActive: PropTypes.func
};


export default DefaultResults;