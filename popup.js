// Render current tabs
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

async function displayUser() {
  const { user } = await chrome.storage.local.get(["user"]);
  if (user) {
    const connectAccount = document.getElementById("connectAcc");
    connectAccount.innerHTML = user.username;
  }

  if (!user) {
    // Open auth page
    document.getElementById("connectAcc").addEventListener("click", () => {
      chrome.windows.create({
        url: "http://localhost:4200/user/extension-login",
        type: "popup",
        width: 480,
        height: 600,
      });
    });
  }
}

displayUser();
// document.getElementById("submitUrls").addEventListener("click", async () => {
//   const tabs = await chrome.tabs.query({});
//   console.log("Tabs: ", tabs);
// });

// document.getElementById("submitUrl").addEventListener("click", async () => {
//   const [tab] = await chrome.tabs.query({
//     active: true,
//     lastFocusedWindow: true,
//   });
//   console.log("Current tab:", tab);
//   console.log("URL:", tab.url);
//   console.log("Title:", tab.title);
// });

// Make authenticated requests
// async function fetchUserData() {
//   const { authToken } = await chrome.storage.local.get("authToken");

//   const response = await fetch(
//     "http://localhost:3000/api/extension/user-data",
//     {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     }
//   );

//   return response.json();
// }
