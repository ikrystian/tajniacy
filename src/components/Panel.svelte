<script>
    import { onMount } from 'svelte';

    let ws;
    let currentSessionId = '';
    let words = [];
    let sessionIdInput = '';
    let wordToReplace = '';
    let output = '';

    function log(message) {
        output += message + '\n';
    }

    function connectWebSocket() {
        ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            log('Połączono z serwerem WebSocket.');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Otrzymano wiadomość:', data);

            if (data.type === 'session') {
                currentSessionId = data.id;
                words = data.words;
                log(`Dołączono do sesji: ${currentSessionId}`);
                log(`Słowa: ${JSON.stringify(words, null, 2)}`);
            } else if (data.type === 'sessionUpdate') {
                words = data.words;
                log('Aktualizacja sesji:');
                log(`Słowa: ${JSON.stringify(words, null, 2)}`);
            } else if (data.type === 'error') {
                log(`Błąd: ${data.message}`);
            }
        };

        ws.onclose = () => {
            log('Połączenie WebSocket zostało zamknięte.');
        };

        ws.onerror = (error) => {
            console.error('Błąd WebSocket:', error);
            log('Błąd WebSocket. Sprawdź konsolę.');
        };
    }

    function joinSession() {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'join', id: sessionIdInput }));
        } else {
            log('Połączenie WebSocket nie jest otwarte.');
        }
    }

    function startSession() {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({type: 'start'}));
        } else {
            log('Połączenie WebSocket nie jest otwarte.');
        }
    }

    function replaceWord() {
        if (currentSessionId && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({type: 'replace', id: currentSessionId, word: wordToReplace}));
        } else {
            log('Nie jesteś połączony z żadną sesją lub połączenie WebSocket nie jest otwarte.');
        }
    }

    onMount(() => {
        connectWebSocket();
    });
</script>

<style>
    .container {
        font-family: Arial, sans-serif;
        margin: 20px;
    }

    .log {
        white-space: pre-wrap;
        background-color: #f0f0f0;
        padding: 10px;
        border-radius: 4px;
        height: 200px;
        overflow-y: auto;
    }

    .words-list {
        list-style-type: none;
        padding: 0;
    }

    .words-list li {
        margin: 5px 0;
    }

    .word {
        font-weight: bold;
    }

    .role {
        color: gray;
    }
</style>

<div class="container">
    <h1>Klient WebSocket w Svelte</h1>

    <div>
        <label for="sessionIdInput">ID Sesji:</label>
        <input type="text" id="sessionIdInput" bind:value="{sessionIdInput}">
        <button on:click="{joinSession}">Dołącz do sesji</button>
        <button on:click="{startSession}">Rozpocznij nową sesję</button>
    </div>

    <div>
        <label for="wordToReplace">Słowo do zamiany:</label>
        <input type="text" id="wordToReplace" bind:value="{wordToReplace}">
        <button on:click="{replaceWord}">Zamień słowo</button>
    </div>

    {#if words.length > 0}
        <h2>Słowa w sesji:</h2>
        <ul class="words-list">
            {#each words as item}
                <li>
                    <span class="word">{item.word}</span> - <span class="role">{item.role}</span>
                </li>
            {/each}
        </ul>
    {/if}

    <h2>Log:</h2>
    <div class="log">{output}</div>
</div>