import http from 'http';
import { URL } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { WebSocketServer } from 'ws';

const PORT = 3000;

// Funkcja asynchroniczna do otwarcia bazy danych
async function openDatabase() {
    return open({
        filename: 'words.db',
        driver: sqlite3.Database,
    });
}

// Funkcja asynchroniczna do pobrania wszystkich słów z bazy danych
async function getAllWords(db) {
    const rows = await db.all('SELECT word FROM words');
    return rows.map((row) => row.word);
}

// Funkcja asynchroniczna do pobrania sesji
async function getSession(db, id) {
    const session = await db.get(
        'SELECT words, replace_count FROM sessions WHERE id = ?',
        id
    );
    if (session) {
        return {
            words: JSON.parse(session.words),
            replaceCount: session.replace_count,
        };
    }
    return null;
}

// Funkcja asynchroniczna do zapisania sesji
async function saveSession(db, id, words, replaceCount) {
    const wordsJson = JSON.stringify(words);
    await db.run(
        'INSERT OR REPLACE INTO sessions (id, words, replace_count) VALUES (?, ?, ?)',
        id,
        wordsJson,
        replaceCount
    );
}

// Funkcja do tworzenia tablicy ról
function generateRoles() {
    const roleCounts = {
        RedAgent: 7,
        BlueAgent: 6,
        Neutral: 6,
        Assassin: 1,
    };

    let roles = [];

    // Dodawanie ról zgodnie z ilościami
    for (let i = 0; i < roleCounts.RedAgent; i++) {
        roles.push('Red Agent');
    }
    for (let i = 0; i < roleCounts.BlueAgent; i++) {
        roles.push('Blue Agent');
    }
    for (let i = 0; i < roleCounts.Neutral; i++) {
        roles.push('Neutral');
    }
    // Dodanie Zabójcy
    roles.push('Assassin');

    // Tasowanie ról
    roles.sort(() => Math.random() - 0.5);

    return roles;
}

// Tworzenie serwera HTTP
const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    const method = req.method;
    const path = reqUrl.pathname;

    if (path === '/') {
        const id = reqUrl.searchParams.get('id');

        const db = await openDatabase();
        const allWords = await getAllWords(db);

        if (id) {
            // Pobieramy istniejącą sesję
            let session = await getSession(db, id);

            if (!session) {
                res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Sesja o podanym id nie istnieje' }));
                await db.close();
                return;
            }

            const { words: sessionWords } = session;

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ id, words: sessionWords }));
        } else {
            // Generujemy nowe id i tablicę słów z rolami
            const newId = Date.now().toString();
            const shuffledWords = allWords.slice().sort(() => Math.random() - 0.5);
            const randomWords = shuffledWords.slice(0, 20);

            // Generowanie ról
            const roles = generateRoles();

            // Przypisanie ról do słów
            const wordsWithRoles = randomWords.map((word, index) => ({
                word: word,
                role: roles[index],
            }));

            // Inicjalizujemy licznik zamian na 0
            const replaceCount = 0;

            // Zapisujemy sesję w bazie danych
            await saveSession(db, newId, wordsWithRoles, replaceCount);

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ id: newId, words: wordsWithRoles }));
        }

        await db.close();
    } else if (path === '/replace' && method === 'POST') {
        // Obsługa zamiany słowa
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const { id, word } = JSON.parse(body);

                if (!id || !word) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Brak id lub słowa do zamiany' }));
                    return;
                }

                const db = await openDatabase();
                const allWords = await getAllWords(db);

                // Pobieramy istniejącą sesję
                let session = await getSession(db, id);

                if (!session) {
                    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Sesja o podanym id nie istnieje' }));
                    await db.close();
                    return;
                }

                const { words: sessionWords, replaceCount } = session;

                if (replaceCount >= 3) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(
                        JSON.stringify({
                            error: 'Limit zamian słów został wyczerpany dla tej sesji',
                        })
                    );
                    await db.close();
                    return;
                }

                const wordIndex = sessionWords.findIndex((w) => w.word === word);

                if (wordIndex === -1) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(
                        JSON.stringify({ error: 'Słowo do zamiany nie znajduje się w tablicy' })
                    );
                    await db.close();
                    return;
                }

                // Lista słów, które nie są w tablicy
                const usedWords = sessionWords.map((w) => w.word);
                const remainingWords = allWords.filter((w) => !usedWords.includes(w));

                if (remainingWords.length === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Brak dostępnych słów do zamiany' }));
                    await db.close();
                    return;
                }

                // Wybieramy losowe słowo do zamiany
                const newWord =
                    remainingWords[Math.floor(Math.random() * remainingWords.length)];

                // Zamieniamy słowo, ale zachowujemy jego rolę
                const updatedWords = [...sessionWords];
                updatedWords[wordIndex] = {
                    word: newWord,
                    role: sessionWords[wordIndex].role,
                };

                // Zwiększamy licznik zamian
                const newReplaceCount = replaceCount + 1;

                // Aktualizujemy sesję w bazie danych
                await saveSession(db, id, updatedWords, newReplaceCount);

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ id, words: updatedWords }));

                // **NOWOŚĆ**: Wysyłamy aktualizację do wszystkich klientów w sesji
                broadcastToSession(id, {
                    type: 'sessionUpdate',
                    id,
                    words: updatedWords,
                });

                await db.close();
            } catch (error) {
                console.error('Błąd podczas przetwarzania żądania:', error);
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const sessionsClients = new Map();

const wss = new WebSocketServer({ server });

function broadcastToSession(sessionId, message) {
    const clients = sessionsClients.get(sessionId);
    if (clients) {
        const messageString = JSON.stringify(message);
        clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(messageString);
            }
        });
    }
}

wss.on('connection', (ws) => {
    console.log('Nowe połączenie WebSocket');

    // Zmienna przechowująca id sesji, do której klient dołączył
    let joinedSessionId = null;

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);

            const db = await openDatabase();

            if (data.type === 'join') {
                // Klient dołącza do sesji
                const { id, username } = data;

                const session = await getSession(db, id);

                if (session) {
                    // Dodaj klienta do listy klientów w sesji
                    if (!sessionsClients.has(id)) {
                        sessionsClients.set(id, new Set());
                    }
                    sessionsClients.get(id).add(ws);
                    joinedSessionId = id;

                    ws.send(
                        JSON.stringify({
                            type: 'session',
                            id,
                            words: session.words,
                        })
                    );

                    broadcastToSession(id, {
                        type: 'newConnect',
                        username
                    });

                } else {
                    ws.send(
                        JSON.stringify({
                            type: 'error',
                            message: 'Sesja o podanym id nie istnieje',
                        })
                    );
                }

                await db.close();
            } else if (data.type === 'start') {
                // Generowanie nowej sesji
                const allWords = await getAllWords(db);
                const newId = Date.now().toString();
                const shuffledWords = allWords.slice().sort(() => Math.random() - 0.5);
                const randomWords = shuffledWords.slice(0, 20);

                // Generowanie ról
                const roles = generateRoles();

                // Przypisanie ról do słów
                const wordsWithRoles = randomWords.map((word, index) => ({
                    word: word,
                    role: roles[index],
                }));

                const replaceCount = 0;

                await saveSession(db, newId, wordsWithRoles, replaceCount);

                await db.close();
            } else if (data.type === 'getSession') {
                // Pobieranie istniejącej sesji
                const { id } = data;

                const session = await getSession(db, id);

                if (session) {
                    ws.send(
                        JSON.stringify({
                            type: 'session',
                            id,
                            words: session.words,
                        })
                    );
                } else {
                    ws.send(
                        JSON.stringify({
                            type: 'error',
                            message: 'Sesja o podanym id nie istnieje',
                        })
                    );
                }

                await db.close();
            } else if (data.type === 'replace') {
                // Zamiana słowa w sesji
                const { id, word } = data;

                const allWords = await getAllWords(db);
                const session = await getSession(db, id);

                if (!session) {
                    ws.send(
                        JSON.stringify({
                            type: 'error',
                            message: 'Sesja o podanym id nie istnieje',
                        })
                    );
                    await db.close();
                    return;
                }

                const { words: sessionWords, replaceCount } = session;

                if (replaceCount >= 3) {
                    ws.send(
                        JSON.stringify({
                            type: 'error',
                            message: 'Limit zamian słów został wyczerpany dla tej sesji',
                        })
                    );
                    await db.close();
                    return;
                }

                const wordIndex = sessionWords.findIndex((w) => w.word === word);

                if (wordIndex === -1) {
                    ws.send(
                        JSON.stringify({
                            type: 'error',
                            message: 'Słowo do zamiany nie znajduje się w tablicy',
                        })
                    );
                    await db.close();
                    return;
                }

                const usedWords = sessionWords.map((w) => w.word);
                const remainingWords = allWords.filter((w) => !usedWords.includes(w));

                if (remainingWords.length === 0) {
                    ws.send(
                        JSON.stringify({
                            type: 'error',
                            message: 'Brak dostępnych słów do zamiany',
                        })
                    );
                    await db.close();
                    return;
                }

                const newWord =
                    remainingWords[Math.floor(Math.random() * remainingWords.length)];

                const updatedWords = [...sessionWords];
                updatedWords[wordIndex] = {
                    word: newWord,
                    role: sessionWords[wordIndex].role,
                };

                const newReplaceCount = replaceCount + 1;

                await saveSession(db, id, updatedWords, newReplaceCount);

                // Wysyłamy aktualizację do wszystkich klientów w sesji
                broadcastToSession(id, {
                    type: 'sessionUpdate',
                    id,
                    words: updatedWords,
                });

                await db.close();
            } else {
                ws.send(
                    JSON.stringify({
                        type: 'error',
                        message: 'Nieznany typ wiadomości',
                    })
                );
            }
        } catch (error) {
            console.error('Błąd podczas przetwarzania wiadomości WebSocket:', error);
            ws.send(
                JSON.stringify({
                    type: 'error',
                    message: 'Błąd serwera',
                })
            );
        }
    });

    ws.on('close', () => {
        console.log('Połączenie WebSocket zostało zamknięte');

        // Usuwamy klienta z listy klientów w sesji
        if (joinedSessionId && sessionsClients.has(joinedSessionId)) {
            sessionsClients.get(joinedSessionId).delete(ws);
            if (sessionsClients.get(joinedSessionId).size === 0) {
                sessionsClients.delete(joinedSessionId);
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Serwer działa pod adresem http://localhost:${PORT}`);
});
