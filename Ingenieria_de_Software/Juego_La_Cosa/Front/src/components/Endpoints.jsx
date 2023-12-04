export const API_BASE_URL = 'http://127.0.0.1:8000';

function postBody(data) {
    console.log('postBody', data)
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };
}

function getBody(data) {
    return {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };
}

/* ~~~~~~~~~~~~~~~~ USER FUNCTIONS ~~~~~~~~~~~~~~~~*/
    /* ~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~*/

export async function createUser(userName) {
    const url = `${API_BASE_URL}/create_user`;
    const parameters = { 
        user_name: userName,
    }
    const response = await fetch(url, postBody(parameters));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function createLobby(lobbyName, minPlayers, maxPlayers, password, hostName) {
    const url = `${API_BASE_URL}/create_lobby/`;
    const parameters = {
        lobby_name: lobbyName,
        min_players: minPlayers,
        max_players: maxPlayers,
        password: password,
        host_name: hostName,
    };
    //console.log('createLobby', parameters)
    const response = await fetch(url, postBody(parameters));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    //console.log('createLobby resp', data)
    return data;
}

export async function joinLobby(lobbyName, playerName, password) {
    const url = `${API_BASE_URL}/join_lobby/`;
    const parameters = {
        lobby_name: lobbyName,
        password: password,
        user_name: playerName,
    };
    //console.log('joinLobby', parameters)
    const response = await fetch(url, postBody(parameters));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    //console.log('joinLobby resp', data)
    return data;
}

    /* ~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~*/

export async function isUserExist(userName) {
    const url = `${API_BASE_URL}/is_user_exist/${userName}`;
    const response = await fetch(url, getBody());
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data.exist;
}

export async function isGameStarted (lobbyName) {
    const url = `${API_BASE_URL}/is_game_started/${lobbyName}`;
    const response = await fetch(url, getBody());
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function isLobbyExist(lobbyName) {
    const url = `${API_BASE_URL}/is_lobby_exist/${lobbyName}`;
    const response = await fetch(url, getBody());
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data.exist;
}

export async function getJoinableLobbies() {
    const url = `${API_BASE_URL}/joinable_lobbies/`;
    const response = await fetch(url, getBody());
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function getLobbyPlayers(lobby_name) {
    const url = `${API_BASE_URL}/lobby_users/${lobby_name}/`;
    const response = await fetch(url, getBody());
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

/* ~~~~~~~~~~~~~~~~ PLAYER FUNCTIONS ~~~~~~~~~~~~~~~~*/
    /* ~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~*/

export async function leaveLobby(playerName, lobbyName) {
    const url = `${API_BASE_URL}/leave_lobby/`;
    const parameters = {
        lobby_name: lobbyName,
        user_name: playerName,
    };
    const response = await fetch(url, postBody(parameters));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}
    
export async function notifyReady(playerName, lobbyName) {
    const url = `${API_BASE_URL}/ready/`;
    const parameters = {
        lobby_name: lobbyName,
        user_name: playerName,
    };
    const response = await fetch(url, postBody(parameters));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function playCard(playerName, lobbyName, cardElim, objectivePlayer) {
    const url = `${API_BASE_URL}/play_card/`;
    const parameters = {
        lobby_name: lobbyName,
        user_name: playerName,
        target_user_name: objectivePlayer,
        card_id: cardElim,
    };
    const response = await fetch(url, postBody(parameters));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function discardCard(playerName, lobbyName, cardElim) {
    const url = `${API_BASE_URL}/discard_card/`;
    const parameters = {
        lobby_name: lobbyName,
        user_name: playerName,
        card_id: cardElim,
    };
    const response = await fetch(url, postBody(parameters));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function startGame(playerName, lobbyName) {
    console.log('startGame');
    const url = `${API_BASE_URL}/start_game/`;
    const parameters = {
        lobby_name: lobbyName,
        user_name: playerName,
    };
    const response = await fetch(url, postBody(parameters));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function endGame(playerName, lobbyName) {
    const url = `${API_BASE_URL}/end_game/`;
    const parameters = {
        lobby_name: lobbyName,
        user_name: playerName,
    };
    const response = await fetch(url, postBody(parameters));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function defendPlay(playerName, lobbyName, choiceBoolean) {
    const url = `${API_BASE_URL}/defend_or_skip/`;
    const playerChoice = (choiceBoolean) ? 'defense' : 'skip'; // true => defend, false => skip
    const parameters = {
        lobby_name: lobbyName,
        user_name: playerName,
        choice: playerChoice,
    };
    const response = await fetch(url, postBody(parameters));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function defendExchange(playerName, lobbyName, choiceBoolean) {
    const url = `${API_BASE_URL}/defend_or_exchange/`;
    const playerChoice = (choiceBoolean) ? "defense" : "exchange"; // true => defend, false => exchange
    const parameters = {
        lobby_name: lobbyName,
        user_name: playerName,
        choice: playerChoice,
    };
    const response = await fetch(url, postBody(parameters));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function defenseCard(playerName, lobbyName, card) {
    const url = `${API_BASE_URL}/defense_card/`;
    const parameters = {
        lobby_name: lobbyName,
        user_name: playerName,
        card_id: card,
    };
    const response = await fetch(url, postBody(parameters));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function swapCard(playerName, lobbyName, objectivePlayer, card) {
    const url = `${API_BASE_URL}/swap_card/`;
    const parameters = {
        lobby_name: lobbyName,
        user_name: playerName,
        target_user_name: objectivePlayer,
        card_id: card,
    };
    const response = await fetch(url, postBody(parameters));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}


    /* ~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~*/

export async function stealCardFromDeck(playerName, lobbyName) {
    const url = `${API_BASE_URL}/steal_card/`;
    const parameters = {
        lobby_name: lobbyName,
        user_name: playerName,
    };
    const response = await fetch(url, postBody(parameters));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function getUserHand(playerName, lobbyName) {
    const url = `${API_BASE_URL}/user_hand/${lobbyName}/${playerName}`;
    const response = await fetch(url, getBody());
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function getUserCardsInfo(lobby_name, player_name) {
    const url = `${API_BASE_URL}/user_cards_info/${lobby_name}/${player_name}`;
    const response = await fetch(url, getBody());
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function getUsersPosition(lobbyName) {
    const url = `${API_BASE_URL}/users_position/${lobbyName}`;

    const response = await fetch(url, getBody());
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    return data;
}

export async function getUserRole(playerName, lobbyName) {
    const url = `${API_BASE_URL}/get_user_role/${lobbyName}/${playerName}/`;
    const response = await fetch(url, getBody());
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail);
    }
    console.log('getUserRole', data)
    return data.role; // {'role': role}
}

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Websocket ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export function websocketManager(parameters) {
    var ws = null;
    console.log('connecting...');
    var ws = new WebSocket(`ws://127.0.0.1:8000${parameters}`);
    ws.onopen = (event) => {
        console.log('connected');
    };
    ws.onclose = (event) => {
        console.log('disconnected');
    };
    return ws;
}