# Conversational Search Chat Plugin


## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development and Deployment](#local-development-and-deployment) 
  - [Upload search plugin](#upload-search-plugin)
- [Configuration](#configuration)
  - [Focus Settings](#focus-settings)
- [Code Summary and Overview](#code-summary-and-overview)
  - [Folder Structure](#folder-structure)
  


## Overview
This is a search plugin that supports hybrid search, displays the most recent 8 conversations/queries, and enables easy switching between configured collections using a focus setting to provide relevant results.

## Getting Started

### Prerequisites 
-  Make sure [SearchBlox SearchAI version 11.1](https://www.searchblox.com/downloads) has been downloaded and installed before proceeding further.

-  Ensure [Node.js](https://nodejs.org/) (version 14 or higher) is installed.
-  The project uses [pnpm](https://pnpm.io/installation) as its package manager. Make sure pnpm version 8.0 or higher is installed before proceeding.

### Local Development and Deployment

Clone the repository and navigate to its directory. To run the plugin locally for development:

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```
   This will start the Vite dev server at `https://localhost:9005`.


   The development server supports hot module reloading for rapid development. Any changes to source files will automatically refresh the browser.

3. Build for production:
   ```bash
   pnpm build
   ```
   This will generate optimized files in the `dist` folder

### Upload search plugin:

   Rename the dist folder as desired, compress it to a ZIP file, and upload it through the Search Settings page in the SearchBlox admin console. When making changes, rebuild and upload the new ZIP file with the same name to update the existing plugin.

   
   ![Search Settings Navigation](https://github.com/SearchBlox-Software-Inc/searchblox-screenshots/blob/main/images/search-settings.png)



   The URL of the deployed plugin will be available on successful upload:


   ![Plugin Upload Success](https://github.com/SearchBlox-Software-Inc/searchblox-screenshots/blob/main/images/plugin-uploaded.png)
   

### Working Sample

Once your plugin is successfully uploaded, you can access it using the provided URL. Here's a demonstration of the Conversational Search Chat plugin in action, showcasing all its key features:

  ![Conversational Search Chat Plugin Demo](https://github.com/SearchBlox-Software-Inc/searchblox-screenshots/blob/main/gifs/conversational_search_chat_plugin.gif)

**Features demonstrated in the sample:**

- **Hybrid Search**: Combines keyword and vector search for enhanced relevance
- **AI Overview**: Intelligent summaries of search results
- **Smart Recommendations**: AI-powered content suggestions
- **SearchAI Assist**: Interactive search assistance and query refinement
- **ChatBot Integration**: Conversational search interface
- **LLM-Generated Fields**: Dynamic content generation for enhanced results
- **Focus Setting**: Allows search across different collections using radio buttons
- **Responsive Design**: Optimized for desktop and mobile devices

The plugin automatically adapts to your collection's content and provides a seamless search experience with AI-powered enhancements.

   

## Configuration

Configure the `pluginDomain` setting in `facet.js`. 

```js
    "pluginDomain": "https://localhost:8443"
```

For detailed documentation of all available configuration options, refer to the [configuration documentation](CONFIG_DOCUMENTATION.md).


### Focus Settings
The focus settings allow you to configure different collections and their associated features. Each collection can have its own:

- `displayName` - Collection Display name
- `colName` - Collection name
- `colId` - Collection ID
- `chatBotName` - Chatbot integration (if enabled)
- `smartSuggest` - Smart suggestions (if enabled) 
- `trendingSearch` - Trending searches (if enabled)

Note:
1. For chatbotName, smartSuggest, and trendingSearch to function, ensure that `chatbot`, `smartSuggest`, and `trendingSearch` are enabled and set to `true` in the `facet.js` file.
2. You can create multiple focus collections by adding additional collection objects to the `focusCollectionOptions` array.

Configure focus options in facet.js under `showFocusOptions`:

For example:
```js
   "showFocusOptions": {
      "enabled": true,
      "focusCollectionOptions": [
         {
            "displayName": "---enter display name---",
            "colName": "---enter collection name---",
            "colId": "---enter collection id---",
            "chatBotName": "---enter chatbot name---",
            "smartSuggest": "---enter smartsuggest cname---",
            "trendingSearch": "---enter trending search cname---"
         },  
        {
            "displayName": "---enter display name---",
            "colName": "---enter collection name---",
            "colId": "---enter collection id---",
            "chatBotName": "---enter chatbot name---",
            "smartSuggest": "---enter smartsuggest cname---",
            "trendingSearch": "---enter trending search cname---"
        },  
      ]
   },
```



## Code Summary and Overview 

### Folder Structure
For complete tree structure and quick explanation for each file in the project refer to [the project structure.](ARCHITECTURE.md)


The plugin consists of several key files and components:

- **facet.js** - The main configuration file that controls search behavior and results display. It contains settings for API endpoints, result limits, field mappings, and other search parameters.

- **Defaults.js** - Imports and processes the facet.js configuration, exporting individual configuration properties to be used throughout the application.

- **SbCore.js** - Contains the core search functionality including:
  - API request/response handling
  - Result formatting and processing
  - Analytics tracking
  - Error handling

- **App.jsx** - The root React component that handles:
  - Authentication flow when security is enabled
  - Conditional rendering of Login vs Search UI
  

- **LogIn.jsx** - Authentication component that:
  - Renders the login form when security is enabled
  - Validates username/password credentials
  - Manages authentication errors
  - Redirects to search on successful login

- **SearchUI.jsx** - Main search interface component that:
  - Handles search requests based on URL parameters
  - Renders search UI elements (search input, filters, results etc)
  - Coordinates between child components

#### Important Note
**init.js** - Required initialization file that sets up the global object needed by the voice search functionality (inline-worker package). Must be imported first in main.jsx to prevent runtime errors.