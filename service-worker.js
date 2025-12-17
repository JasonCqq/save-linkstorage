// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg.type === "GET_CURRENT_TAB") {
//     chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
//       if (chrome.runtime.lastError) {
//         sendResponse({ error: chrome.runtime.lastError.message });
//       } else {
//         sendResponse(tab);
//       }
//     });

//     return true; // IMPORTANT: keep async channel open
//   }
// });
