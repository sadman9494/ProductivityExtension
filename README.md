# Productivity Plugin - Chrome Extension

## Overview
The **Productivity Plugin** is a Chrome extension designed to help users manage their time efficiently by blocking distracting websites and tracking time spent on them. Built with React.js for the frontend and leveraging Chrome's extension APIs, this plugin empowers users to customize their browsing experience by controlling access to specific websites.

## Features
- **Block Websites:** Users can block specific websites for a set amount of time each hour.
- **Redirect URLs:** Automatically redirect blocked sites to a specified alternative URL.
- **Time Tracking:** Track the total time spent on blocked sites during the day.
- **Google Calendar Integration :** Integrate with Google Calendar to manage events on google calendar.

## Usage

## Google Calendar Integration 
1. Set up OAuth 2.0 in Google Cloud Console.
2. Added the Chrome extension ID to the Authorized Domains.
3. Used the Google Calendar API to fetch and display events in the extension.

   
## Algorithm Behind Blocking and Time Tracking

### Blocking Algorithm
The core logic of the blocking functionality involves three main components:

1. **User Input:**
   - The user inputs the website to be blocked, the redirect URL, and the unblock time.

2. **Storage and Retrieval:**
   - The blocked URLs, redirect URLs, and unblock times are stored in Chrome's local storage using `chrome.storage.local.set`.
   - The extension listens for changes in this storage, updating the blocking rules dynamically.

3. **URL Interception and Redirection:**
   - Using `chrome.webNavigation.onCompleted.addListener`, the extension intercepts requests to blocked URLs.
   - It then checks whether the current time falls within the blocked period.
   - If blocked, the request is redirected to the specified URL using `chrome.tabs.update`.

### Time Tracking Algorithm
The time tracking feature works by:

1. **Monitoring Site Access:**
   - The extension listens for tab updates and records the start time when a blocked site is accessed.

2. **Tracking Active Time:**
   - The extension tracks how long a user stays on a blocked site by comparing the start time with the time the tab is closed or navigated away.

3. **Storing and Displaying Time Data:**
   - The accumulated time is stored in Chrome's local storage.
   - Users can view their total time spent on blocked sites in the "Manage Blocklists" or "Reports" section.

## React.js Components

Here we have used **React.js** for building the user interface and **MUI** (Material-UI) for styling the components.

### `PopupComponent`
- **Description:** The main UI component for interacting with the plugin.
- **Features:**
  - Displays the current site and allows users to input block and redirect URLs.
  - Submits the data to the backend API and triggers the blocking logic.
  - Manages state with `useState` and `useEffect` for dynamic updates.
  - Styled using **MUI** components to ensure a responsive and user-friendly interface.

### `ManageProfile`
- **Description:** Allows users to manage their blocking profiles and settings.
- **Features:**
  - Displays and updates user preferences for blocking and redirection.
  - Provides an interface to view and modify existing blocklists.
  - Utilizes **MUI** for consistent and modern styling across the UI elements.

### `TimeTracker`
- **Description:** Tracks the amount of time spent on blocked sites.
- **Features:**
  - Monitors active time on blocked sites and updates Chrome's local storage with the duration.
  - Displays time data in a user-friendly format.
  - Styled with **MUI** to present time tracking data clearly and effectively.



## Contributing
If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.


## Contact
For any inquiries or issues, please contact [sadmansaqib12@gmail.com](mailto:sadmansaqib12@gmail.com).
