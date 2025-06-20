import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import queryString from 'query-string';
import Overlay from '../basicComponents/overlay';
import SearchInput from '../searchInput/SearchInput';
import Footer from '../basicComponents/footer';
import MobileMenu from './MobileMenu';
import Hero from '../basicComponents/hero';

import SBLogoSRC from '../../assets/images/sb-logomain.png';
import SBLogoSmall from "../../assets/images/sb-logo-small.png";

import styles from './styles/sidemenu.module.scss';

let PageHeading = "What are you looking for?";

let HomeIcon = (
    <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="magnifying-glass"
        className="svg-inline--fa fa-magnifying-glass fa-fw fa-1x "
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
    >
        <path
            fill="currentColor"
            d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
        ></path>
    </svg>
);

let LibraryIcon = (
    <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="far"
        data-icon="rectangle-vertical-history"
        className="svg-inline--fa fa-rectangle-vertical-history fa-fw fa-1x "
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
    >
        <path
            fill="currentColor"
            d="M256 48c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H512c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H256zM192 64c0-35.3 28.7-64 64-64H512c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H256c-35.3 0-64-28.7-64-64V64zM96 72c0-13.3 10.7-24 24-24s24 10.7 24 24V440c0 13.3-10.7 24-24 24s-24-10.7-24-24V72zM0 120c0-13.3 10.7-24 24-24s24 10.7 24 24V392c0 13.3-10.7 24-24 24s-24-10.7-24-24V120z"
        ></path>
    </svg>
);

let LibraryIconHighlight = (
    <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="rectangle-vertical-history"
        className="svg-inline--fa fa-rectangle-vertical-history fa-fw fa-1x "
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
    >
        <path
            fill="currentColor"
            d="M256 0c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H256zM96 72V440c0 13.3 10.7 24 24 24s24-10.7 24-24V72c0-13.3-10.7-24-24-24s-24 10.7-24 24zM0 120V392c0 13.3 10.7 24 24 24s24-10.7 24-24V120c0-13.3-10.7-24-24-24S0 106.7 0 120z"
        ></path>
    </svg>
);

let CollapseIconSVG = (
    <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="far"
        data-icon="arrow-left-to-line"
        className="svg-inline--fa fa-arrow-left-to-line fa-fw fa-1x "
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
    >
        <path
            fill="currentColor"
            d="M0 424c0 13.3 10.7 24 24 24s24-10.7 24-24L48 88c0-13.3-10.7-24-24-24S0 74.7 0 88L0 424zM135.6 238.5c-4.8 4.5-7.6 10.9-7.6 17.5s2.7 12.9 7.6 17.5l136 128c9.7 9.1 24.8 8.6 33.9-1s8.6-24.8-1-33.9L212.5 280l83.5 0 128 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-128 0-83.5 0 91.9-86.5c9.7-9.1 10.1-24.3 1-33.9s-24.3-10.1-33.9-1l-136 128z"
        ></path>
    </svg>
);

let CollapseIconSVG2 = (
    <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="far"
        data-icon="arrow-right-from-line"
        className="svg-inline--fa fa-arrow-right-from-line fa-fw fa-lg "
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512">
        <path
            fill="currentColor"
            d="M48 88c0-13.3-10.7-24-24-24S0 74.7 0 88V424c0 13.3 10.7 24 24 24s24-10.7 24-24L48 88zM440.4 273.5c4.8-4.5 7.6-10.9 7.6-17.5s-2.7-12.9-7.6-17.5l-136-128c-9.7-9.1-24.8-8.6-33.9 1s-8.6 24.8 1 33.9L363.5 232H280l-128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l128 0h83.5l-91.9 86.5c-9.7 9.1-10.1 24.3-1 33.9s24.3 10.1 33.9 1l136-128z"
        ></path>
    </svg>
);

let AddIconSVG = (
    <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="far"
        data-icon="plus"
        className="svg-inline--fa fa-plus fa-fw fa-lg "
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
    >
        <path
            fill="currentColor"
            d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24V232H40c-13.3 0-24 10.7-24 24s10.7 24 24 24H200V440c0 13.3 10.7 24 24 24s24-10.7 24-24V280H408c13.3 0 24-10.7 24-24s-10.7-24-24-24H248V72z"
        ></path>
    </svg>
);

const SidebarMenuItems = [
    { name: "Home", img: HomeIcon, img2: HomeIcon, url: "/" },
    { name: "Library", img: LibraryIcon, img2: LibraryIconHighlight, url: "/library" },
];

const Sidemenu = ({ response, setSuggestSearch, query, chatMessage, handleSidemuRoutes, }) => {
    const parameters = Object.assign({}, queryString.parse(window.location.search));
    const [collapse, setCollapse] = useState(false);
    const [modalSettings, setModalSettings] = useState({ shown: false, result: {} });
    const [localData, setLocalData] = useState([]);
    const [isActiveQuery, setActiveQuery] = useState(null);

    // checking which sidemenu tab is clicked
    let activeTab = parameters.query === undefined ? "Home" : isActiveQuery !== null ? "Library" : null


    // --------------------------------

    useEffect(() => {
        document.addEventListener('keydown', keydownHandler);
        return () => {
            document.removeEventListener('keydown', keydownHandler);
        };
    }, []);

    useEffect(() => {
        let localHistory = JSON.parse(localStorage.getItem('history')) || [];
        if (localHistory && localHistory.user === localStorage.getItem('loginUserName')) {
            const mapReverse = localHistory.library.map(value => {
                return value;
            }).reverse();
            setLocalData(mapReverse);
            setActiveQuery(mapReverse.find(data => data.query === parameters.query));
        }
    }, [localStorage.getItem('history'), parameters.query])


    const keydownHandler = (event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'i') {
            setModalSettings({ shown: true })
        }
    };

    const handleSidebarCollapse = () => {
        setCollapse(!collapse);
    };


    const handleMenuActive = (value) => {
        if (value.name === "Home") {
            const locationHref = document.location.href.split("?")[0];

            document.location.href = locationHref;
        }
        else if (value.name === "Library") {
            setModalSettings({ ...modalSettings, shown: true })
        }
    }

    const handleHistory = (value) => {
        let localHistory = JSON.parse(localStorage.getItem("history")) || [];
        let loggedInUser = localStorage.getItem('loginUserName') || null;

        var checkExist = localHistory.library && localHistory.library.filter(data => data.query.toLowerCase() !== value.query.toLowerCase());
        var allHistory = checkExist.length >= 8 ? checkExist.filter((data, i) => i != 0) : checkExist;

        if (allHistory.length <= 8) {
            allHistory.push({ 'query': value.query, 'url': value.url });

            var assignData = { user: loggedInUser, library: allHistory };
            localStorage.setItem('history', JSON.stringify(assignData))
        }
        window.location.href = value.url
    }

    const handleClearLibrary = () => {
        localStorage.removeItem('history');
        setLocalData([]);
        setActiveQuery(null);
    }


    const handleNewThread = () => {
        const searchInput = document.querySelector('#searchInput');
        if (parameters?.query) {
           document.location.href = window.location.pathname;
        } else if (searchInput) {
            searchInput.focus();
        }
    }


    // --------------------------

    // const isActiveQuery = localData && localData.length > 0 && localData.find(data => data.query === parameters.query);

    return (
        <>
            <aside className={`${styles.sidenav} ${collapse && styles.sidebarCollapse}`}>
                <div className={`${styles.sidenavFixed} ${styles.height100} ${collapse && styles.sidebarCollapse}`}>
                    <div className={`${styles.stickyContent} ${styles.height100}`}>
                        <div>
                            <div className={`${styles.logoContainer} ${collapse ? styles.logoContainerSm : styles.logoContainerLg}`}>
                                {collapse ? (
                                    <a
                                        href="https://www.searchblox.com"
                                        title="SearchBlox Home"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <img
                                            width="42px"
                                            className={styles.sbLogoSide}
                                            alt="SearchBlox Home"
                                            src={SBLogoSmall}
                                        />
                                    </a>
                                ) : (
                                    <>
                                        <a
                                            href="https://www.searchblox.com"
                                            title="SearchBlox Home"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                width="150px"
                                                className={styles.sbLogoSide}
                                                alt="SearchBlox Home"
                                                src={SBLogoSRC}
                                            />
                                        </a>
                                        <a href="javascript:void(0)" className={styles.collapseIcon} onClick={handleSidebarCollapse} title='Collapse'>
                                            {CollapseIconSVG}
                                        </a>
                                    </>
                                )}
                            </div>
                            <div className={`${styles.sideSearchContainer} ${collapse ? styles.addIconCenter : ""}`}>
                                <div onClick={() => setModalSettings({ shown: true })}>
                                    {collapse ? (
                                        <a href="javascript:void(0)" onClick={handleNewThread} className={styles.addIconContainer} title={"New Thread"}>
                                            {AddIconSVG}
                                        </a>
                                    ) : (
                                        <a href="javascript:void(0)" title={"New Thread"} onClick={() => handleNewThread()} className={styles.sideSearchBtn}>
                                            <div className={styles.searchText}>New Thread</div>
                                            <div className={styles.shortcut}>
                                                <div className={styles.shortcutIcon}>ctrl</div>
                                                +
                                                <div className={styles.shortcutIcon}>I</div>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className={styles.menuOptions}>
                                {SidebarMenuItems.map((el, i) => (
                                    <a href="javascript:void(0)" title={el.name} key={i} className={`${styles.menuItems} ${collapse ? styles.centerPos : styles.flexStartPos} ${el.name == activeTab ? styles.activeTabs : ""}`} onClick={(e) => handleSidemuRoutes(el.name)}>
                                        {collapse ?
                                            <div
                                                className={`${styles.svgMenus1} ${styles.highlightIcon} `}
                                            >
                                                {el.img}
                                            </div>
                                            :
                                            <>
                                                <div className={`${styles.svgMenus2} ${styles.highlightIcon} `}>
                                                    {el.img}
                                                </div>
                                                <div className={styles.highlightText}>
                                                    {el.name}
                                                </div>
                                                {(el.name === "Library" && localData && localData.length > 0) &&
                                                    <button className={`${styles.removeLibIcon}`} title="Clear Library" onClick={() => handleClearLibrary()}>
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"></path></g></svg>
                                                    </button>
                                                }
                                            </>
                                        } 
                                        <div className={styles.sideBorder} />
                                    </a>
                                ))}
                                <div className={styles.sidemenuLibrary}>
                                    <ul className={styles.colFlexStart}>
                                        {localData ?
                                            localData.map((data, index) => {
                                                return (
                                                   <li className={`${styles.flexCenter} ${isActiveQuery && isActiveQuery.query === data.query && isActiveQuery.url === data.url ? styles.activeQuery : ""}`} key={index} onClick={() => handleHistory(data, false)}>
                                                        <a href='javascript:void(0)' >
                                                            {data.query}
                                                        </a>
                                                        <svg className={styles.searchSvgIcon} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19.023,16.977c-0.513-0.488-1.004-0.997-1.367-1.384c-0.372-0.378-0.596-0.653-0.596-0.653l-2.8-1.337 C15.34,12.37,16,10.763,16,9c0-3.859-3.14-7-7-7S2,5.141,2,9s3.14,7,7,7c1.763,0,3.37-0.66,4.603-1.739l1.337,2.8 c0,0,0.275,0.224,0.653,0.596c0.387,0.363,0.896,0.854,1.384,1.367c0.494,0.506,0.988,1.012,1.358,1.392 c0.362,0.388,0.604,0.646,0.604,0.646l2.121-2.121c0,0-0.258-0.242-0.646-0.604C20.035,17.965,19.529,17.471,19.023,16.977z M9,14 c-2.757,0-5-2.243-5-5s2.243-5,5-5s5,2.243,5,5S11.757,14,9,14z"></path></svg>
                                                    </li>
                                                )
                                            })
                                            : null}
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.showSidebar} title="Expand">
                                {collapse && (
                                    <a href="javascript:void(0)" title="Expand" className={styles.collapseIconShow} onClick={handleSidebarCollapse}>
                                        {CollapseIconSVG2}
                                    </a>
                                )}
                            </div>
                        </div>
                        <div>
                            {!collapse && <Footer />}
                        </div>
                    </div>
                </div>
            </aside>

            <MobileMenu SidebarMenuItems={SidebarMenuItems} activeTab={activeTab} handleMenuActive={handleMenuActive} />

            {/* {modalSettings.shown ? (
                <div className={styles.searchonlyContainer2} >
                    <Overlay open={modalSettings.shown} className={styles.sbModal}>
                        <Overlay.Title onClose={() => setModalSettings({ shown: false })} className={styles.sbModalTitle}></Overlay.Title>
                        <Overlay.Content className={styles.sbModalContent}> */}
            {/* <h2 className={styles.searchHeading}>{PageHeading}</h2> */}
            {/* <div className={styles.inputWrapperOverlay}> */}
            {/* <SearchInput
                                response={response}
                                setSuggestSearch={setSuggestSearch}
                                query={query}
                                setModalSettings={setModalSettings}
                                sidemenumodalSettings={modalSettings}
                                searchname="overlaysearchInput"
                                isHero={true}
                                /> */}
            {/* <Hero isOverlay={true} isOverlaySideMenu={true}/>
                            </div>
                        </Overlay.Content>
                    </Overlay>
                </div>
            ) : null} */}

        </>
    )
}

export default Sidemenu;

Sidemenu.propTypes = {
    handleSidemuRoutes: PropTypes.func,
    setSuggestSearch: PropTypes.func,
    response: PropTypes.object,
    query: PropTypes.string,
};