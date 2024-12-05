<script>
    import { onMount } from 'svelte';

    let ws;
    let currentSessionId = '';
    let words = [];
    let wordToReplace = '';
    let output = '';
    export let id;
    function log(message) {
        output += message + '\n';
        console.log(message)
    }

    function logAction(message) {
        ws.send(JSON.stringify({ type: 'log', id, message }));
    }

    function connectWebSocket() {
        ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            log('Połączono z serwerem WebSocket.');
            ws.send(JSON.stringify({ type: 'join', id, username: localStorage.getItem('username') }));
        };

        ws.onmessage = (event) => {
            console.log(event);
            const data = JSON.parse(event.data);
            console.log('Otrzymano wiadomość:', data);
            
            if (data.type === 'session') {
                currentSessionId = data.id;
                words = data.words;
                log(`Dołączono do sesji: ${currentSessionId}`);
                // log(`Słowa: ${JSON.stringify(words, null, 2)}`);
            } else if (data.type === 'sessionUpdate') {
                words = data.words;
                log('Aktualizacja sesji:');
                log(`Słowa: ${JSON.stringify(words, null, 2)}`);
            } else if (data.type === 'newConnect') {
                log(`Do sesji dołączył: ${data.username}`);
            } else if (data.type==='log') {
                log(data.message);
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

    function replaceWord(word) {
        const confirmed = confirm(`Are you sure you want to replace the word "${word}"?`);
        if (confirmed) {
            if (currentSessionId && ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'replace', id: currentSessionId, word }));
            } else {
                log('Nie jesteś połączony z żadną sesją lub połączenie WebSocket nie jest otwarte.');
            }
        } else {
            log('Zamiana słowa została anulowana.');
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

    .replace-word {
        opacity: 0;
        margin-left: 0.5rem;
        pointer-events: none;
    }

    li:hover .replace-word {
        opacity: 1;
        pointer-events: all
    }
</style>

<div class="container">
    <h1>Poczekalnia</h1>


    {#if words.length > 0}
        <h2>Słowa w sesji:</h2>
        <ul class="words-list">
            {#each words as item}
                <li>
                    <span class="word">{item.word}</span> - <span class="role">{item.role}</span> <button class="replace-word" on:click={() => { replaceWord(item.word) }}>Wymień słowo</button>
                </li>
            {/each}
        </ul>
    {/if}


    <h2>Log:</h2>
    <div class="log">{output}</div>
</div>