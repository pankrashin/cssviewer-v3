/*!
 * CSSViewer, A Google Chrome Extension for fellow web developers, web designers, and hobbyists.
 *
 * https://github.com/miled/cssviewer
 * https://chrome.google.com/webstore/detail/cssviewer/ggfgijbpiheegefliciemofobhmofgce
 *
 * This source code is licensed under the GNU General Public License,
 * Version 2. See the file COPYING for more details.
 */

var cssViewerLoaded = false;
var cssCiewerContextMenusParent = null;

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function (details) {
        if (details.reason == "install" || details.reason == "update") {
                chrome.tabs.create({ url: "option.html" });
        }
});

/*
 * Inject cssviewer.js/cssviewer.css into the current page
 */
chrome.action.onClicked.addListener(async function (tab) {
        if (
                tab.url.startsWith("https://chrome.google.com") ||
                tab.url.startsWith("chrome://")
        ) {
                chrome.notifications.create({
                        type: "basic",
                        iconUrl: "img/16.png",
                        title: "CSSViewer",
                        message: "CSSViewer doesn't work on Google Chrome webstore!",
                });
                return;
        }

        if (!cssViewerLoaded) {
                cssCiewerContextMenusParent = await chrome.contextMenus.create({
                        title: "CSSViewer console",
                        contexts: ["all"],
                });

                await chrome.contextMenus.create({
                        title: "element",
                        contexts: ["all"],
                        parentId: cssCiewerContextMenusParent,
                        id: "cssviewer-element",
                });
                await chrome.contextMenus.create({
                        title: "element.id",
                        contexts: ["all"],
                        parentId: cssCiewerContextMenusParent,
                        id: "cssviewer-element-id",
                });
                await chrome.contextMenus.create({
                        title: "element.tagName",
                        contexts: ["all"],
                        parentId: cssCiewerContextMenusParent,
                        id: "cssviewer-element-tagName",
                });
                await chrome.contextMenus.create({
                        title: "element.className",
                        contexts: ["all"],
                        parentId: cssCiewerContextMenusParent,
                        id: "cssviewer-element-className",
                });
                await chrome.contextMenus.create({
                        title: "element.style",
                        contexts: ["all"],
                        parentId: cssCiewerContextMenusParent,
                        id: "cssviewer-element-style",
                });
                await chrome.contextMenus.create({
                        title: "element.cssText",
                        contexts: ["all"],
                        parentId: cssCiewerContextMenusParent,
                        id: "cssviewer-element-cssText",
                });
                await chrome.contextMenus.create({
                        title: "element.getComputedStyle",
                        contexts: ["all"],
                        parentId: cssCiewerContextMenusParent,
                        id: "cssviewer-element-getComputedStyle",
                });
                await chrome.contextMenus.create({
                        title: "element.simpleCssDefinition",
                        contexts: ["all"],
                        parentId: cssCiewerContextMenusParent,
                        id: "cssviewer-element-simpleCssDefinition",
                });
                cssViewerLoaded = true;
        }

        await chrome.scripting.insertCSS({
                target: { tabId: tab.id },
                files: ["css/cssviewer.css"],
        });
        await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["js/cssviewer.js"],
        });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
        let codeType = null;
        switch (info.menuItemId) {
                case "cssviewer-element":
                        codeType = "el";
                        break;
                case "cssviewer-element-id":
                        codeType = "id";
                        break;
                case "cssviewer-element-tagName":
                        codeType = "tagName";
                        break;
                case "cssviewer-element-className":
                        codeType = "className";
                        break;
                case "cssviewer-element-style":
                        codeType = "style";
                        break;
                case "cssviewer-element-cssText":
                        codeType = "cssText";
                        break;
                case "cssviewer-element-getComputedStyle":
                        codeType = "getComputedStyle";
                        break;
                case "cssviewer-element-simpleCssDefinition":
                        codeType = "simpleCssDefinition";
                        break;
        }
        if (codeType) {
                chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: (type) => window.cssViewerCopyCssToConsole(type),
                        args: [codeType],
                });
        }
});
