import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as defaults from '../common/Defaults';

import SkeletonItem from '../basicComponents/skeletonItem';
import MediaOverlay from '../basicComponents/overlay/MediaOverlay';

import styles from './styles/MediaResults.module.scss';


const IntialImagesCount = 3;


const MediaResult = ({ results, setopenModal, loading, response }) => {
    const [open, setopen] = useState(false);
    const [imageError, setImageError] = useState([]);
    const [modalSettings, setModalSettings] = useState({ shown: false });

    // ----------------------


    useEffect(() => {
        
        handleImageFetch(results);
     }, [results]);

    // ----------------------

    function handleImageFetch(results) {
        if(results){
            results.forEach(result => {
                if (result.contenttype?.toLowerCase() === 'ex_image' && result.uid && result.col) {
                    const configuredDomain = defaults.pluginDomain;
           
                    fetch(`${configuredDomain}/ui/v1/view-extracted-image/click/${result.uid}?colId=${result.col}`)
                       .then(response => response.json())
                       .then(data => {
                          if (data && data.imagedata) {
                             result['og:image'] = `data:image/jpeg;base64,${data.imagedata}`;
                          }
                       })
                       .catch(error => {
                          console.error('Error fetching image path:', error);
                       });
                 }
            })
        }
        
    }

    const handleerror = (id) => {
        setImageError(previous => [...previous, id])
    }

    function setopenModal(selected) {
        setModalSettings({ ...modalSettings, shown: true, result: { selected } });
    }

    const handleClose = () => {
        setModalSettings({ shown: false })
    }

    const isValidImageUrl = (url) => {
        if (!url) return false;
        
        // Check if it's a base64 image
        if (url.startsWith('data:image')) return true;
        
        // Check if it's a valid URL
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const hasValidImages = (results) => {
        if (!results || !Array.isArray(results) || results.length === 0) return false;

        return results.some(result => {
            const imageUrl = result['og:image:url'] || result['og:image'];
            return imageUrl && isValidImageUrl(imageUrl);
        });
    };


    const filteredresult = results && results.filter(key => (key.hasOwnProperty('og:image:url') || key.hasOwnProperty('og:image')));


    
    // ----------------------

    return (
        <>
            <div className={`${styles.media} ${open && styles.mediaOpen} `}>
                <a href="javascript:void(0)" className={styles.section} onClick={() => setopen(!open)} title="Image Section">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v48H54a6 6 0 0 0-6 6v244a6 6 0 0 0 6 6h372a6 6 0 0 0 6-6v-10h48zm42-336H150a6 6 0 0 0-6 6v244a6 6 0 0 0 6 6h372a6 6 0 0 0 6-6V86a6 6 0 0 0-6-6zm6-48c26.51 0 48 21.49 48 48v256c0 26.51-21.49 48-48 48H144c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h384zM264 144c0 22.091-17.909 40-40 40s-40-17.909-40-40 17.909-40 40-40 40 17.909 40 40zm-72 96l39.515-39.515c4.686-4.686 12.284-4.686 16.971 0L288 240l103.515-103.515c4.686-4.686 12.284-4.686 16.971 0L480 208v80H192v-48z"></path></svg>
                    <span>Search Images</span>
                </a>
                {
                    open ?
                        (loading ?
                            <>
                                <SkeletonItem width={'200px'} height={'16px'} />
                            </>
                            :
                            (filteredresult && filteredresult.length > 0 && hasValidImages(filteredresult)) ?
                                <div className={styles.imgGrid}>
                                    {
                                        filteredresult.map((result, i) => {
                                            let imagesrc = (result['og:image:url'] || result['og:image']) ? (result['og:image:url'] || result['og:image']) : null;
                                            return (
                                                imagesrc && isValidImageUrl(imagesrc) && i <= IntialImagesCount && !imageError.includes(i) ?
                                                    <a key={i} href="javascript:void(0)" className={`${styles.imgContainer} ${i == IntialImagesCount && filteredresult.length > IntialImagesCount ? styles.lastImg : ''} `} onClick={() => setopenModal(result)}>
                                                        <img src={imagesrc} loading="lazy" title={result['title']} onError={() => handleerror(i)} />
                                                        <span className={styles.label}>View more</span>
                                                    </a>
                                                    : null
                                            )
                                        })
                                    }
                                </div>
                                :
                                <span className={styles.noImage}>No images found for this query</span>
                        )
                        : null
                }
            </div>
            {modalSettings.shown &&
                <MediaOverlay
                    modalSettings={modalSettings}
                    setModalSettings={setModalSettings}
                    results={results}
                    handleClose={handleClose}
                    query={response.resultInfo.query.replace(/\\/g, "")}
                />
            }
        </>
    )
}

export default MediaResult;

MediaResult.propTypes = {
    result: PropTypes.object,
    setopenModal: PropTypes.func,
    loading: PropTypes.bool
}