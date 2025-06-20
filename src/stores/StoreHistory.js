import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

const historyCount = 8;

// Manages search history function for sidemenu and mobile view library 
export const handleHistory = (value, redirect) => {

    let localHistory = JSON.parse(localStorage.getItem("history")) || [];
    let loggedInUser = localStorage.getItem('loginUserName') || null;

    const checkExist = localHistory.library ? localHistory.library.filter(data => data.query.toLowerCase() !== value?.query.toLowerCase()) : localHistory;
    const allHistory = checkExist.length >= historyCount ? checkExist.filter((data, i) => i !== 0) : checkExist;

    if (allHistory.length <= historyCount) {
        allHistory.push({ 'query': value.query, 'url': value.url });

        var assignData = { user: loggedInUser, library: allHistory };
        localStorage.setItem('history', JSON.stringify(assignData))
    }
    // redirect = true only for sidemenu and mobile view bottom menu - libraries
    if (redirect) {
        window.location.href = value.url;
    }
}