import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Overlay from '../overlay';

import styles from './styles/mediaOverlay.module.scss';


const MediaOverlay = ({ modalSettings, results, query, handleClose }) => {
    const [imageError, setImageError] = useState([]);
    const [selectedImg, setSelectedImg] = useState({ selected: modalSettings.result.selected })
    const [splittedImages, setsplittedImages] = useState([])

    // ------------

    useEffect(() => {
        if (results) {
            const halfIndex = results && Math.ceil(results.length / 2)

            const firstHalfOfArray = results && results.slice(0, halfIndex)
            const secondHalfOfArray = results && results.slice(halfIndex)
            setsplittedImages([firstHalfOfArray, secondHalfOfArray])
        }
    }, [results])

    const handleerror = (id) => {
        setImageError(previous => [...previous, id])
    }

    // --------------

    let selectedHref = selectedImg.selected ? selectedImg.selected['og:url'] || selectedImg.selected['url'] : null;
    let imageFocus = selectedImg.selected ? selectedImg.selected['og:image:url'] || selectedImg.selected['og:image'] : null;

    return (
        <>
            <Overlay open={modalSettings.shown} className={styles.sbModal}>
                <Overlay.Title className={styles.sbModalHeading} onClose={handleClose}>
                    <div className={styles.imgTitle}>
                        <h2>
                            {decodeURI(query).replace(/\\/g, "")}
                        </h2>
                        <a className={styles.link} href={selectedHref} title={selectedImg.selected && selectedImg.selected['title']} target='_blank'>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 14 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"></path></svg>
                            <span dangerouslySetInnerHTML={{__html: selectedImg.selected['title']}}/>
                        </a>
                    </div>
                </Overlay.Title>

                <Overlay.Content className={styles.sbModalBody}>
                    <div className={styles.currentImageSection}>
                        <div className={styles.container}>
                            {
                                selectedImg && !imageError.includes(selectedImg.selected['no']) ?
                                    <div className={styles.imgContainer}>
                                        <img className={styles.selectedImg} src={imageFocus} loading="lazy" onError={() => handleerror()} alt={selectedImg.selected['title'] ? selectedImg.selected['title'] : 'Image'} />
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                    <div className={styles.imageGridSection}>
                        <div className={styles.gridView}>
                            {
                                splittedImages.map((result, i) => {
                                    return (

                                        <div className={styles.flexWidth} key={i}>
                                            {result.map((img, i) => {
                                                // ---- Customize keys here ----
                                                let imagesrc = (img['og:image:url'] || img['og:image']) ? (img['og:image:url'] || img['og:image']) : null;
                                                let compareimg = ((selectedImg.selected['og:image:url'] || selectedImg.selected['og:image']) === (img['og:image:url'] || img['og:image']));
                                                return (

                                                    imagesrc && !imageError.includes(img['no']) ?
                                                        <a key={i} href="javascript:void(0)" id={`image-${i}`} className={`${styles.imgContainer} ${(compareimg && selectedImg.selected.no === img['no']) && styles.activeImg} `} onClick={() => { setSelectedImg({ "selected": img, "index": i }) }}>
                                                            <img src={imagesrc} loading="lazy" onError={() => handleerror(img['no'])} alt={img['title'] ? img['title'] : 'Image'} />

                                                        </a>
                                                        : null
                                                )
                                            })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </Overlay.Content>
            </Overlay >
        </>
    )
}

export default MediaOverlay

MediaOverlay.propTypes = {
    modalSettings: PropTypes.object,
    results: PropTypes.array,
    query: PropTypes.string
};