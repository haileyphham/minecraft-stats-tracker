let currentPlayerData = null;

async function fetchPlayerStats(identifier) {
    try {
        let url = '';

        // Check if the identifier looks like a UUID
        if (identifier.length === 32 && /^[0-9a-fA-F]{32}$/.test(identifier)) {
            url = `https://api.hypixel.net/player?key=4c143b23-3f94-4638-8101-561050096c94&uuid=${identifier}`;
        } else {
            url = `https://api.hypixel.net/player?key=4c143b23-3f94-4638-8101-561050096c94&name=${identifier}`;
        }

        console.log('Request URL:', url);  // Log the request URL for debugging

        const response = await fetch(url);
        const data = await response.json();

        console.log('Response data:', data);  // Log the full response

        // Check for API success
        if (data.success) {
            document.querySelector('.main-container').style.display = 'grid';
            currentPlayerData = data;
            displayGeneralStats(data);
            updateGameStats(data);
            renderPlayerSkin(data.player.uuid);
        } else {
            // Player not found or invalid input
            console.error('Error: Player not found or invalid input');
            document.getElementById('player-stats').innerHTML = '<p>Player not found or invalid input.</p>';
            document.getElementById('game-stats').innerHTML = '';
            document.getElementById('skin-image').style.display = 'none';
            currentPlayerData = null;
        }
    } catch (error) {
        console.error('Error fetching player stats:', error);
        document.getElementById('player-stats').innerHTML = '<p>There was an error retrieving player stats. Please try again later.</p>';
        document.getElementById('game-stats').innerHTML = '';
        document.getElementById('skin-image').style.display = 'none';
        currentPlayerData = null;
    }
}

function renderPlayerSkin(uuid) {
    const skinImage = document.getElementById('skin-image');
    if (uuid) {
        const skinUrl = `https://crafatar.com/renders/body/${uuid}?size=128&overlay`;
        skinImage.src = skinUrl;
        skinImage.style.display = 'block';
    } else {
        skinImage.style.display = 'none';
    }
}

function displayGeneralStats(stats) {
    const statsContainer = document.getElementById('player-stats');
    const player = stats.player;

    statsContainer.innerHTML = `
        <h2>Player Stats</h2>
        <p><strong>Name:</strong> ${player.displayname}</p>
        <p><strong>UUID:</strong> ${player.uuid}</p>
        <p><strong>Rank:</strong> ${player.rank || 'No rank'}</p>
        <p><strong>Level:</strong> ${player.networkLevel || 'No level'}</p>
        <p><strong>First Login:</strong> ${new Date(player.firstLogin).toLocaleString()}</p>
        <p><strong>Last Login:</strong> ${new Date(player.lastLogin).toLocaleString()}</p>
    `;
}

function updateGameStats(stats) {
    const gameStatsContainer = document.getElementById('game-stats');
    const gameType = document.getElementById('game-type').value;
    const player = stats.player;

    if (gameType && player.stats && player.stats[gameType]) {
        const selectedGameStats = player.stats[gameType];
        gameStatsContainer.innerHTML = `
            <h3>${gameType} Stats</h3>
            <p><strong>Wins:</strong> ${selectedGameStats.wins || 0}</p>
            <p><strong>Losses:</strong> ${selectedGameStats.losses || 0}</p>
            <p><strong>K/D Ratio:</strong> ${((selectedGameStats.kills || 0) / (selectedGameStats.deaths || 1)).toFixed(2)}</p>
        `;
        if (gameType === 'Duels') {
            gameStatsContainer.classList.add('duel-stats'); // Adds duel-stats class for centering below stats
        }
    } else if (gameType) {
        gameStatsContainer.innerHTML = `<p>No stats available for ${gameType}</p>`;
    } else {
        gameStatsContainer.innerHTML = '';
    }
}

// Handle search button click
document.getElementById('search-btn').addEventListener('click', () => {
    const searchInput = document.getElementById('search-input').value.trim();
    if (searchInput) {
        fetchPlayerStats(searchInput);
    } else {
        alert('Please enter a player name or UUID.');
    }
});

// Handle Enter key press for search
document.getElementById('search-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const searchInput = document.getElementById('search-input').value.trim();
        if (searchInput) {
            fetchPlayerStats(searchInput);
        } else {
            alert('Please enter a player name or UUID.');
        }
    }
});

// Handle game type change
document.getElementById('game-type').addEventListener('change', () => {
    if (currentPlayerData) {
        updateGameStats(currentPlayerData);
    }
});
