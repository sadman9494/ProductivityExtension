

chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
    if (message.message) {
      document.body.innerText = "This Site is Blocked By You. Now You are being redirect to www.google.com"   
      setTimeout(() => {
        window.location.replace('http://www.google.com')
      }, 4000);
    }
  });