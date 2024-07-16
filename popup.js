'use strict'

const urlPlaceHolder = document.getElementById('url');
const blockBtn = document.getElementById('addUrl');
const listBtn = document.getElementById('list');

let url,urlStorage;


document.addEventListener('DOMContentLoaded', async(e)=>{
    e.preventDefault();
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions)
    url = tab.url;
    urlPlaceHolder.innerText= url
    
})
blockBtn.addEventListener('click',async (e)=>{

    e.preventDefault();
    urlStorage = await chrome.storage.local.get(['urlStorage'])
    urlStorage = urlStorage.urlStorage
    urlStorage.push(url)
    await chrome.storage.local.set({urlStorage:urlStorage})

})

listBtn.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
});