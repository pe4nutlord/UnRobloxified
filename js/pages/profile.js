"use strict"

pages.profile = async (userId) => {
    if (settings.get("profile", "lastOnline")) {
        try {
            const onlineData = await robloxify.post(`https://presence.roblox.com/v1/presence/last-online`, {userIds: [Number(userId)]});
            const presenceData = await robloxify.post(`https://presence.roblox.com/v1/presence/users`, {userIds: [Number(userId)]});

            const statsData = onlineData?.lastOnlineTimestamps?.[0];
            const presence = presenceData?.userPresences?.[0];

            if (!statsData) return;
            if (!presence) return;

            const lastOnline = statsData.lastOnline;
            const isCurrentlyOnline = (presence.userPresenceType === 0);

            $.watch(".profile-stats-container", (selector) => {
                selector.addClass("last-online-stat");
                $($(".profile-stats-container > .profile-stat")[0]).after(`<li class="profile-stat"><p class="text-label">Last Online</p><p class="text-lead">${isCurrentlyOnline ? util.timeFormat(lastOnline) : "Currently Online"}</p></li>`);
            })
        } catch (error) {
            if (developerMode) {
                console.log(error);
            }
        }
    }

    if (settings.get("profile", "easyStatistics")) {
        $.watch(".section .profile-statistics", () => {
            $(".section .profile-statistics > .container-header").remove();
            $("#profile-statistics-container").insertAfter($("#profile-current-wearing-avatar"));
        })
    }

    if (settings.get("profile", "changeBackToGames")) {
        $.watch(".profile-game.ng-scope.section", () => {
            $(".profile-game.ng-scope.section > .container-header > h3:Contains('Experiences')")[0].innerText = "Games";
        })
    }

    try {
        const groupMembership = await robloxify.get(`https://groups.roblox.com/v1/users/${Number(userId)}/groups/roles`);

        if (!groupMembership) return;

        for (const member of groupMembership.data) {
            if (member.group.id !== 15157542) continue;

            switch (member.role.name) {
                case "Member": {
                    if (developerMode) console.log("This person is cool, they're a Robloxify Member.");

                    break;
                }

                case "Bronze Tier": {
                    if (developerMode) console.log("This person bought a membership! A badge is coming soon for them.");

                    break;
                }

                case "Tester": {
                    $.watch("#roblox-badges-container > .section-content > .hlist.badge-list > .list-item.asset-item", (selector) => {
                        $(selector[0]).before(`<li class="list-item asset-item"> <a href="https://www.roblox.com/groups/15157542/Robloxify" title="This badge is awarded to the beta testers of Robloxify!"> <span class="border asset-thumb-container icon-badge-robloxify-beta-tester" title="Robloxify Beta Tester"></span> <span class="font-header-2 text-overflow item-name">Robloxify Tester</span> </a> </li>`);
                    });

                    break;
                }

                case "Owner": {
                    $.watch("#roblox-badges-container > .section-content > .hlist.badge-list > .list-item.asset-item", (selector) => {
                        $(selector[0]).before(`<li class="list-item asset-item"> <a href="https://www.roblox.com/robloxify/settings" title="This badge is awarded to the developers of Robloxify!"> <span class="border asset-thumb-container icon-badge-robloxify-creator" title="Robloxify Developer"></span> <span class="font-header-2 text-overflow item-name">Robloxify</span> </a> </li>`);
                    });

                    break;
                }
            }

        }
    } catch (error) {
        if (allowConsoleErrors) {
            console.log(error);
        }
    }

    switch (userId) {
        case 1: {
            $.watch(".container-header", () => {
                $(".container-header > .collection-btns").append(`<a href="https://${currentUrlPaths[2]}/catalog?Category=1&CreatorName=Roblox&salesTypeFilter=1&SortType=3&IncludeNotForSale" class="btn-min-width btn-secondary-xs btn-more inventory-link see-all-link-icon ng-binding">Recent Items</a>`);
            })

            break;
        }

        case 531629183: {
            const headerStatus = [
                "Celestial admirer of cats in the night sky.",
                "Just looking at the stars.",
                "Nobody will ever know.",
                "V293LCB5b3UgYWN0dWFsbHkgZGVjb2RlZCB0aGlzLiBZb3UncmUgY29vbC4=",
                "01010011 01110100 01100001 01110010 01110011",
                "If I'm not online; I'm probably reading a book or something.",
                `You're on the ${(!developerMode && !betaMode) ? "Release" : (developerMode && !betaMode) ? "Development" : "Beta"} build, aren't you?`,
                "The true test of time.",
                "wfeqoiphjsdphaoiufaoidsphjfadskj asdoijf jiuosd fasiojdfasdojipf dasojipsd jao fdjshafdjoi;ojiunhwdfopiwdespfasdpo sdp[wpe ijor iusr ghifsafoh i",
                "Robloxify is the best extension."
            ];

            $.watch(".text-lead:contains('2/26/2018')", (selector) => {
                selector[0].innerText = "8/8/2014";
            });

            $.watch(".header-caption > .header-names", (selector) => {
                selector.after(`<div class="header-user-status"> <span class="text">"${headerStatus[Math.floor(Math.random() * headerStatus.length)]}"</span> </div>`);
            })

            break;
        }
    }
}