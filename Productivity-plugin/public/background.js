/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
console.log("Background script running");

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.urlData) {
    const newUrlData = changes.urlData.newValue;
    checkAndRedirectTabs(newUrlData);
  }
});

// Function to check and redirect already open tabs
function checkAndRedirectTabs(newUrlData) {
  console.log(`from checkAndRedirect, urlData:`, newUrlData);
  chrome.storage.local.get('timerObject', (result) => {
    const timerObject = result.timerObject || [];
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        const currentUrl = new URL(tab.url).hostname;
        newUrlData.forEach(entry => {
          const entryUrl = new URL(entry.block_urls).hostname;
          if (currentUrl === entryUrl) {
            handleUrlEntry(entry, timerObject, tab.id);
          }
        });
      });
    });
  });
}

// Function to handle URL entry and manage timers
function handleUrlEntry(entry, timerObject, tabId) {
  if (entry) {
    let existingTimer = timerObject.find(item => item.id === entry.id);

    if (!existingTimer) {
      existingTimer = createTimer(entry);
      timerObject.push(existingTimer);
      chrome.storage.local.set({ timerObject: timerObject }, () => {
        console.log('New timer object has been added to the array in chrome.storage.local');
      });
    } else {
      resetTimer(existingTimer);
    }

    startCountdown(existingTimer, tabId, entry);
    startPeriodicCheck(existingTimer);
  }
}

// Create a new timer object
function createTimer(entry) {
  return {
    id: entry.id,
    unblockTime: entry.minutes_to_unblock * 60, // convert minutes to seconds
    remainingTime: entry.minutes_to_unblock * 60,
    lastChecked: new Date().getTime()
  };
}

// Function to start the countdown timer
function startCountdown(timer, tabId, entry) {
  console.log(`Starting countdown: ${timer.remainingTime} seconds`);

  const intervalId = setInterval(() => {
    if (timer.remainingTime > 0) {
      chrome.tabs.get(tabId, function(tab) {
        if (chrome.runtime.lastError) {
          console.log(`${tabId} is closed`);
          saveTimerState(timer); // Save state when tab is closed
          clearInterval(intervalId);
        } else {
          timer.remainingTime--;
          console.log(`Time left: ${Math.floor(timer.remainingTime / 60)} minutes and ${timer.remainingTime % 60} seconds`);
        }
      });
    } else {
      console.log('Time is up!');
      clearInterval(intervalId);
      resetTimer(timer); // Reset after time is up
      blockingAllTabs(entry); // Update tabs based on matched entry
      saveTimerState(timer); // Save state when timer is up
    }
  }, 1000); // Execute every 1 second
}

// Function to start periodic check for timer reset
function startPeriodicCheck(timer) {
  setInterval(() => {
    resetTimer(timer); // Check if the timer needs resetting every minute
  }, 60 * 1000); // Check every minute
}

// Function to reset the timer if necessary
function resetTimer(timer) {
  const currentTime = new Date().getTime();
  const timeElapsed = currentTime - timer.lastChecked;

  if (timeElapsed >= 60*60 * 1000) { // Check if more than 1 hour has passed
    timer.remainingTime = timer.unblockTime;
    timer.lastChecked = currentTime;
    saveTimerState(timer);
    console.log('Timer has been reset after one hour.');
  }
}

// Function to save the timer state to chrome.storage.local
function saveTimerState(timer) {
  chrome.storage.local.get(['timerObject'], (result) => {
    let updatedTimers = result.timerObject || [];
    let updatedTimer = updatedTimers.find(item => item.id === timer.id);
    if (updatedTimer) {
      updatedTimer.remainingTime = timer.remainingTime;
      updatedTimer.lastChecked = timer.lastChecked;
    } else {
      updatedTimers.push(timer);
    }
    chrome.storage.local.set({ timerObject: updatedTimers });
  });
}

// Function to block all tabs and redirect based on the matched entry
function blockingAllTabs(matchedEntry) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      const currentTabUrl = new URL(tab.url).hostname;
      const blockTabUrl = new URL(matchedEntry.block_urls).hostname;

      if (currentTabUrl === blockTabUrl) {
        chrome.tabs.update(tab.id, { url: matchedEntry.redirect_urls });
      }
    });
  });
}

chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId !== 0) {
    // Only process the main frame (frameId === 0)
    return;
  }

  console.log(details);
  chrome.storage.local.get(['urlData', 'timerObject'], (result) => {
    const urlData = result.urlData || [];
    const timerObject = result.timerObject || [];
    const currentUrl = new URL(details.url).hostname;
    console.log(`Navigated to: ${currentUrl}`);

    const matchedEntry = urlData.find((entry) => {
      console.log(`EntryURL: ${entry.block_urls}`);
      const entryUrl = new URL(entry.block_urls).hostname;
      return currentUrl === entryUrl;
    });

    console.log(`Matched Entry: ${matchedEntry}`);
    handleUrlEntry(matchedEntry, timerObject, details.tabId);
  });
}, { urls: ["<all_urls>"] });
