import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { handleHistory } from '../../stores/StoreHistory';

import Overlay from "../basicComponents/overlay";

import styles from './styles/sidemenu.module.scss';

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

const MenuItems = [
    { name: "Home", img: HomeIcon, url: "/" },
    { name: "Library", img: LibraryIcon, url: "/library" },
];



const MobileMenu = () => {
    const parameters = Object.assign({}, queryString.parse(window.location.search));
    const [modalSettings, setModalSettings] = useState({ shown: false, result: {} });
    const [localData, setLocalData] = useState([]);
    const [isActiveQuery, setActiveQuery] = useState(null);

    let activeMenu = parameters.query === undefined ? "Home" : isActiveQuery !== null ? "Library" : null;

    // ------------------

    const handleMenuActive = (value) => {
        if (value.name === "Home") {
            const locationHref = document.location.href.split("?")[0];

            document.location.href = locationHref;
        }
        else if (value.name === "Library") {
            setModalSettings({ ...modalSettings, shown: true })
        }
    }

    

    const handleClose = () => {
        setModalSettings({ ...modalSettings, shown: !modalSettings.shown });
    };

    const handleClearLibrary = () => {
        localStorage.removeItem('history');
        setLocalData([]);
        handleClose();
    }

    useEffect(() => {
        let localHistory = JSON.parse(localStorage.getItem('history')) || [];
        if (localHistory && (localHistory.user === localStorage.getItem('loginUserName'))) {
            const mapReverse = localHistory.library.map(value => {
                return value;
            }).reverse();
            setLocalData(mapReverse);
            setActiveQuery(mapReverse.find(data => data.query === parameters.query));
        }
    }, [localStorage.getItem('history')])

    // ----------------------

    return (
        <>
            <div className={`${styles.fixedMenuMob}`}>
                <ul>
                    {MenuItems && MenuItems.map((data, index) => {
                        return (
                            <li key={index} className={`${data.name == activeMenu ? styles.active : ""}`} onClick={() => handleMenuActive(data)}>
                                <a href="javascript:void(0)">
                                    {data.img}
                                    <span>{data.name}</span>
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
            {modalSettings.shown &&
                <div className={styles.overlayLibrary}>
                    <Overlay
                       open={modalSettings.shown} className={styles.sbModal}
                    >
                        <Overlay.Title onClose={handleClose}>
                            <div className={styles.flexRow}>
                                Library
                                {localData && localData.length > 0 &&
                                    <button className={styles.remove_lib_icon} title="Clear Library" onClick={() => handleClearLibrary()}>
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"></path></g></svg>
                                    </button>
                                }
                            </div>
                        </Overlay.Title>

                        <Overlay.Content>
                            <ul>
                                {localData && localData.length > 0 ?
                                 localData.map((data, index) => {
                                    return (
                                        <li className={`${styles.flexCenter} ${isActiveQuery && isActiveQuery.query === data.query ? styles.activeQuery : ""}`} key={index} onClick={() => handleHistory(data, true)}>
                                            <a href='javascript:void(0)'>
                                                <span className={styles.countSpan}>{index + 1}</span>
                                                <span className={styles.libraryA} >
                                                    {data.query}
                                                </span>
                                                <svg className={styles.searchSvg} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19.023,16.977c-0.513-0.488-1.004-0.997-1.367-1.384c-0.372-0.378-0.596-0.653-0.596-0.653l-2.8-1.337 C15.34,12.37,16,10.763,16,9c0-3.859-3.14-7-7-7S2,5.141,2,9s3.14,7,7,7c1.763,0,3.37-0.66,4.603-1.739l1.337,2.8 c0,0,0.275,0.224,0.653,0.596c0.387,0.363,0.896,0.854,1.384,1.367c0.494,0.506,0.988,1.012,1.358,1.392 c0.362,0.388,0.604,0.646,0.604,0.646l2.121-2.121c0,0-0.258-0.242-0.646-0.604C20.035,17.965,19.529,17.471,19.023,16.977z M9,14 c-2.757,0-5-2.243-5-5s2.243-5,5-5s5,2.243,5,5S11.757,14,9,14z"></path></svg>
                                            </a>
                                        </li>
                                    )
                                })
                                :
                                <p className={styles.textCenter}>No history found</p>
                            }
                            </ul>
                        </Overlay.Content>
                    </Overlay>
                </div>
            }
        </>
    )
}

export default MobileMenu;