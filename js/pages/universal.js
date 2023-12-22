"use strict"

pages.universal = async () => {
    $.watch("body", (body) => {
        body.addClass('robloxify');
    })

    $.watch("#navigation-container", (selector) => {
        selector.addClass('robloxify');
    })

    if (settings.get("theme", "oldTopBarText")) {
        $.watch(".navbar-fixed-top.rbx-header", () => {
            try { // This problem is patched in 2.2.0, but I'm not adding that in this build.
                $(".font-header-2.nav-menu-title.text-header:contains('Discover')")[0].innerText = "Games";
                $(".font-header-2.nav-menu-title.text-header:contains('Marketplace')")[0].innerText = "Catalog";
                $(".font-header-2.nav-menu-title.text-header:contains('Avatar Shop')")[0].innerText = "Catalog";
            } catch (error) {
                setTimeout(() => {
                    try {
                        $(".font-header-2.nav-menu-title.text-header:contains('Discover')")[0].innerText = "Games";
                        $(".font-header-2.nav-menu-title.text-header:contains('Marketplace')")[0].innerText = "Catalog";
                        $(".font-header-2.nav-menu-title.text-header:contains('Avatar Shop')")[0].innerText = "Catalog";
                    } catch (error) {
                    }
                }, 1000)
                if (developerMode) {
                    console.log(error);
                }
            }
        })
        
        $.watch(".btn-growth-md.btn-secondary-md", (selector) => {
            selector[0].text = "Upgrades";
        })
    }

    $.watch("head", () => {
        if (settings.get("theme", "oldRobuxIcons")) {
            injectCSS("css/robux.css");
        }

        if (settings.get("theme", "oldNavigationIcons")) {
            injectCSS("css/navigationIcons.css");
        }
    
        if (settings.get("theme", "fancyScrollBar")) {
            injectCSS("css/scrollbar.css");
        }
    
        if (settings.get("theme", "smallChatTab")) {
            injectCSS("css/chat.css");
        }
    })
    
    if (!settings.get("setupComplete")) {
        $.watch("body", (body) => {
            let blackBarrier = $(`<div style="background-color: rgb(0, 0, 0); opacity: 0.8; height: 100%; width: 100%; position: fixed; left: 0px; top: 0px; z-index: 1041;" id="" class=""></div>`).appendTo(body);
            let setupNotification = $(`
            <div class="robloxify-setup-notification">
                <div class="section-content">
                    <span class="robloxify-icon"></span>
                    <h3>Thanks for exploring Robloxify!</h3>
                    <pre class="text">Robloxify adds a touch of smoothness to your Roblox experience, and there's more beneath the surface. Customize Robloxify's modifications to suit your preferences by navigating to the Robloxify settings.</pre>
                    <div class="settings-confirmation">
                        <a href="https://${currentUrlPaths[2]}/Robloxify/settings" id="confirm-btn" class="btn-primary-md">Customize Robloxify</a>
                        <a id="decline-btn" class="btn-control-md">Keep It Round</a>
                    </div>                    
            </div>`).prependTo(body);

            $(".settings-confirmation #confirm-btn").click(() => {
                settings.set("setupComplete", true);
                $(".settings-confirmation #confirm-btn").unbind("click");
            })

            $(".settings-confirmation #decline-btn").click(() => {
                settings.set("setupComplete", true);
                blackBarrier.remove();
                setupNotification.remove();
                $(".settings-confirmation #decline-btn").unbind("click");
            })
        })
    }

    $.watch("#navbar-settings button", (settingsIcon) => {
        settingsIcon.click(() => {
            $.watch("#settings-popover-menu", (popover) => {
                if (!$(".robloxify-rbx-menu-item").length > 0) {
                    popover.prepend(`<li><a class="rbx-menu-item robloxify-rbx-menu-item" href="https://${currentUrlPaths[2]}/robloxify/settings">Robloxify</a></li>`)
                }
            })
        })
    })

    if (settings.get("general", "blockAlert")) {
        $.watch(".alert-container", (alert) => {
            alert.attr("style", "display: none;");
        })
    }

    if (settings.get("currentSubDomain") != currentUrlPaths[2]) { // Why did Roblox make this more complicated than it should be?
        settings.set("currentSubDomain", currentUrlPaths[2]);
    }

    if (developerMode) {
        console.log(settings.loadedSettings);
    }
}