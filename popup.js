const ENV = {
  DEV: "dev",
  PROD: "prod",
};

const CURRENT_ENV =
  chrome.runtime.getManifest().version_name === "dev" ? ENV.DEV : ENV.PROD;

const backApiUrl =
  CURRENT_ENV === ENV.DEV
    ? "http://localhost:3000"
    : "https://api.linkstorage.net";
const frontApiUrl =
  CURRENT_ENV === ENV.DEV ? "http://localhost:4200" : "https://linkstorage.net";

  
// Render current tabs
async function displayAllTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });

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

    chrome.action.setBadgeText({ text: "." });
    chrome.action.setBadgeBackgroundColor({ color: "#00FF00" });
  }

  if (!user) {
    // Open auth page
    document.getElementById("connectAcc").addEventListener("click", () => {
      chrome.windows.create({
        url: `${frontApiUrl}/user/extension-login`,
        type: "popup",
        width: 480,
        height: 600,
      });
    });
  }
}
displayUser();

const dashboardInput = document.getElementById("dashboard");
const urlbankInput = document.getElementById("urlbank");
const bookmarkInput = document.getElementById("bookmark");
const resText = document.getElementById("resText");

document.getElementById("submitUrl").addEventListener("click", async () => {
  resText.innerText = "Saving Link...";
  resText.style.color = "#facc15";

  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  const { authToken } = await chrome.storage.local.get("authToken");
  const responses = [];
  const dashboardValue = dashboardInput.checked;
  const urlbankValue = urlbankInput.checked;
  const bookmarkValue = bookmarkInput.checked;

  if (urlbankValue === true) {
    responses.push(
      fetch(`${backApiUrl}/url/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ urls: [tab.url] }),
      })
    );
  }

  if (dashboardValue === true) {
    responses.push(
      fetch(`${backApiUrl}/link/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          urls: [tab.url],
          bookmarked: bookmarkValue,
        }),
      })
    );
  }

  const results = await Promise.all(responses);
  const data = await Promise.all(results.map((r) => r.json()));

  if (data) {
    resText.style.color = "#90ee90";
    resText.innerText = "Saved Link!";
  }

});

document.getElementById("submitUrls").addEventListener("click", async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true });

  resText.innerText = "Saving Link(s)... May take a while depending on amount.";
  resText.style.color = "#facc15";

  const { authToken } = await chrome.storage.local.get("authToken");
  const responses = [];
  const dashboardValue = dashboardInput.checked;
  const urlbankValue = urlbankInput.checked;
  const bookmarkValue = bookmarkInput.checked;

  let tempArr = [];
  tabs.map((t) => {
    tempArr.push(t.url);
  });

  if (urlbankValue === true) {
    responses.push(
      fetch(`${backApiUrl}/url/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ urls: tempArr }),
      })
    );
  }

  if (dashboardValue === true) {
    responses.push(
      fetch(`${backApiUrl}/link/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          urls: tempArr,
          bookmarked: bookmarkValue,
        }),
      })
    );
  }

  const results = await Promise.all(responses);
  const data = await Promise.all(results.map((r) => r.json()));

  if (data) {
    resText.style.color = "#90ee90";
    resText.innerText = "Link(s) all saved!";
  }
});
