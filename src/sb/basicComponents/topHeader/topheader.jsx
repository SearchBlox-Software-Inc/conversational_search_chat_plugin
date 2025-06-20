import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import queryString from "query-string";

import SBLogoSRC from '../../../assets/images/sb-logomain.png';
import SBLogoSmall from "../../../assets/images/sb-logo-small.png";

import { logoutUser } from '../../common/AuthUtils';
import useSecurityStore from './../../../stores/securityStore';


import styles from './styles/topheader.module.scss';
import commonStyles from '../../css/common.module.scss';


const TopHeader = () => {
    const currentParameters = { ...queryString.parse(window.location.search) };

    const securityResponse = useSecurityStore(state => state.securityResponse);

    const [userMenuShown, showUserMenu] = useState(false);
    const [copiedURL, setCopiedURL] = useState(false);

    const userDropdownRef = useRef(null);

    // -----------------

    useEffect(() => {

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keyup', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keyup', handleClickOutside);
        };

    }, []);


    function handleClickOutside(e) {
        if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
            showUserMenu(currentVal => {
                if (currentVal)
                    return false;
            });
        }
    }

    const copyUrl = async () => {
        await navigator.clipboard.writeText(location.href);
        setCopiedURL(true);
        setTimeout(() => {
            setCopiedURL(false)
        }, 3000);
    }

    const handleRedirectHome = () => {
        const locationHref = document.location.href.split("?")[0];

        document.location.href = locationHref;
    }


    return (
        <header className={styles.sbHeadertop}>
            <div className={styles.container}>
                <div className={styles.userSection}>
                    {securityResponse !== undefined && securityResponse.type !== 'none' ?
                        <>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M12,8c-1.178,0-2,0.822-2,2s0.822,2,2,2s2-0.822,2-2S13.178,8,12,8z"></path><path fill="none" d="M12,4c-4.337,0-8,3.663-8,8c0,2.176,0.923,4.182,2.39,5.641c0.757-1.8,2.538-3.068,4.61-3.068h2 c2.072,0,3.854,1.269,4.61,3.068C19.077,16.182,20,14.176,20,12C20,7.663,16.337,4,12,4z M12,14c-2.28,0-4-1.72-4-4s1.72-4,4-4 s4,1.72,4,4S14.28,14,12,14z"></path><path fill="none" d="M13,16.572h-2c-1.432,0-2.629,1.01-2.926,2.354C9.242,19.604,10.584,20,12,20s2.758-0.396,3.926-1.073 C15.629,17.582,14.432,16.572,13,16.572z"></path><path d="M12,2C6.579,2,2,6.579,2,12c0,3.189,1.592,6.078,4,7.924V20h0.102C7.77,21.245,9.813,22,12,22s4.23-0.755,5.898-2H18 v-0.076c2.408-1.846,4-4.734,4-7.924C22,6.579,17.421,2,12,2z M8.074,18.927c0.297-1.345,1.494-2.354,2.926-2.354h2 c1.432,0,2.629,1.01,2.926,2.354C14.758,19.604,13.416,20,12,20S9.242,19.604,8.074,18.927z M17.61,17.641 c-0.757-1.8-2.538-3.068-4.61-3.068h-2c-2.072,0-3.854,1.269-4.61,3.068C4.923,16.182,4,14.176,4,12c0-4.337,3.663-8,8-8 s8,3.663,8,8C20,14.176,19.077,16.182,17.61,17.641z"></path><path d="M12,6c-2.28,0-4,1.72-4,4s1.72,4,4,4s4-1.72,4-4S14.28,6,12,6z M12,12c-1.178,0-2-0.822-2-2s0.822-2,2-2s2,0.822,2,2 S13.178,12,12,12z"></path></svg>
                            <p className={styles.username}>{localStorage.getItem('loginUserName')}</p>
                        </>
                        : null} 
                </div>
                {currentParameters.query ?
                    <>
                        <div className={styles.logoSection}>
                            <a href="https://www.searchblox.com" title="SearchBlox Home" target="_blank" rel="noreferrer">
                                <img className={styles.onlyLogo} src={SBLogoSmall} alt="SearchBlox Logo" />
                            </a>
                            <button className={styles.newBtn} onClick={() => handleRedirectHome()}>
                                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="plus" className="svg-inline--fa fa-plus fa-fw fa-1x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24V232H40c-13.3 0-24 10.7-24 24s10.7 24 24 24H200V440c0 13.3 10.7 24 24 24s24-10.7 24-24V280H408c13.3 0 24-10.7 24-24s-10.7-24-24-24H248V72z"></path></svg>
                                New
                            </button>
                        </div>

                    </>
                    :
                    <a className={styles.logoSection} href="https://www.searchblox.com" title="SearchBlox Home" target="_blank" rel="noreferrer">
                        <img src={SBLogoSRC} alt="SearchBlox Logo"/>
                    </a>
                }
                    <div className={styles.userLinkSection}>
                    <button className={styles.linkBtn} onClick={() => copyUrl()} title='Copy Link'>
                        {copiedURL ?
                            <svg className={styles.checkSvg} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#fff" strokeWidth="3" points="2 14 9 20 22 4"></polyline></svg>
                            :
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M6.879 9.934c-0.208 0-0.416-0.079-0.575-0.238-1.486-1.486-1.486-3.905 0-5.392l3-3c0.72-0.72 1.678-1.117 2.696-1.117s1.976 0.397 2.696 1.117c1.486 1.487 1.486 3.905 0 5.392l-1.371 1.371c-0.317 0.317-0.832 0.317-1.149 0s-0.317-0.832 0-1.149l1.371-1.371c0.853-0.853 0.853-2.241 0-3.094-0.413-0.413-0.963-0.641-1.547-0.641s-1.134 0.228-1.547 0.641l-3 3c-0.853 0.853-0.853 2.241 0 3.094 0.317 0.317 0.317 0.832 0 1.149-0.159 0.159-0.367 0.238-0.575 0.238z"></path><path d="M4 15.813c-1.018 0-1.976-0.397-2.696-1.117-1.486-1.486-1.486-3.905 0-5.392l1.371-1.371c0.317-0.317 0.832-0.317 1.149 0s0.317 0.832 0 1.149l-1.371 1.371c-0.853 0.853-0.853 2.241 0 3.094 0.413 0.413 0.962 0.641 1.547 0.641s1.134-0.228 1.547-0.641l3-3c0.853-0.853 0.853-2.241 0-3.094-0.317-0.317-0.317-0.832 0-1.149s0.832-0.317 1.149 0c1.486 1.486 1.486 3.905 0 5.392l-3 3c-0.72 0.72-1.678 1.117-2.696 1.117z"></path></svg>
                        }
                    </button>
                    {
                     securityResponse?.type !== 'none' && (
                        <button className={commonStyles.userLogout} onClick={() => logoutUser()} title='Logout'>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-logout"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M9 12h12l-3 -3" /><path d="M18 15l3 -3" /></svg>
                        </button>
                     )
                  }
                </div>
            </div>
        </header>
    )
}
export default TopHeader;

TopHeader.propTypes = {
    securityResponse: PropTypes.object,
};