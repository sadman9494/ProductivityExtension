
chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
  if (message.message) {
    document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 24px; color: red; text-align: center;">This Site is Blocked By You.</div>';

  }
});