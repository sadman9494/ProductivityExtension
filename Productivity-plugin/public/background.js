/* eslint-disable no-undef */
console.log("Background script running");

chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId !== 0) {
    // Only process the main frame (frameId === 0)
    return;
  }

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

    if (matchedEntry) {
      let existingTimer = timerObject.find(item => item.id === matchedEntry.id);

      if (!existingTimer) {
        existingTimer = {
          id: matchedEntry.id,
          unblockTime: matchedEntry.minutes_to_unblock * 60, // convert minutes to seconds
          remainingTime: matchedEntry.minutes_to_unblock * 60,
          lastChecked: new Date().getTime()
        };
        timerObject.push(existingTimer);
        chrome.storage.local.set({ timerObject: timerObject }, () => {
          console.log('New timer object has been added to the array in chrome.storage.local');
        });
      } else {
        resetTimer(existingTimer); // Automatically reset timer if necessary
      }

      startCountdown(existingTimer);
      startPeriodicCheck(existingTimer); // Start periodic check to reset the timer if an hour has passed
    }

    function startCountdown(timer) {
      console.log(`Starting countdown: ${timer.remainingTime} seconds`);

      const intervalId = setInterval(() => {
        if (timer.remainingTime > 0) {
          chrome.tabs.get(details.tabId, function(tab) {
            if (chrome.runtime.lastError) {
              console.log(`${details.tabId} is closed`);
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
          chrome.tabs.update(details.tabId, { url: matchedEntry.redirect_urls });
          saveTimerState(timer); // Save state when timer is up
        }
      }, 1000); // Execute every 1 second
    }

    function startPeriodicCheck(timer) {
      setInterval(() => {
        resetTimer(timer); // Check if the timer needs resetting every minute
      }, 60 * 1000); // Check every minute
    }

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

  });
}, { urls: ["<all_urls>"] });
