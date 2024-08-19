document.addEventListener('DOMContentLoaded', function() {
  const urlInput = document.getElementById('urlInput');
  const saveUrlButton = document.getElementById('saveUrlButton');
  const urlTableBody = document.getElementById('urlTable').getElementsByTagName('tbody')[0];

  // Save URL to local storage
  saveUrlButton.addEventListener('click', function() {
    let url = urlInput.value;
    if (url) {
      chrome.storage.local.get({ urlStorage: [] }, function(data) {
        let urls = data.urlStorage;
        if (!urls.includes(url)) {
          urls.push(url);
          chrome.storage.local.set({ urlStorage: urls }, function() {
            displayUrls();
          });
        }
      });
    }
  });

  // Display URLs in table
  function displayUrls() {
    chrome.storage.local.get({ urlStorage: [] }, function(data) {
      let urls = data.urlStorage;
      urlTableBody.innerHTML = '';
      urls.forEach(function(url, index) {
        let row = urlTableBody.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);

        cell1.textContent = url;

        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
          urls.splice(index, 1);
          chrome.storage.local.set({ urlStorage: urls }, function() {
            displayUrls();
          });
        });
        cell2.appendChild(deleteButton);
      });
    });
  }

  // Initial display of URLs
  displayUrls();
});
