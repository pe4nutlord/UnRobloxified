"use strict"

const runtime = chrome.runtime;
const manifest = runtime.getManifest();

const developerMode = (manifest.short_name === "Robloxify_dev");
const betaMode = (manifest.short_name === "Robloxify_beta");

const storage = chrome.storage.local;

const serviceWorker = !self.window;

const updateLog = `
Update 2.1.4:
- Fixed some bugs caused by a recent Roblox update.
- Removed unfinished features from settings. (Estimated release date of late 2023)

Update 2.1.3:
- Fixed an issue causing Item Statistics not to display after a Roblox update.

Update 2.1.2:
- Fixed the last online feature not displaying the correct time.

Update 2.1.1:
- Fixed bugs.

${(!developerMode && !betaMode) ? "Release" : (developerMode && !betaMode) ? "Development" : "Beta"} Build, Version ${manifest.version}
Updated on August 22nd, 2023
`

const robloxify = {
    get: (url, data) => {
        let message = {url: url, data: data || {}, request: "get"};

        return new Promise((resolve, reject) => {
            runtime.sendMessage(message, (response) => {
                if (response) resolve(response);
                reject({message: "A error occurred while fetching your request."});
            })
        })
    },

    post: (url, data) => {
        let message = {url: url, data: data, request: "post"};

        return new Promise((resolve, reject) => {
            runtime.sendMessage(message, (response) => {
                if (response) resolve(response);
                reject({message: "A error occurred while posting your request."});
            })
        })
    },

    fetch: (data) => {
        let message = {data: data, request: "fetch"};

        return new Promise((resolve, reject) => {
            runtime.sendMessage(message, (response) => {
                if (response) resolve(response);
                reject({message: "A error occurred while pushing your request."});
            })
        })
    },

    storage: {
        get: (key) => {
            return new Promise((resolve, reject) => {
                storage.get(key, (data) => {
                    resolve(data);
                })
            })
        },

        save: (key, data) => {
            return new Promise((resolve, reject) => {
                storage.set({[key]: data}, (result) => {
                    resolve(result);
                })
            })
        }
    }
}

class RobloxifySettings {
    constructor () {
        this.loadedSettings = null;
        
        this.defaultSettings = {
            general: {
                robloxifyUpdates: true,
                simpleTimeFormat: true,
                popularTabTop: false,
                blockAlert: false
            },

            games: {
                pinningGames: true
            },
        
            catalog: {
                recentCategory: true
            },
        
            assets: {
                assetStats: true,
                ownersList: true
            },
        
            profile: {
                profileStatus: undefined,
                lastOnline: true,
                easyStatistics: false
            },
        
            theme: {
                oldRobuxIcons: false,
                oldTopBarText: false,
                groupedHomePage: false,
                profileHomePage: false,
                changeBackToGames: false,
                oldNavigationIcons: false,
        
                smallChatTab: false,
                fancyScrollBar: false
            },
            
            currentSubDomain: "www.roblox.com",
            otherExtensionWarning: undefined,
            setupComplete: false
        };

        this.init();
    }

    async init () {
        const storageSettings = (await robloxify.storage.get("settings")).settings;

        if (!storageSettings) {
            this.loadedSettings = this.defaultSettings;
            robloxify.storage.save("settings", this.loadedSettings);
        } else {
            this.loadedSettings = storageSettings;
        }

        this.defaultSettings = undefined;
    }

    get (category, setting) {
        try {
            if (!setting) {return this.loadedSettings[category]};
            return this.loadedSettings[category][setting];
        } catch (error) {
            return false;
        }
    }

    set (category, setting, value) {
        if (value == null || value == undefined) {
            value = setting;
            this.loadedSettings[category] = value;
            robloxify.storage.save("settings", this.loadedSettings);
        } else {
            this.loadedSettings[category][setting] = value;
            robloxify.storage.save("settings", this.loadedSettings);
        }
    }
}

const settings = new RobloxifySettings();

if (serviceWorker) {
    runtime.onMessage.addListener((message, sender, sendMessage) => {
        switch (message.request) {
            case "get":
                let dataString = Object.entries(message.data).map(([key, value]) => {
                    return `${key}=${value}`;
                }).join("&");

                fetch(`${message.url}${Object.keys(message.data).length > 0 ? "?" : ""}${dataString}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then((response) => {
                    response.json().then((data) => {
                        sendMessage(data);
                    })
                });

                break;
            case "post":
                fetch(message.url, {
                    method: "POST",
                    body: JSON.stringify(message.data),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then((response) => {
                    response.json().then((data) => {
                        sendMessage(data);
                    })
                });

                break;
            case "fetch":
                fetch(message.data).then((response) => {
                    response.json().then((data) => {
                        sendMessage(data);
                    })
                });
                
                break;
        }
    
        return true;
    })
    
    runtime.onUpdateAvailable.addListener((details) => {
        runtime.reload();
    })
    
    try {
        self.importScripts("background/browseraction.js");
    } catch (error) {
        console.error(error);
    }
}