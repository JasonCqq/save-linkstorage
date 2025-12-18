// This runs in the background and always listens for messages
chrome.runtime.onMessageExternal.addListener(
  async (message, sender, sendResponse) => {
    if (message.type === "AUTH_TOKEN") {
      // Save token to storage
      await chrome.storage.local.set({
        authToken: message.token,
        user: message.user,
      });

      // Optional: Open popup or show notification
      chrome.action.setBadgeText({ text: "✓" });
      chrome.action.setBadgeBackgroundColor({ color: "#00FF00" });
    }

    sendResponse({ received: true });
    return true; // Keep channel open for async response
  }
);

