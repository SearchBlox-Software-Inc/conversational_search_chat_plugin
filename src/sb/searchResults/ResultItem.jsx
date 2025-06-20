import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';

import usePluginSettingsStore from '../../stores/pluginSettingsStore';
import useRecommendationsStore from '../../stores/recommendationsStore';
import useAssistStore from '../../stores/assistStore';
import * as defaults from '../common/Defaults';
import { getDocumentClickCount, getEmailViewer, getResults } from '../common/SbCore';
import { toggleFilter } from '../facetFilters/utils/facetFilterUtils';
import ContentTypeIcons from './ContentTypeIcons';

import styles from './styles/resultItem.module.scss';
import assistButtonStyles from '../aiAssist/styles/assistButton.module.scss';


// ==============================================================================================


dayjs.extend(utc);
dayjs.extend(LocalizedFormat);


// ----------------------------------------------------------------------------------------------


function ResultItem({ result, highlight, setOverlayResult, setOverlayShown, resultindex }) {

   const [thumbnailError, setThumbnailError] = useState(false);
   const [apiImagePath, setApiImagePath] = useState('');

   const updateRecentResultClicks = useRecommendationsStore(state => state.updateRecentResultClicks);

   const recommendationsEnabled = usePluginSettingsStore(state => state.recommendationsEnabled);
   const assistEnabled = usePluginSettingsStore(state => state.assistEnabled);
   const llmFieldsShown = usePluginSettingsStore(state => state.llmFieldsShown);
   const llmFieldsMode = usePluginSettingsStore(state => state.llmFieldsMode);

   const selectedResults = useAssistStore(state => state.selectedResults);
   const toggleResultForAssist = useAssistStore(state => state.toggleSelectedResult);



   // ------------------------------


   const urlParameters = { ...queryString.parse(window.location.search) };

   const {
      colname,
      contenttype,
      lastmodified,
      title,
      description,
      context,
      url,
      displayURL,
      contentURL,
      thumbnail,
      isStructured
   } = formatResultFields(result);

   // size = size ? formatSize(size) : '';    

   const isDB = ['db', 'csv', 'mongodb', 'product_discovery'].includes(contenttype);
   const isEmail = contenttype == 'email';
   const isPDF = defaults.pdfOverlay && contenttype == 'pdf' && url[0] !== '/' && url[1] !== ':' && url[0] !== '\\' && url.substring(0, 2) !== 'db';
   const isVideo = ['mpeg', 'mp4', 'flv', 'mpg'].includes(contenttype);
   const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(contenttype);
   const assistHidden = ["mp3", "gif", "wav", "ogg", "m4a", "aac", "flac", "wma", "m4b", "m4p", "m4b", "m4p", "aiff", "aif", "aiffc", "aifc", "mid"].includes(contenttype) || isVideo || !defaults.assist.enabled || !assistEnabled;


   // ------------------------------


   useEffect(() => {
      if ((result.contenttype && result.contenttype.toLowerCase() == 'ex_image') && result.uid && result.col) {
         const configuredDomain = defaults.pluginDomain;

         fetch(`${configuredDomain}/ui/v1/view-extracted-image/click/${result.uid}?colId=${result.col}`)
            .then(response => response.json())
            .then(data => {
               if (data && data.imagedata) {
                  setApiImagePath(data.imagedata);
               }
            })
            .catch(error => {
               console.error('Error fetching image path:', error);
               setThumbnailError(true);
            });
      }
   }, [result.contenttype, result.uid, result.col]);


   function handleClick(e, title) {
      if (isEmail) {
         e.preventDefault();
         const emailObj = { url: uid, col: col };

         getEmailViewer(emailObj)
            .then(response => {
               if (!response.data)
                  throw new Error('email viewer error');
               else if (Object.keys(response.data).length) {
                  setOverlayResult({ ...response.data, contenttype: 'email' });
                  setOverlayShown(true);
               }
            });
      } else if (isPDF || isDB || isStructured) {
         e.preventDefault();
         setOverlayResult(result);
         setOverlayShown(true);

         if (isPDF)
            getDocumentClickCount(result);

      } else {
         getDocumentClickCount(result);
      }


      if (recommendationsEnabled) {
         updateRecentResultClicks(title);
      }
   }


   function handleMoreLikeThis(e, uid, col) {
      e.preventDefault();

      const urlParameters = { ...queryString.parse(window.location.search) };

      urlParameters.mlt_id = uid;
      urlParameters.mlt_col = col;
      urlParameters.page = 1;
      urlParameters.XPC = 1;

      if (defaults.defaultCollections.length) {
         urlParameters.col = [...defaults.defaultCollections];
      }

      getResults(urlParameters);
   }


   // ------------------------------


   const isSelectedForAssist = selectedResults?.some(selectedResult => selectedResult.uid === result.uid && selectedResult.url === result.url && selectedResult.title === result.title);
   const assistDisabled = !isSelectedForAssist && selectedResults?.length >= defaults.assist.limit;


   const generatedTitleExists = result['original_title'];
   const generatedDescriptionExists = result['original_description'];
   const generatedTopicsExists = result['original_topics'];

   const anyGeneratedFieldsExists = generatedTitleExists || generatedDescriptionExists || generatedTopicsExists;


   const titleToDisplay = generatedTitleExists ?
      (
         llmFieldsShown ?
            (llmFieldsMode === 'replace' ? title : `${result['original_title']}`)
            :
            result['original_title']
      )
      :
      title;

   const descriptionToDisplay = generatedDescriptionExists ?
      (
         llmFieldsShown ?
            (llmFieldsMode === 'replace' ? description : result['original_description'])
            :
            result['original_description']
      )
      :
      description;

   return (
      <div className={`${styles.result} ${highlight ? '' : styles.noHighlight}`}>
         <div className={styles.resultFields}>

            <span>
               <a
                  href={!(isDB || isEmail || isPDF || isStructured) ? contentURL : ''}
                  className={styles.resultTitle}
                  target="_blank"
                  dangerouslySetInnerHTML={{ __html: titleToDisplay }}
                  onClick={(e) => handleClick(e, titleToDisplay)}
                  rel="noreferrer"
               />
               <p className={styles.resultDescription} dangerouslySetInnerHTML={{ __html: descriptionToDisplay }} />
            </span>
         </div>

         {
            llmFieldsShown && llmFieldsMode === 'both' && anyGeneratedFieldsExists &&
            <div className={styles.llmFields}>
               {
                  generatedTitleExists &&
                  <a href={contentURL} target="_blank" rel="noreferrer" className={styles.resultTitle} dangerouslySetInnerHTML={{ __html: title }} />
               }
            </div>
         }

         <div className={styles.resultDetails}>
            <div className={styles.colnameText}>
               {
                  colname ?
                     <div className={styles.detail}>
                        <ContentTypeIcons type={contenttype || null} />
                        <span className={styles.detailText}>{colname}</span>
                     </div>
                     :
                     null
               }

               <span className={styles.dot} />
               {
                  <span className={styles.resultcount}>{resultindex}</span>
               }
            </div>
            <div>
               {
                  !assistHidden &&
                  <button
                     className={`${assistButtonStyles.assistBtn} ${isSelectedForAssist ? assistButtonStyles.active : (assistDisabled ? assistButtonStyles.disabled : '')}`}
                     onClick={() => toggleResultForAssist(result)}
                     disabled={assistDisabled}
                     title={assistDisabled ? 'Assist disabled' : (isSelectedForAssist ? 'Remove from Assist' : 'Add to Assist')}
                  >
                     {
                        isSelectedForAssist ?
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l5 5l10 -10" /></svg>
                           :
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-cpu"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 5m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" /><path d="M9 9h6v6h-6z" /><path d="M3 10h2" /><path d="M3 14h2" /><path d="M10 3v2" /><path d="M14 3v2" /><path d="M21 10h-2" /><path d="M21 14h-2" /><path d="M14 21v-2" /><path d="M10 21v-2" /></svg>
                     }
                  </button>
               }
            </div>
         </div>
      </div>
   );
}


export default ResultItem;


ResultItem.propTypes = {
   result: PropTypes.object,
   highlight: PropTypes.bool,
   setOverlayResult: PropTypes.func,
   setOverlayShown: PropTypes.func
};


// ------------------------------


function ResultTopics({ topics }) {

   const [showAllTopics, setShowAllTopics] = useState(false);


   return (
      <ul className={styles.resultTopics}>
         {
            topics.split(',').slice(0, showAllTopics ? undefined : 5).map((topic, index) => (
               <li key={index} className={styles.topic}>
                  <button
                     className={styles.topicBtn}
                     onClick={() => toggleFilter('topics', topic.toLowerCase())}
                     aria-label={`Filter by topic: ${topic.trim()}`}
                  >
                     {topic.trim()}
                  </button>
               </li>
            ))
         }

         <li>
            {
               topics.split(',').length > 5 && (
                  <button
                     className={styles.toggleTopicsBtn}
                     onClick={() => setShowAllTopics(!showAllTopics)}
                     aria-label={`Show ${showAllTopics ? 'less' : 'all'} topics`}
                  >
                     Show&nbsp;{showAllTopics ? 'Less' : 'All'}
                  </button>
               )
            }
         </li>
      </ul>
   );
}


// function formatSize(size, decimal) {
//    if (!+size)
//       return '0 Bytes';

//    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//    const k = 1024;

//    const factor = Math.floor(Math.log(size)/Math.log(k));

//    return `${parseFloat(size / Math.pow(k, factor)).toFixed(decimal)} ${sizes[factor]}`;
// }


function formatContentURL({ url, col, uid }) {
   if (url) {
      const configuredDomain = document.getElementById('sb_plugin_domain');
      const pluginDomain = configuredDomain && configuredDomain.value.length ? configuredDomain : defaults.pluginDomain;
      let contentURL = '';

      if ((['/', ':', '\\'].includes(url[0])) || ([':'].includes(url[1]))) {
         contentURL = `${pluginDomain}/ui/v1/file/download?url=${encodeURIComponent(url)}&col=${col}`;
      } else if (url.startsWith('db')) {
         contentURL = `${pluginDomain}/ui/v1/db-viewer/get/?col=${col}&uid=${uid}`;
      } else {
         contentURL = url;
      }

      contentURL = contentURL.replace(/&amp;/g, '&');

      return contentURL;
   }
}


function formatTitle({ title, contenttype, uid }) {
   let formattedTitle = '';

   if (title && title.length) {
      formattedTitle = decodeURIComponent(title.replace(/%([^\d].)/g, '%25$1')
         .replace(/&#0;/g, '')
         .replace(/&amp;/g, '&'));
   } else if (contenttype == 'db' || contenttype == 'mongodb') {
      formattedTitle = uid;
   } else {
      formattedTitle = 'Untitled';
   }

   return formattedTitle;
}


function formatContext(context) {
   return context ? context.replace(/(&amp;amp;)|(amp;)|(&amp;nbsp;)|(&amp;)/g, "&").replace(/&amp;amp;amp;/g, "&").replace(/&quot;/g, "\"").replace(/&nbsp;/g, "") : '';
}


function formatResultFields(result) {
   let {
      colname,
      contenttype,
      lastmodified,
      title,
      description,
      context,
      url,
      displayURL,
      contentURL,
      thumbnail,
      isStructured
   } = { ...result };

   title = formatTitle(result);

   description = description ? description : formatContext(context);

   description = description.replace(
      /\b(?:skip to main content|skip to content|skip to navigation|skip to main navigation)\b/gi,
      ''
   );

   if (defaults.descriptionCharLimit.enabled && description.length > defaults.descriptionCharLimit.limit) {
      description =
         description
            .substring(0, defaults.descriptionCharLimit.limit)
            .split(' ')
            .slice(0, -1)
            .join(' ') + '...';
   }

   contentURL = formatContentURL(result);

   displayURL = new DOMParser().parseFromString(url, 'text/html').body.textContent;

   lastmodified = lastmodified
      ? dayjs(new Date(lastmodified)).utc().format('MMM DD, YYYY')
      : '';

   contenttype = contenttype && contenttype.length ? contenttype.toLowerCase() : '';
   thumbnail = result['og:image'] ? result['og:image'] : '';

   return {
      colname,
      contenttype,
      lastmodified,
      title,
      description,
      context,
      url,
      displayURL,
      contentURL,
      thumbnail,
      isStructured
   };
}