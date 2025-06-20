import queryString from 'query-string';
import { useEffect, useState } from 'react';

import * as defaults from './common/Defaults';

import { checkAutoLogout, logoutUser } from './common/AuthUtils';
import { history } from './common/CustomHistory';
import { getResults, getSBResponse, parseSBResponse } from './common/SbCore';

import usePluginSettingsStore from '../stores/pluginSettingsStore';
import useSearchStore from '../stores/searchStore';

import BackToTop from './basicComponents/backToTop';
import DebugResponseViewer from './basicComponents/debugResponseViewer';
import Hero from './basicComponents/hero';
import SkeletonItem from './basicComponents/skeletonItem/';
import SuggestAutoSearch from './basicComponents/SuggestAutoSearch';
import Chat from './chat/Chat';
import SearchInput from './searchInput/SearchInput';
import AiAssist from './aiAssist';
import Recommendations from './recommendations';
import DefaultResults from './searchResults/DefaultResults';
import GeneratedAnswer from './searchResults/GeneratedAnswer';
import NoResults from './searchResults/NoResults';
import ResultsSkeleton from './searchResults/ResultsSkeleton';
import SmartFAQs from './smartFAQs/SmartFAQs';
import Sidemenu from './sideMenu/Sidemenu';
import MediaResult from './MediaResults/MediaResult';
import skeletonStyles from './basicComponents/skeletonItem/skeletonItem.module.scss';
import commonStyles from './css/common.module.scss';
import resultsStyles from './searchResults/styles/results.module.scss';
import styles from './searchUI.module.scss';
import TopHeader from './basicComponents/topHeader/topheader';


// ==========================================================================================


const { enabled: CHATBOT_ENABLED, name: BOT_NAME } = defaults.chatBotConfiguration;
const CHATBOT_CONFIG_VALID = CHATBOT_ENABLED;


// ------------------------------------------------------------------------------------------


function SearchUI() {

   const [loading, setLoading] = useState(false);
   const [parameters, setParameters] = useState({ ...queryString.parse(window.location.search) });
   const [debugResponse, setDebugResponse] = useState({});
   const [noPublicCol, setNoPublicCol] = useState(false);
   // const [facetsResponse, setFacetsResponse] = useState([]);

   const [loadMoreActive, setLoadMoreActive] = useState(false);
   const [focusName, setFocusName] = useState({});



   //  ------------------------------


   const response = useSearchStore(state => state.response);
   const setResponse = useSearchStore(state => state.setResponse);
   const suggestSearch = useSearchStore(state => state.suggestSearch);
   const setSuggestSearch = useSearchStore(state => state.setSuggestSearch);
   const setInputQuery = useSearchStore(state => state.setInputQuery);

   const recommendationsEnabled = usePluginSettingsStore(state => state.recommendationsEnabled);
   const aiOverviewEnabled = usePluginSettingsStore(state => state.aiOverviewEnabled);
   const chatBotEnabled = usePluginSettingsStore(state => state.chatBotEnabled);
   const assistEnabled = usePluginSettingsStore(state => state.assistEnabled);


   //  ------------------------------


   useEffect(() => {
      checkAutoLogout();

      history.listen(route => {
         if (window.location.search !== '') {
            setParameters(queryString.parse(route.location.search));
         } else {
            document.location.reload();
         }
      });

      if ((parameters.debug || defaults.debug) && Object.keys(debugResponse).length > 0) {
         document.getElementById('sb-root').classList.add('debugMode');
      }
   }, []);


   useEffect(() => {
      if (Object.keys(parameters).length && parameters.query) {
         try {
            setInputQuery(decodeURIComponent(parameters.query));
         } catch (e) {
            // Fallback to raw query if decoding fails
            setInputQuery(parameters.query);
            console.warn('Failed to decode query parameter:', e);
         }

         doSearch(parameters);
         // doSearch({ ...parameters, facetonly: true });
      }

      if ((parameters.debug || defaults.debug) && Object.keys(debugResponse).length > 0) {
         document.getElementById('sb-root').classList.add('debugMode');
      }

      if (parameters.col) {
         if (parameters.col.constructor === String) {
            defaults.focusEnabled.focusCollectionOptions.filter((data) => data.colId == parameters.col).map((data, index) => {
               setFocusName(data);
            })
         }
         else {
            setFocusName({});
         }
      }
      else {
         setFocusName({});
      }
   }, [parameters]);






   //  ------------------------------

   // function for handling sidemenu pages by adding pathname to url
   function handleSidemuRoutes(pagename) {
      // const locationHref = (pagename === "Library" ?"/library":"/");
      if (pagename === "Home") {
         const locationHref = document.location.href.split("?")[0];

         document.location.href = locationHref;
      }
   }


   function doSearch(params) {

      let queryForTitle = `SearchBlox | Hybrid Search Results: ${params.query || ''}`;

      if (!loadMoreActive) {
         setLoading(true);
      }

      if (!params || typeof params !== 'object') {
         console.error('Invalid parameters for search');
         setResponse({ error: true });
         setLoading(false);
         return;
      }


      getSBResponse(params)
         .then(res => {
            // Empty response
            if (!res) {
               throw new Error('Empty response received');
            }

            // Authentication/collection errors
            if (res.message) {
               const responseMessage = res.message.toLowerCase();

               if (responseMessage.includes('index_not_found_exception')) {
                  setResponse({ error: true, message: 'Search index not available. Please try again later.' });
                  return;
               }

               if (responseMessage.includes('no collection found') && responseMessage.indexOf('something') === -1) {
                  logoutUser();
                  return;
               }

               if (responseMessage.includes('no public collection found to search')) {
                  setNoPublicCol(true);
                  setResponse([]);
                  return;
               }
            }

            setNoPublicCol(false);

            // Error response types
            if (res.constructor === Error || !res.data || typeof res.data !== 'object') {
               setResponse({ error: true, message: 'An error occurred while fetching search results. Please try again later.' });
               return;
            }

            const parsedResponse = parseSBResponse(res);
            const hitCount = parseInt(res.data.hits, 10) || 0;

            // Handle zero results
            if (hitCount === 0) {
               const alternateQuery = decodeURIComponent(res.data.query.replace(/&quot;/g, '"'));

               if (alternateQuery.indexOf('"') >= 0) {
                  // Handle quoted search
                  const updatedParameters = { ...parameters, query: alternateQuery.replace(/['"]+/g, ''), default: 'AND' };
                  setParameters(updatedParameters);
                  doSearch(updatedParameters);
                  return;

               } else if (defaults.suggestSearch && res.data.suggest && res.data.suggest !== '' && suggestSearch.actualQuery === '') {
                  // Handle suggested query
                  setSuggestSearch({ actualQuery: res.data.query, suggestedQuery: res.data.suggest });
                  const updatedParameters = { ...parameters, query: res.data.suggest };
                  setParameters(updatedParameters);
                  getResults(updatedParameters);
                  return;
               }
            }

            // Process successful response
            if (params.facetonly) {
               // setFacetsResponse(parsedResponse);
            } else {
               setResponse(parsedResponse);
               setDebugResponse(res.data);

               if (!loadMoreActive) {
                  window.scrollTo(0, 0);
               }
            }

         })
         .catch(error => {
            console.error('Search error: ', error);
            setResponse({ error: true, message: error.message || 'An error occurred while fetching search results. Please try again later.' });
         })
         .finally(() => {
            if (loadMoreActive) {
               setLoadMoreActive(false);
            }

            document.title = `SearchBlox | Hybrid Search Results: ${formatQueryForTitle(queryForTitle)}`;
            setLoading(false);
         });
   }


   //  ------------------------------


   const currentParameters = { ...queryString.parse(window.location.search) };

   const isKeywordSearch = currentParameters['v.weight'] == 0;

   const noResults =
      // No search results found
      !response.resultInfo?.hits || parseInt(response.resultInfo?.hits, 10) === 0 ||
      // User is requesting a page that doesn't exist
      parseInt(parameters.page, 10) > Math.ceil(parseInt(response.resultInfo.hits, 10) / parameters.pagesize);

   const debugEnabled = (parameters.debug || defaults.debug) && debugResponse && Object.keys(debugResponse).length > 0;

   const showAIOverview = (CHATBOT_CONFIG_VALID || currentParameters.cname) && aiOverviewEnabled;
   const showChatBot = (CHATBOT_CONFIG_VALID || currentParameters.cname) && chatBotEnabled;

   const showAssist = defaults.assist.enabled && assistEnabled;

   const decodedQuery = currentParameters.query ? decodeURI(currentParameters.query).replace(/\\/g, "") : "";


   // ------------------------------------------------------------------------------------------


   return (
      <div className={styles.searchMainContainer}>
         <button className={commonStyles.skipToMain} onClick={handleSkipToMain}>Skip to main content</button>
         <div className={styles.sbMainFlex}>
            <Sidemenu
               response={response}
               setSuggestSearch={setSuggestSearch}
               query={currentParameters.query ? currentParameters.query : ""}
               handleSidemuRoutes={handleSidemuRoutes}
            />
            <div className={`${styles.sbMainContent}`}>
               <div className={`${styles.sbMainContentInner} sb-h100`}>

                  <TopHeader />

                  <main {...(currentParameters.query ? { style: { paddingTop: '2.5rem' } } : {})} className={`${styles.sbSearchContent} sb-h100`}>
                     {
                        debugEnabled ?
                           <DebugResponseViewer debugResponse={debugResponse} />
                           :
                           <>
                              {
                                 !currentParameters.query && <Hero />
                              }

                              {currentParameters.query &&
                                 <section className={commonStyles.sbW100}>
                                    <div className={`${styles.ResultsContainer}`}>
                                       <div className={`${commonStyles.contentWrapper} ${styles.ResultsContainerInner}`}>
                                          {parameters.query &&
                                             <div className={styles.searchHead}>
                                                {(focusName.colName === "all" || focusName.colName === undefined) ?
                                                   null :
                                                   <p className={styles.focusLabelName} title="Focus">
                                                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path></svg>
                                                      {focusName.displayName}
                                                   </p>
                                                }
                                                <h1 className={styles.queryHead}>
                                                   {(response.results || response.error) && noResults && !loading ? `` : `Your search results for: ${decodedQuery}`}
                                                </h1>
                                             </div>
                                          }
                                          {
                                             !loading && (
                                                <div className={resultsStyles.resultsAndFacetsContainer}>

                                                   {
                                                      response.results && !noResults && (
                                                         <div className={resultsStyles.resultsContainer}>

                                                            {
                                                               (defaults.suggestSearch && !parameters.XPC && suggestSearch.actualQuery !== "" && response.resultInfo.query === suggestSearch.suggestedQuery) && isKeywordSearch &&
                                                               <SuggestAutoSearch />
                                                            }


                                                            <DefaultResults loadMoreActive={loadMoreActive} setLoadMoreActive={setLoadMoreActive} />

                                                            <div className={`${commonStyles.contentWrapper} ${styles.ImageResultsContainerResponsive}`}>
                                                               <div className={styles.ImageResultsContainerInner}>  
                                                                  {loading ?
                                                                     <SkeletonItem className={skeletonStyles.imageContainerSkeleton
                                                                     } width={'100%'} height={'43px'} />
                                                                     : response.results && !noResults && <MediaResult results={response.results} response={response} />}

                                                                  {
                                                                     defaults.recommendations.enabled && recommendationsEnabled && <Recommendations />
                                                                  }

                                                               </div>
                                                            </div>

                                                            {currentParameters.query && currentParameters.query !== '*' &&
                                                               <div className={styles.generatedContentContainer}>

                                                                  {
                                                                     showAIOverview &&
                                                                     <GeneratedAnswer />
                                                                  }

                                                                  {
                                                                     !loading && (defaults.suggestSmartFAQs.enabled || defaults.smartFAQSettings.enabled) &&
                                                                     <SmartFAQs />
                                                                  }
                                                               </div>
                                                            }
                                                         </div>
                                                      )
                                                   }


                                                   {
                                                      (noPublicCol || response.error || (response.results && noResults)) &&
                                                      <NoResults
                                                         noPublicCol={noPublicCol}
                                                         errorMessage={response.error && response.message}
                                                      />
                                                   }

                                                </div>
                                             )
                                          }


                                          {
                                             loading &&
                                             <ResultsSkeleton key={`skeleton-${4}`} number={4} />
                                          }
                                          {parameters.query && <div className={styles.FixedsearchInputContainer}>
                                             <SearchInput />
                                          </div>}
                                       </div>



                                       <div className={`${commonStyles.contentWrapper} ${styles.ImageResultsContainer}`}>
                                          <div className={styles.ImageResultsContainerInner}>

                                             {
                                                loading ?
                                                   <SkeletonItem className={skeletonStyles.imageContainerSkeleton
                                                   } width={'100%'} height={'43px'} />
                                                   :
                                                   response.results && !noResults &&
                                                   <MediaResult results={response.results} response={response} />
                                             }

                                             {
                                                defaults.recommendations.enabled && recommendationsEnabled &&
                                                <Recommendations />
                                             }

                                          </div>
                                       </div>
                                    </div>
                                 </section>
                              }

                              {
                                 showAssist && <AiAssist />
                              }
                           </>
                     }

                     {
                        showChatBot && <Chat />
                     }
                  </main>
                  <BackToTop />
               </div>
            </div>
         </div>
      </div >
   );
}


export default SearchUI;



// ================================================================================================================================================


function formatQueryForTitle(title) {
   return decodeURIComponent(title)
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/\\/g, '');
}


function handleSkipToMain() {
   document.getElementById("searchInput").focus();
}