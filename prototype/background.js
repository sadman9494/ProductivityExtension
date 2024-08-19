chrome.runtime.onInstalled.addListener(() => {
  const urlStorage = [];
  chrome.storage.local.set({ urlStorage: urlStorage }, () => {
      if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
          return false;
      } else {
          console.log("urlStorage initialized:", urlStorage);
          return true;
      }
  });
});

chrome.webNavigation.onCompleted.addListener(async (details) => {
  const storageData = await chrome.storage.local.get(['urlStorage']);
  const urlStorage = storageData.urlStorage || [];
  console.log("Current urlStorage:", urlStorage);
  urlStorage.forEach(element => {
      if (details.url.includes(element)) {
          chrome.tabs.sendMessage(details.tabId, { message: true, tabId: details.tabId, url: details.url }).catch((err) => console.log(err));
          console.log("Message Sent with tab id ", details.tabId);
      }
  });
}, { url: [{ urlMatches: '.*' }] });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message) {
      chrome.scripting.executeScript({
          target: { tabId: message.tabId },
          files: ['contentScript.js']
      });
  }
});
