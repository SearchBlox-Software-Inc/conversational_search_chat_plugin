import { create } from 'zustand';

import useRecommendationsStore from './recommendationsStore';
import { handleHistory } from './StoreHistory';
import * as parser from '../sb/common/SbCore';
import { defaultType, defaultCollections, pageSize } from '../sb/common/Defaults';


// ==========================================================================================


const useSearchStore = create((set, get) => ({

   inputQuery: '',
   dropdownVisible: false,
   response: {},
   suggestSearch: { actualQuery: '', suggestedQuery: '' },
   voiceSearchEnabled: false,
   filterName: {},
   showFocusOptions: false,



   // --------------------------------------------


   setInputQuery: (query) => set({
      inputQuery: query
         .replace(/&quot;/g, '"')
         .replace(/&amp;/g, '&')
         .replace(/\\/g, '')
   }),
   setDropdownVisibility: (visible) => set({ dropdownVisible: visible }),
   setResponse: (response) => set({ response: response }),
   setSuggestSearch: (suggest) => set({ suggestSearch: suggest }),
   setVoiceSearchEnabled: (enabled) => set({ voiceSearchEnabled: enabled }),

   // --------------------------------------------


   triggerSearch: (query, searchType = defaultType) => {
      const { response, filterName } = get();

      const clearRecommendations = useRecommendationsStore.getState().clearRecommendations;

      set({
         suggestSearch: { actualQuery: '', suggestedQuery: '' },
         inputQuery: query,
         dropdownVisible: false,
      });

      clearRecommendations();

      let initialParams = parser.getInitialUrlParameters(query);
      initialParams.page = 1;
      const currentFacetKey = `col`;
      const chatbotname = 'botname';
      const cname = 'cname';

      if (initialParams.default !== searchType) {
         initialParams.default = searchType;
      }

      delete initialParams.mlt_id;
      delete initialParams.mlt_col;
      delete initialParams.XPC;

      if (defaultCollections.length) {
         initialParams.col = [...defaultCollections];
         delete initialParams[chatbotname];
      }

      if (response?.resultInfo?.hits <= 0) {
         initialParams = parser.clearAllFilters(initialParams);
      }

      if (initialParams.pagesize) {
         initialParams.pagesize = pageSize;
      }

      if (filterName.colId === undefined || filterName.colId === "all") {
         initialParams[currentFacetKey] = defaultCollections;
         delete initialParams[chatbotname];
         delete initialParams[cname];
      }
      else {
         initialParams[currentFacetKey] = filterName.colId;
         initialParams[chatbotname] = filterName.chatBotName;
         initialParams[cname] = filterName.colName;
      }

      parser.getResults(initialParams);

      handleHistory({ 'query': query === '' ? "*" : query, 'url': window.location.href }, false);
   },

   fetchFilterName: (parameters, focusCollectionOptions) => {

      if (parameters.col) {
         if (parameters.col.constructor === String) {
            focusCollectionOptions.filter((data) => data.colId == parameters.col).map((data, index) => {
               set({ filterName: data });
            })
         }
         else {
            set({ filterName: {} });
         }
      }
   },

   setShowFocusOptions: (showFocusOptions) => set({ showFocusOptions: showFocusOptions }),

   handleFilterOptions: (value) => {
      if (value === "open-focus-options") {
         set({ showFocusOptions: !get().showFocusOptions })
      }
      else {
         if (value === 'all') {
            set({ filterName: {
               "displayName": "all",
               "colName": "all",
               "colId": "all",
               "chatBotName": "",
               "smartSuggest": "",
               "trendingSearch": ""
            }});
         } else {
            set({ filterName: value });
         }
         set({ showFocusOptions: false })
      }
   }

}));


export default useSearchStore;