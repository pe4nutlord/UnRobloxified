"use strict"

pages.games = async (gameId) => {
    if (settings.get("theme", "changeBackToGames")) {
        $.watch(".text-label.text-overflow.font-caption-header:contains('Active')", (selector) => {
            selector[0].innerText = "Playing";
        })

        $.watch(".text-label.text-overflow.font-caption-header:contains('Server Size')", (selector) => {
            selector[0].innerText = "Max Players";
        })

        $.watch("#rbx-game-passes > .container-header > h3", (selector) => {
            selector[0].innerText = "Game Passes";
        })
    }

    const authUser = await util.getAuthUser();

    if (developerMode || (authUser.userId === 531629183)) {
        try {
            $.watch("#game-detail-meta-data", () => {
                const universeId = document.querySelector("#game-detail-meta-data").dataset.universeId;
    
                console.log(`UniverseId: ${universeId || "Unknown"}`);
    
                robloxify.get(`https://develop.roblox.com/v1/universes/${universeId}/places`, {sortOrder: "Asc", limit: 100}).then((response) => {
                    console.log("Places associated with this game:");
                    console.log(response?.data || "Unknown");
                })
            })
        } catch (error) {
            console.log(error);
        }
    }
}