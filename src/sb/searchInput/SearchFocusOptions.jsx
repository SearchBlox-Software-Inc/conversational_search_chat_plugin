import React, { useRef, useState, useEffect } from 'react';  
import PropTypes from 'prop-types';
import queryString from 'query-string';

import useClickOutside from './../common/hooks/useClickOutside';    
import useSearchStore from './../../stores/searchStore';

import { focusEnabled } from './../common/Defaults';

import styles from './styles/searchFocus.module.scss';
import commonStyles from '../css/common.module.scss';

function SearchFocusOptions({  resultsearch, isHero, dropdownShown, FocusId }) {
    const parameters = Object.assign({}, queryString.parse(window.location.search));

    const filterRef = useRef(null);
    const [showOptions, setshowOptions] = useState(false);

    const fetchFilterName = useSearchStore(state => state.fetchFilterName);
    const filterName = useSearchStore(state => state.filterName);
    const inputQuery = useSearchStore(state => state.inputQuery);
    const handleFilterOptions = useSearchStore(state => state.handleFilterOptions);
    const showFocusOptions = useSearchStore(state => state.showFocusOptions);
    

    // ==========================================================================================

     const handleClickOutsideDropdown = e => {
        if (filterRef && filterRef.current && !filterRef.current.contains(e.target) && document.querySelector('#filterOptionsection') && !document.querySelector('#filterOptionsection').contains(e.target)) {
            handleFilterOptions("open-focus-options")
        }
     };

     useClickOutside(filterRef, handleClickOutsideDropdown);

     useEffect(() => {
        fetchFilterName(parameters, focusEnabled.focusCollectionOptions);
     }, []);
     

     let focusFilterName = (filterName.colName === "all" || filterName.colName === undefined) ? "Focus" : filterName.displayName;
     let FocusFilterTitle = (filterName.colName === "all" || filterName.colName === undefined) ? "Select a focus for your sources" : filterName.displayName;
    
    return (
        <div id={FocusId} ref={filterRef} className={`${styles.searchFocusOptionsStyle} ${!isHero && styles.searchFocusOptionsStyleResults}`}>
            <div className={`${styles.focusEnterBtns}`} >
                <button className={styles.focusBtn} onClick={() => handleFilterOptions("open-focus-options")} title={FocusFilterTitle}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path></svg>
                    <span>{focusFilterName}</span>
                    <svg className={`${styles.arrowIcon} ${showFocusOptions && styles.arrowIconOpen}`} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
            </div>
            {showFocusOptions  &&
            <div className={`${commonStyles.popover} ${isHero ? styles.dropdownTop : styles.dropdown} ${styles.dropdown} ${styles.colView} ${resultsearch && styles.resultColView}`} id="filterOptionsection">
                <h2>Focus</h2>
                {focusEnabled.enabled ?
                <ul>
                    <li className={`${(filterName.colName === "all" || filterName.colName === undefined) && styles.active}`} >
                        <button onClick={() => handleFilterOptions('all')}>
                            <span className={styles.radioBtn}></span>
                            <span>All</span>
                        </button>
                    </li>
                    {
                        focusEnabled.focusCollectionOptions ? focusEnabled.focusCollectionOptions.map((list, index) => {
                            return (
                                <li key={index} className={`${filterName.colName === list.colName && styles.active}`}>
                                    <button onClick={() => handleFilterOptions(list)}>
                                        <span className={styles.radioBtn}></span>
                                        <span>{list.displayName}</span>
                                    </button>
                                </li>
                            )
                        })
                            :
                            null
                    }
                </ul>
                :
                <p className={styles.configureCollection}>Please configure collection details in facet.js to enable focus filtering</p>
                }
            </div>}
        </div>
    );
}

export default SearchFocusOptions;

SearchFocusOptions.propTypes = {
    filterName: PropTypes.object,
    resultsearch: PropTypes.bool,
};
