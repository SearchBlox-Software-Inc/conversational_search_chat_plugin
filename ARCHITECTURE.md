## Public Directory
```
📁 public/
├── 📄 facet.js                 # Main configuration file for search features and settings
├── 📄 favicon.ico              # Website favicon in ICO format
└── 📄 favicon.png              # Website favicon in PNG format
```

## Source Directory (src/)
```
📁 src/
├── 📄 App.jsx                   # Main React application component with authentication logic
├── 📄 app.module.scss           # Styles for the main App component
├── 📄 index.scss               # Global SCSS styles and imports
├── 📄 init.js                  # Global object initialization for inline-worker package
└── 📄 main.jsx                 # React application entry point
```

### Assets Directory
```
📁 src/assets/
├── 📁 fonts/
│   └── 📁 Inter/
│       └── 📄 Inter-Regular.ttf  # Inter font family for typography
└── 📁 images/
    ├── 📄 sb-logo-small.png     # Small SearchBlox logo
    └── 📄 sb-logomain.png       # Main SearchBlox logo
```

### SB Components Directory
```
📁 src/sb/
├── 📁 aiAssist/                 # AI Assistant functionality
│   ├── 📄 AssistCart.jsx        # Shopping cart component for AI assist
│   ├── 📄 index.jsx             # Main AI assist component
│   └── 📁 styles/
│       ├── 📄 aiAssist.module.scss      # AI assist component styles
│       ├── 📄 assistButton.module.scss  # Assist button styles
│       ├── 📄 assistCart.module.scss    # Assist cart styles
│       └── 📁 partials/
│           ├── 📄 _body.scss            # Body partial styles
│           ├── 📄 _footer.scss          # Footer partial styles
│           ├── 📄 _header.scss          # Header partial styles
│           └── 📄 _loader.scss          # Loader partial styles
│
├── 📁 autoSuggest/              # Auto-suggestion functionality
│   ├── 📄 AutoSuggestComponent.jsx      # Main auto-suggest component
│   └── 📄 TrendingComponent.jsx         # Trending suggestions component
│
├── 📁 basicComponents/          # Reusable UI components
│   ├── 📁 backToTop/
│   │   ├── 📄 backToTop.module.scss     # Back to top button styles
│   │   └── 📄 index.jsx                 # Back to top component
│   ├── 📁 debugResponseViewer/
│   │   ├── 📄 debugResponseViewer.module.scss  # Debug viewer styles
│   │   └── 📄 index.jsx                        # Debug response viewer component
│   ├── 📁 footer/
│   │   ├── 📄 footer.module.scss        # Footer component styles
│   │   └── 📄 index.jsx                 # Footer component
│   ├── 📁 header/
│   │   ├── 📄 header.module.scss        # Header component styles
│   │   └── 📄 index.jsx                 # Header component
│   ├── 📁 Hero/
│   │   ├── 📄 hero.module.scss          # Hero section styles
│   │   └── 📄 index.jsx                 # Hero component
│   ├── 📁 llmFieldsToggle/
│   │   ├── 📄 index.jsx                 # LLM fields toggle component
│   │   └── 📄 llmFieldsToggle.module.scss  # LLM toggle styles
│   ├── 📁 overlay/
│   │   ├── 📄 DBOverlay.jsx             # DB overlay component which shows the data specified in dataToBeDisplayed in facet.js.
│   │   ├── 📄 EmailOverlay.jsx          # To show email related content results.
│   │   ├── 📄 index.jsx                 # Main overlay component
│   │   ├── 📄 MediaOverlay.jsx          # To display Images in overlay
│   │   ├── 📄 PDFViewer.jsx             # To show pdf content type results in an overlay.
│   │   └── 📁 styles/
│   │       ├── 📄 mediaOverlay.module.scss    # Media overlay styles
│   │       ├── 📄 overlay.module.scss         # Overlay styles
│   │       └── 📄 overlayTable.module.scss    # Overlay table styles
│   ├── 📁 pluginSettings/
│   │   ├── 📄 index.jsx                 # Plugin settings component
│   │   └── 📄 pluginSettings.module.scss  # Plugin settings styles
│   ├── 📁 skeletonItem/
│   │   ├── 📄 index.jsx                 # Skeleton loading component
│   │   └── 📄 skeletonItem.module.scss  # Skeleton styles
│   ├── 📄 SuggestAutoSearch.jsx         # Auto-search suggestion component
│   ├── 📁 topHeader/
│   │   ├── 📁 styles/
│   │   │   └── 📄 topheader.module.scss # Top header styles
│   │   └── 📄 topheader.jsx             # Top header component
│   └── 📁 votingButtons/
│       ├── 📄 index.jsx                 # Voting buttons component
│       └── 📄 votingButtons.module.scss # Voting buttons styles
│
├── 📁 chat/                     # Chat functionality
│   ├── 📄 Chat.jsx              # Main chat component
│   ├── 📄 ChatAction.jsx        # Chat action buttons component
│   ├── 📄 ChatHeader.jsx        # Chat header component
│   ├── 📁 chatInput/
│   │   ├── 📄 ChatInput.jsx     # Chat input component
│   │   ├── 📄 ChatVoiceInput.jsx # Voice input for chat
│   │   └── 📄 PromptSuggestions.jsx # Chat prompt suggestions
│   ├── 📄 ChatLine.jsx          # Individual chat line component
│   ├── 📄 chatUtilities.js      # Chat utility functions
│   ├── 📄 CitationLinks.jsx     # Citation links component
│   └── 📁 styles/
│       ├── 📄 chat.module.scss          # Chat component styles
│       ├── 📄 chatAction.module.scss    # Chat action styles
│       ├── 📄 chatHeader.module.scss    # Chat header styles
│       ├── 📄 chatInput.module.scss     # Chat input styles
│       ├── 📄 chatPrompts.module.scss   # Chat prompts styles
│       ├── 📄 citationLinks.module.scss # Citation links styles
│       └── 📁 partials/
│           ├── 📄 _loading.scss         # Loading partial styles
│           ├── 📄 _message-details.scss # Message details styles
│           ├── 📄 _messages.scss        # Messages styles
│           └── 📄 _toggle.scss          # Toggle styles
│
├── 📁 common/                   # Common utilities and helpers
│   ├── 📄 AuthUtils.js          # Authentication utility functions
│   ├── 📄 CustomHistory.js      # Custom history management
│   ├── 📄 Defaults.js           # Default configuration values
│   ├── 📁 hooks/
│   │   ├── 📄 useClickOutside.jsx  # Click outside hook
│   │   ├── 📄 useDebounce.jsx      # Debounce hook
│   │   └── 📄 useThrottle.jsx      # Throttle hook
│   ├── 📄 SbCore.js             # Core SearchBlox functionality
│   └── 📄 suggestionsUtils.js   # Suggestions utility functions
│
├── 📁 css/                      # Global CSS styles
│   ├── 📄 common.module.scss    # Common styles
│   ├── 📄 compare-drawer.scss   # Compare drawer styles
│   └── 📄 variables.scss        # SCSS variables
│
├── 📁 facetFilters/             # Facet filtering functionality
│   ├── 📄 CustomDateFilter.jsx  # Custom date filter component
│   ├── 📄 FacetFilters.jsx      # Main facet filters component
│   ├── 📄 FacetFiltersToggle.jsx # Facet filters toggle
│   ├── 📄 FilterSearchInput.jsx # Filter search input component
│   ├── 📄 SelectedFilters.jsx   # Selected filters display
│   ├── 📁 styles/
│   │   ├── 📄 facetFilters.module.scss  # Facet filters styles
│   │   ├── 📄 facetsToggle.module.scss  # Facets toggle styles
│   │   ├── 📄 filterSearch.module.scss  # Filter search styles
│   │   └── 📄 selectedFilters.module.scss # Selected filters styles
│   └── 📁 utils/
│       └── 📄 facetFilterUtils.js # Facet filter utility functions
│
├── 📁 featuredResults/          # Featured results functionality
│   ├── 📄 FeaturedResults.jsx   # Has featured results displaying title, description, url.
│   └── 📄 featuredResults.module.scss # Featured results styles
│
├── 📁 login/                    # Login functionality
│   ├── 📄 index.jsx             # Login component
│   └── 📄 login.module.scss     # Login styles
│
├── 📁 MediaResults/             # Media results display
│   ├── 📄 MediaResult.jsx       # Media result component
│   └── 📁 styles/
│       └── 📄 MediaResults.module.scss # Media results styles
│
├── 📁 pagination/               # Pagination functionality
│   ├── 📄 LoadMoreButton.jsx    # Load more button component
│   ├── 📄 pagination.module.scss # Pagination styles
│   └── 📄 PaginationWithNumbers.jsx # Pagination with numbers
│
├── 📁 recommendations/          # Recommendations functionality
│   ├── 📄 index.jsx             # Main recommendations component
│   ├── 📄 RecommendationNotification.jsx # Recommendation notification
│   └── 📁 styles/
│       ├── 📄 recommendationNotification.module.scss # Notification styles
│       └── 📄 recommendations.module.scss # Recommendations styles
│
├── 📁 relatedQueries/           # Related queries functionality
│   ├── 📄 RelatedQueries.jsx    # Related queries component
│   └── 📄 relatedQueries.module.scss # Related queries styles
│
├── 📁 searchInput/              # Search input functionality
│   ├── 📁 hooks/
│   │   ├── 📄 GoogleCloudRecognitionConfig.js # Google Cloud recognition config
│   │   ├── 📄 index.js          # Voice search hooks index
│   │   ├── 📄 recorder.js       # Voice recorder functionality
│   │   └── 📄 recorderHelpers.js # Recorder helper functions
│   ├── 📄 SearchFocusOptions.jsx # Focus options select component for switching between configured collections
│   ├── 📄 SearchInput.jsx       # Main search input component
│   ├── 📄 SearchInputSuggestions.jsx # Search input suggestions
│   ├── 📄 SearchSettings.jsx    # Search settings component
│   ├── 📁 styles/
│   │   ├── 📄 inputDropdown.module.scss # Input dropdown styles
│   │   ├── 📄 searchFocus.module.scss   # Search focus styles
│   │   ├── 📄 searchInput.module.scss   # Search input styles
│   │   └── 📄 searchSettings.module.scss # Search settings styles
│   └── 📄 VoiceSearchInput.jsx  # Renders an mic in UI, on-click of which calls speech startSpeechToText of hooks component is is used and converted into text and after conversion stopSpeechToText of hooks is used to stop recording of voice.
│
├── 📁 searchResults/            # Search results display
│   ├── 📄 ContentTypeIcons.jsx  # Content type icons component
│   ├── 📄 DefaultResults.jsx    # Default results component
│   ├── 📄 GeneratedAnswer.jsx   # Generated answer component
│   ├── 📄 NoResults.jsx         # No results component
│   ├── 📄 ResultItem.jsx        # Individual result item component
│   ├── 📄 ResultsSkeleton.jsx   # Results skeleton loading
│   ├── 📄 ResultsSummary.jsx    # Results summary component
│   └── 📁 styles/
│       ├── 📄 generatedAnswer.module.scss # Generated answer styles
│       ├── 📄 noResults.module.scss      # No results styles
│       ├── 📄 resultItem.module.scss     # Result item styles
│       ├── 📄 resultListHeader.module.scss # Result list header styles
│       ├── 📄 results.module.scss        # Results styles
│       └── 📄 resultsSkeleton.module.scss # Results skeleton styles
│
├── 📄 SearchUI.jsx              # Main search UI component that handles search requests, renders search interface elements (search input, Recommendations,chatbot, results,assist), and coordinates child components
├── 📄 searchUI.module.scss      # Search UI styles
│
├── 📁 sideMenu/                 # Side menu functionality with home and library features
│   ├── 📄 MobileMenu.jsx        # Mobile menu component
│   ├── 📄 Sidemenu.jsx          # Main side menu component
│   └── 📁 styles/
│       └── 📄 sidemenu.module.scss # Side menu styles
│
├── 📁 smartFAQs/                # Smart FAQs functionality
│   ├── 📄 FAQItem.jsx           # Common component for each togglable FAQ, it includes the question, its answer, the URL to the page with more details and buttons for voting
│   ├── 📄 SmartFAQs.jsx         # Main Smart FAQs component
│   ├── 📁 styles/
│   │   ├── 📄 faqItem.module.scss # FAQ item styles
│   │   └── 📄 smartFAQs.module.scss # Smart FAQs styles
│   └── 📄 SuggestedSmartFAQs.jsx # Suggested Smart FAQs component
│
├── 📁 sort/                     # Sorting functionality
│   ├── 📄 sort.module.scss      # Sort styles
│   ├── 📄 SortMenu.jsx          # Sort menu component
│   └── 📄 SortOptions.jsx       # Sort options component
│
└── 📁 topQueries/               # Top queries functionality
    ├── 📄 index.jsx             # Main top queries component
    ├── 📄 topQueries.module.scss # Top queries styles
    └── 📄 TopQuerySuggestions.jsx # Top query suggestions component
```

### Stores Directory
```
📁 src/stores/
├── 📄 assistStore.js            # AI assist state management
├── 📄 autoSuggestStore.js       # Auto-suggest state management
├── 📄 chatStore.js              # Chat state management
├── 📄 pluginSettingsStore.js    # Plugin settings state management
├── 📄 recommendationsStore.js   # Recommendations state management
├── 📄 searchStore.js            # Search state management
├── 📄 securityStore.js          # Security state management
├── 📄 smartFAQsStore.js         # Smart FAQs state management
├── 📄 storeHistory.js           # Store for managing last 8 conversations/queries history displayed in Library
└── 📄 topQueriesStore.js        # Top queries state management
```