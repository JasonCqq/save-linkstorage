async function displayAllTabs() {
  const tabs = await chrome.tabs.query({});
  console.log(tabs);

  const contentGrid = document.querySelector("#content #tabs .tabs-grid");
  contentGrid.innerHTML = tabs
    .map(
      (tab) =>
        `<div class="tab-item">
            <img src="${tab.favIconUrl}" width="12" height="12">
            <div class="tab-flex">
                <span class="tab-title">${tab.title}</span>
                <span class="tab-url">${tab.url}</span>
            </div>
        </div>`
    )
    .join("");
}
displayAllTabs();

// document.getElementById("submitUrls").addEventListener("click", async () => {
//   const tabs = await chrome.tabs.query({});
//   console.log("Tabs: ", tabs);
// });

document.getElementById("submitUrl").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  console.log("Current tab:", tab);
  console.log("URL:", tab.url);
  console.log("Title:", tab.title);
});
