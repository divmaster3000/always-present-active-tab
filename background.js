chrome.action.onClicked.addListener(async (tab) => {
    if (!tab?.id || !/^https:\/\/eqn\.hsc\.gov\.ua\//.test(tab.url || "")) return;

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["pagePatch.js"],
        world: "MAIN"
    });
});