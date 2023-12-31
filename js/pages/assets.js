"use strict"

function getBadgeRarity(rarity) {
    switch (true) {
        case rarity <= 1:
            return "Impossible";
        case rarity > 1 && rarity <= 5:
            return "Insane";
        case rarity > 5 && rarity <= 10:
            return "Extreme";
        case rarity > 10 && rarity <= 20:
            return "Hard";
        case rarity > 20 && rarity <= 30:
            return "Challenging";
        case rarity > 30 && rarity <= 50:
            return "Moderate";
        case rarity > 50 && rarity <= 80:
            return "Easy";
        case rarity > 80 && rarity <= 90:
            return "Cake Walk";
        case rarity > 90 && rarity <= 100:
            return "Freebie";
        default:
            return "Unknown";
    }
}

pages.assets = async (assetId) => {
    const assetPage = currentPageInfo.path;

    if (settings.get("assets", "assetStats")) {
        switch (assetPage) {
            case "badges": {
                const badge = await robloxify.get(`https://badges.roblox.com/v1/badges/${assetId}`);

                if (!badge) return;
    
                const winRate = (badge.statistics.winRatePercentage * 100).toFixed(1);
        
                $.watch(".clearfix.toggle-target.item-field-container", (description) => {
                    $(".clearfix.item-field-container:contains('Updated')").remove();
        
                    description.before(`<div class="clearfix item-field-container" data-itemstats="Created"><div class="text-label field-label">Created</div><span class="field-content ">${util.timeFormat(badge.created)}</span></div>`);
                    description.before(`<div class="clearfix item-field-container" data-itemstats="Updated"><div class="text-label field-label">Updated</div><span class="field-content ">${util.timeFormat(badge.updated)}</span></div>`);
                    description.before(`<div class="clearfix item-field-container" data-itemstats="Rarity"><div class="text-label field-label">Rarity</div><span class="field-content ">${getBadgeRarity(Number(winRate))} (${winRate}%)</span></div>`);
                    description.before(`<div class="clearfix item-field-container" data-itemstats="Recent"><div class="text-label field-label">Won Recent</div><span class="field-content ">${badge.statistics.pastDayAwardedCount.toLocaleString()}</span></div>`);
                    description.before(`<div class="clearfix item-field-container" data-itemstats="Won-Ever"><div class="text-label field-label">Won Ever</div><span class="field-content ">${badge.statistics.awardedCount.toLocaleString()}</span></div>`);
                    description.before(`<div class="clearfix item-field-container" data-itemstats="Avalibility"><div class="text-label field-label">Availability</div><span class="field-content ">${badge.enabled ? "Obtainable" : "Unobtainable"}</span></div>`);
                })
        
                if (developerMode) {
                    console.log(badge);
                }

                break;
            }

            case "bundles": {
                const assetDetails = await robloxify.get(`https://catalog.roblox.com/v1/bundles/${assetId}/details`);

                if (!assetDetails) return;
            
                let bundle = null;
    
                for (let index in assetDetails.items) { // This fetches an asset inside of the bundle to get the information.
                    let item = assetDetails.items[index];

                    if (item.type === "Asset") {
                        bundle = await robloxify.get(`https://economy.roblox.com/v2/assets/${item.id}/details`);
                        break;
                    }
                }

                if (!bundle) return;

                $.watch(".clearfix.toggle-target.item-info-row-container", (description) => {
                    description.before(`<div class="clearfix item-info-row-container" data-itemstats="Created"><div class="font-header-1 text-subheader text-label text-overflow row-label">Created</div><span class="type-content">${util.timeFormat(bundle.Created)}</span></div>`);
                    description.before(`<div class="clearfix item-info-row-container" data-itemstats="Updated"><div class="font-header-1 text-subheader text-label text-overflow row-label">Updated</div><span class="type-content">${util.timeFormat(bundle.Updated)}</span></div>`);
                })

                if (developerMode) {
                    console.log(bundle);
                }

                break;
            }

            case "game-pass": {
                const asset = await robloxify.get(`https://apis.roblox.com/game-passes/v1/game-passes/${assetId}/product-info`);
                
                if (!asset) return;

                const authUser = await util.getAuthUser();
                let creatorId = asset.Creator.Id;
    
                if (asset.Creator.CreatorType === "Group") {
                    try {
                        let groupMembership = await robloxify.get(`https://groups.roblox.com/v1/groups/${asset.Creator.CreatorTargetId}/membership`);
    
                        if (groupMembership) {
                            if (groupMembership.permissions.groupEconomyPermissions.manageGroupGames) {
                                creatorId = authUser.userId || 0;
                            }
                        }
                    } catch (message) {
                        if (developerMode) {
                            console.warn(message);
                        }
                    }
                }
    
                $.watch(".clearfix.toggle-target.item-field-container", (description) => {
                    if (creatorId > 1) {
                        $(".clearfix.item-field-container:contains('Updated')").remove();
                    }
    
                    description.before(`<div class="clearfix item-field-container" data-itemstats="Created"><div class="text-label field-label">Created</div><span class="field-content ">${util.timeFormat(asset.Created)}</span></div>`);
                    description.before(`<div class="clearfix item-field-container" data-itemstats="Updated"><div class="text-label field-label">Updated</div><span class="field-content ">${util.timeFormat(asset.Updated)}</span></div>`);
    
                    if (creatorId === authUser.userId) {
                        description.before(`<div class="clearfix item-field-container" data-itemstats="Sales"><div class="text-label field-label">Sales</div><span class="field-content ">${asset.Sales.toLocaleString()}</span></div>`);
                    }
                })
        
                if (developerMode) {
                    console.log(asset);
                }

                break;
            }

            default: {
                const asset = await robloxify.get(`https://economy.roblox.com/v2/assets/${assetId}/details`);
                
                if (!asset) return;

                const authUser = await util.getAuthUser();
                let creatorId = asset.Creator.Id;
    
                if (asset.Creator.CreatorType === "Group") {
                    try {
                        let groupMembership = await robloxify.get(`https://groups.roblox.com/v1/groups/${asset.Creator.CreatorTargetId}/membership`);
    
                        if (groupMembership) {
                            if (groupMembership.permissions.groupEconomyPermissions.manageGroupGames) {
                                creatorId = authUser.userId || 0;
                            }
                        }
                    } catch (message) {
                        if (developerMode) {
                            console.warn(message);
                        }
                    }
                }
    
                $.watch(".clearfix.toggle-target.item-info-row-container", (description) => {
                    if (creatorId > 1) {
                        $(".clearfix.item-info-row-container:contains('Updated')").remove();
                    }
    
                    description.before(`<div class="clearfix item-info-row-container" data-itemstats="Created"><div class="font-header-1 text-subheader text-label text-overflow row-label">Created</div><span class="type-content">${util.timeFormat(asset.Created)}</span></div>`);
                    description.before(`<div class="clearfix item-info-row-container" data-itemstats="Updated"><div class="font-header-1 text-subheader text-label text-overflow row-label">Updated</div><span class="type-content">${util.timeFormat(asset.Updated)}</span></div>`);
    
                    if (creatorId === authUser.userId) {
                        description.before(`<div class="clearfix item-info-row-container" data-itemstats="Sales"><div class="font-header-1 text-subheader text-label text-overflow row-label">Sales</div><span class="type-content">${asset.Sales.toLocaleString()}</span></div>`);
                    }
                })
        
                if (developerMode) {
                    console.log(asset);
                }

                break;
            }
        }
    }

    $.watch("#item-container", () => {
        let deleteItemButton = $("#delete-item");

        if (deleteItemButton.length >= 1) {
            $.watch("#modal-confirmation > #modal-dialog > .modal-content > .modal-body > .modal-top-body > .modal-message", (warning) => {
                warning.after(`<br> <div class="modal-warning">You will NOT recieve a refund when deleting this item from your inventory. ⚠️</div>`);
            })
        }
    })
}