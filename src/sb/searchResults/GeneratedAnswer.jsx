import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import queryString from 'query-string';

import { formatDuration as FORMAT_DURATION, httpsRegex as HTTP_REGEX, sourcesRegex as SOURCES_REGEX } from '../chat/chatUtilities';
import { chatBotConfiguration } from '../common/Defaults';
import { sendChatMessage, voteChatMessage, sendChatTestMessage } from '../common/SbCore';
import useSearchStore from '../../stores/searchStore';

import SkeletonItem from '../basicComponents/skeletonItem/';
import CitationLinks from '../chat/CitationLinks';
import VotingButtons from '../basicComponents/votingButtons';
import Overlay from '../basicComponents/overlay';

import commonStyles from './../css/common.module.scss';
import styles from './styles/generatedAnswer.module.scss';


// ==========================================================================================


const { name: BOT_NAME, enabled: CHATBOT_ENABLED } = chatBotConfiguration;
const CHATBOT_CONFIG_VALID = CHATBOT_ENABLED;


// ------------------------------------------------------------------------------------------


function GeneratedAnswer() {

   const [generatedAnswer, setGeneratedAnswer] = useState('');
   const [voted, setVoted] = useState(0);
   const [dots, setDots] = useState('');
   const [sharedlink, setsharedlink] = useState(false);
   const [copiedresponse, setcopiedresponse] = useState(false);
   const [modalSettings, setModalSettings] = useState({ shown: false });


   // ------------------------------


   const inputQuery = useSearchStore(state => state.inputQuery);

   const abortController = useRef(null);
   const startTimeRef = useRef(null);



   // ------------------------------


   const chatMessageMutation = useMutation({
      mutationFn: (dataObj) => {
         startTimeRef.current = performance.now();
         const signal = abortController.current.signal;

         if (CHATBOT_CONFIG_VALID) {
            return sendChatMessage(dataObj, signal);
         }

         return sendChatTestMessage(dataObj, signal);
      },

      onSettled: (chatResponseData, chatResponseError) => {
         const requestEndTime = performance.now();
         const requestDuration = requestEndTime - startTimeRef.current;
         const duration = FORMAT_DURATION(requestDuration);

         if (chatResponseError) {
            console.error(chatResponseError);

            if (chatResponseError.code !== 'ERR_CANCELED') {
               setGeneratedAnswer(
                  {
                     message: 'Oops! That went wrong. Please try again or ask something else.',
                     role: 'system',
                     created: Date.now(),
                     id: '',
                     voted: 0
                  },
               );
            }

         } else {

            const { role } = chatResponseData.data.choices[0].message;
            const { id } = chatResponseData.data;
            const created = chatResponseData.data.created * 1000;
            const sources = [];

            let { content: message } = chatResponseData.data.choices[0].message;
            const sourceLinks = message.match(SOURCES_REGEX) || message.match(HTTP_REGEX);

            if (sourceLinks) {
               sourceLinks.forEach(item => {
                  const sourceTagContent = item.replace(/<\/?source>/g, '').trim();

                  message = message.replace(item, '');
                  sources.push(sourceTagContent);
               });
            }

            setGeneratedAnswer({
               message,
               role,
               created,
               duration,
               sources,
               id
            });
         }
      }
   });


   const voteMutation = useMutation({
      mutationFn: (dataObj) => {
         return voteChatMessage(dataObj);
      },
      onSettled: (data, error) => {
         if (error) {
            console.error('Vote action failed:', error);
            return;
         }
      }
   });


   // ------------------------------


   useEffect(() => {
      abortController.current = new AbortController();

      setVoted(0);

      const params = queryString.parse(window.location.search);
      const searchQuery = params.query || '';

      if (!inputQuery || inputQuery !== searchQuery) {
         return;
      }

      generateAIOverview();

      return () => {
         abortController.current.abort();
      };

   }, [inputQuery, queryString.parse(window.location.search).query]);


   useEffect(() => {
      let interval;
      if (chatMessageMutation.isPending) {
         interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
         }, 500);
      }
      return () => clearInterval(interval);
   }, [chatMessageMutation.isPending]);


   // ------------------------------

   function generateAIOverview() {
      const urlParameters = queryString.parse(window.location.search);
      const cnameInUrl = urlParameters.cname || '';
      const botnameInUrl = urlParameters.botname || '';

      chatMessageMutation.mutate({
         ...(CHATBOT_CONFIG_VALID ? { chatbotname: BOT_NAME ? BOT_NAME : botnameInUrl } : { collectionname: cnameInUrl }),
         question: inputQuery,
      });
   }


   function handleVoteAction(action) {
      if (voted !== 0) {
         return;
      }

      const voteValue = action === 'upvote' ? 1 : -1;
      setVoted(voteValue);

      voteMutation.mutate({
         message_id: generatedAnswer.id,
         action
      });
   }

   const ShareURL = async () => {
      try {
         await navigator.clipboard.writeText(location.href);
         setsharedlink(true);
      } catch (err) {
         alert("Failed to copy!");
      }

      setTimeout(() => {
         setsharedlink(false);
      }, 3000);
   };

   const copyResponse = async (response, sources) => {
      const FormatedText = `${response}${sources ? "Citations: " + sources : null
         }`;

      try {
         await navigator.clipboard.writeText(FormatedText);
         setcopiedresponse(true);
      } catch (err) {
         alert("Failed to copy!");
      }

      setTimeout(() => {
         setcopiedresponse(false);
      }, 3000);
   };

   // ------------------------------


   if (!chatMessageMutation.isPending && !generatedAnswer.message?.length) {
      return null;
   }


   return (
      <div className={`${styles.generatedAnswer} ${chatMessageMutation.isPending ? styles.loading : ''}`}>
         <div className={styles.answerHeader}>
            <div className={commonStyles.commonHeading}>
               {chatMessageMutation.isPending ?
                  <svg className={`${commonStyles.searchSpinner} ${commonStyles.aiheadingSVG}`} xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3a9 9 0 1 0 9 9" /></svg>
                  :
                  <svg className={`${commonStyles.aiheadingSVG}`} width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 8H17.8174M21 12H18M21 16H17.8174M6.18257 8H3M8 6.18257V3M8 21L8 17.8174M12 6V3M12 21V18M16 6.18257V3M16 21V17.8174M6 12H3M6.18257 16H3M10.8 18H13.2C14.8802 18 15.7202 18 16.362 17.673C16.9265 17.3854 17.3854 16.9265 17.673 16.362C18 15.7202 18 14.8802 18 13.2V10.8C18 9.11984 18 8.27976 17.673 7.63803C17.3854 7.07354 16.9265 6.6146 16.362 6.32698C15.7202 6 14.8802 6 13.2 6H10.8C9.11984 6 8.27976 6 7.63803 6.32698C7.07354 6.6146 6.6146 7.07354 6.32698 7.63803C6 8.27976 6 9.11984 6 10.8V13.2C6 14.8802 6 15.7202 6.32698 16.362C6.6146 16.9265 7.07354 17.3854 7.63803 17.673C8.27976 18 9.11984 18 10.8 18ZM10 10H14V14H10V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
               }
               <h2>AI Overview</h2>
            </div>
         </div>

         {
            chatMessageMutation.isPending ?
               <>
                  <SkeletonItem width={'100%'} height={'14px'} />
                  <SkeletonItem width={'100%'} height={'14px'} />
                  <SkeletonItem width={'60%'} height={'14px'} />
               </>
               :
               <div className={styles.chatMessage}>
                  <span>{generatedAnswer.message}</span>
                  <CitationLinks sources={generatedAnswer.sources} />
               </div>
         }


         {
            chatMessageMutation.isPending || generatedAnswer.duration?.length > 0 ?
               <div className={styles.chatDuration}>
                  {
                     chatMessageMutation.isPending ?
                        <>
                           {/* <svg className={commonStyles.loadingSpinner} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 .75c.172 0 .333.034.484.102a1.214 1.214 0 0 1 .664.664c.068.15.102.312.102.484s-.034.333-.102.484a1.214 1.214 0 0 1-.265.399 1.324 1.324 0 0 1-.399.273A1.254 1.254 0 0 1 8 3.25c-.172 0-.333-.031-.484-.094a1.324 1.324 0 0 1-.672-.672A1.254 1.254 0 0 1 6.75 2c0-.172.031-.333.094-.484.067-.151.159-.284.273-.399.115-.114.248-.203.399-.265A1.17 1.17 0 0 1 8 .75zM2.633 3.758a1.111 1.111 0 0 1 .68-1.031 1.084 1.084 0 0 1 .882 0c.136.057.253.138.352.242.104.099.185.216.242.351a1.084 1.084 0 0 1 0 .883 1.122 1.122 0 0 1-.594.594 1.169 1.169 0 0 1-.883 0 1.19 1.19 0 0 1-.359-.234 1.19 1.19 0 0 1-.234-.36 1.169 1.169 0 0 1-.086-.445zM2 7a.941.941 0 0 1 .703.297A.941.941 0 0 1 3 8a.97.97 0 0 1-.078.39 1.03 1.03 0 0 1-.531.532A.97.97 0 0 1 2 9a.97.97 0 0 1-.39-.078 1.104 1.104 0 0 1-.32-.211 1.104 1.104 0 0 1-.212-.32A.97.97 0 0 1 1 8a.97.97 0 0 1 .29-.703A.97.97 0 0 1 2 7zm.883 5.242a.887.887 0 0 1 .531-.805.863.863 0 0 1 .68 0c.11.047.203.11.281.188a.887.887 0 0 1 .188.96.887.887 0 0 1-1.148.461.913.913 0 0 1-.462-.46.863.863 0 0 1-.07-.344zM8 13.25c.208 0 .385.073.531.219A.723.723 0 0 1 8.75 14a.723.723 0 0 1-.219.531.723.723 0 0 1-.531.219.723.723 0 0 1-.531-.219A.723.723 0 0 1 7.25 14c0-.208.073-.385.219-.531A.723.723 0 0 1 8 13.25zm3.617-1.008c0-.177.06-.325.18-.445s.268-.18.445-.18.326.06.445.18c.12.12.18.268.18.445s-.06.326-.18.445a.605.605 0 0 1-.445.18.605.605 0 0 1-.445-.18.605.605 0 0 1-.18-.445zM14 7.5a.48.48 0 0 1 .352.148A.48.48 0 0 1 14.5 8a.48.48 0 0 1-.148.352A.48.48 0 0 1 14 8.5a.48.48 0 0 1-.352-.148A.48.48 0 0 1 13.5 8a.48.48 0 0 1 .148-.352A.48.48 0 0 1 14 7.5zm-1.758-5.117c.188 0 .365.036.531.11a1.413 1.413 0 0 1 .735.734c.073.166.11.343.11.53 0 .188-.037.365-.11.532a1.413 1.413 0 0 1-.735.734 1.31 1.31 0 0 1-.53.11c-.188 0-.365-.037-.532-.11a1.415 1.415 0 0 1-.734-.734 1.31 1.31 0 0 1-.11-.531c0-.188.037-.365.11-.531a1.413 1.413 0 0 1 .734-.735c.167-.073.344-.11.531-.11z" /></svg> */}
                           Generating{dots}
                        </>
                        :
                        <>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-stopwatch"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 13a7 7 0 1 0 14 0a7 7 0 0 0 -14 0z" /><path d="M14.5 10.5l-2.5 2.5" /><path d="M17 8l1 -1" /><path d="M14 3h-4" /></svg>
                           Generated in {generatedAnswer.duration}
                        </>
                  }
               </div>
               :
               null
         }

         {
            CHATBOT_CONFIG_VALID &&
            <div className={styles.answerFooter}>
               <div className={styles.shareBtns}>
                  <button
                     className={styles.chatBtns}
                     onClick={() => ShareURL()}
                     title="Copy Link"
                  >
                     {sharedlink ? (
                        <svg
                           stroke="currentColor"
                           fill="currentColor"
                           strokeWidth="0"
                           viewBox="0 0 24 24"
                           height="1em"
                           width="1em"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path d="M10 15.586L6.707 12.293 5.293 13.707 10 18.414 19.707 8.707 18.293 7.293z"></path>
                        </svg>
                     ) : (
                        <svg
                           stroke="currentColor"
                           fill="currentColor"
                           strokeWidth="0"
                           viewBox="0 0 24 24"
                           height="1em"
                           width="1em"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <g>
                              <path fill="none" d="M0 0h24v24H0z"></path>
                              <path d="M13 14h-2a8.999 8.999 0 0 0-7.968 4.81A10.136 10.136 0 0 1 3 18C3 12.477 7.477 8 13 8V2.5L23.5 11 13 19.5V14zm-2-2h4v3.308L20.321 11 15 6.692V10h-2a7.982 7.982 0 0 0-6.057 2.773A10.988 10.988 0 0 1 11 12z"></path>
                           </g>
                        </svg>
                     )}
                     <span>Share</span>
                  </button>
                  <button
                     title="Re-generate answer"
                     className={styles.retryBtn}
                     onClick={generateAIOverview}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-refresh-dot"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>
                     <span>Regenerate</span>
                  </button>
               </div>
               {!chatMessageMutation.isPending &&
                  <div className={styles.chatVote}>
                     <VotingButtons
                        voted={voted}
                        onVote={handleVoteAction}
                        uniqueId={generatedAnswer.id}
                        loading={voteMutation.isPending}
                     />
                     {generatedAnswer.sources && generatedAnswer.sources.length > 0 &&
                        <>
                           <button
                              className={styles.chatBtns}
                              title="View Sources"
                              onClick={() =>
                                 setModalSettings({ ...modalSettings, shown: true })
                              }
                           >
                              <svg
                                 stroke="currentColor"
                                 fill="currentColor"
                                 strokeWidth="0"
                                 version="1.2"
                                 baseProfile="tiny"
                                 viewBox="0 0 24 24"
                                 height="1em"
                                 width="1em"
                                 xmlns="http://www.w3.org/2000/svg"
                              >
                                 <path d="M19 18c.55 0 1 .45 1 1s-.45 1-1 1h-7c-.55 0-1-.45-1-1s.45-1 1-1h7m0-2h-7c-1.654 0-3 1.346-3 3s1.346 3 3 3h7c1.654 0 3-1.346 3-3s-1.346-3-3-3zM19 11c.55 0 1 .45 1 1s-.45 1-1 1h-7c-.55 0-1-.45-1-1s.45-1 1-1h7m0-2h-7c-1.654 0-3 1.346-3 3s1.346 3 3 3h7c1.654 0 3-1.346 3-3s-1.346-3-3-3zM19 4c.55 0 1 .45 1 1s-.45 1-1 1h-7c-.55 0-1-.45-1-1s.45-1 1-1h7m0-2h-7c-1.654 0-3 1.346-3 3s1.346 3 3 3h7c1.654 0 3-1.346 3-3s-1.346-3-3-3zM6 16h-2c-1.104 0-2 .896-2 2v2c0 1.104.896 2 2 2h2c1.104 0 2-.896 2-2v-2c0-1.104-.896-2-2-2zm0 4h-2v-2h2v2zM6 9h-2c-1.104 0-2 .896-2 2v2c0 1.104.896 2 2 2h2c1.104 0 2-.896 2-2v-2c0-1.104-.896-2-2-2zm0 4h-2v-2h2v2zM6 2h-2c-1.104 0-2 .896-2 2v2c0 1.104.896 2 2 2h2c1.104 0 2-.896 2-2v-2c0-1.104-.896-2-2-2zm0 4h-2v-2h2v2z"></path>
                              </svg>
                           </button>
                        </>
                     }
                     <button
                        className={styles.chatBtns}
                        onClick={() => copyResponse(generatedAnswer.message, generatedAnswer.sources ? generatedAnswer.sources : null)}
                        title="Copy Response"
                     >
                        {copiedresponse ? (
                           <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 24 24"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path d="M10 15.586L6.707 12.293 5.293 13.707 10 18.414 19.707 8.707 18.293 7.293z"></path>
                           </svg>
                        ) : (
                           <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 24 24"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"></path>
                           </svg>
                        )}
                     </button>
                  </div>
               }
            </div>
         }
         {modalSettings.shown && (
            <div className={styles.overlaySources}>
               <Overlay open={modalSettings.shown} className={styles.sbModal}>
                  <Overlay.Title onClose={() => setModalSettings({ shown: false })} className={styles.sbModalTitle}>Sources</Overlay.Title>
                  <Overlay.Content className={styles.sbModalContent}>
                     <ul>
                        {generatedAnswer.sources.map((source, i) => {
                           return (
                              <li key={i}>
                                 <span>{i + 1}</span>
                                 <a href={encodeURI(source)}>{encodeURI(source)}</a>
                              </li>
                           );
                        })}
                     </ul>
                  </Overlay.Content>
               </Overlay>
            </div>
         )}
      </div>
   );
}


export default GeneratedAnswer;