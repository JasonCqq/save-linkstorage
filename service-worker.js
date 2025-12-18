// This runs in the background and always listens for messages
chrome.runtime.onMessageExternal.addListener(
  async (message, sender, sendResponse) => {
    console.log("Received message:", message);

    if (message.type === "AUTH_TOKEN") {
      // Save token to storage
      await chrome.storage.local.set({
        authToken: message.token,
        user: message.user,
      });

      console.log("Token saved! User:", message.user);

      // Optional: Open popup or show notification
      chrome.action.setBadgeText({ text: "✓" });
      chrome.action.setBadgeBackgroundColor({ color: "#00FF00" });
    }

    sendResponse({ received: true });
    return true; // Keep channel open for async response
  }
);

console.log("Background script loaded and listening");
