import http from 'http';
import { URL } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Funkcja asynchroniczna do otwarcia bazy danych
async function openDatabase() {
    return open({
        filename: 'words.db',
        driver: sqlite3.Database
    });
}

// Funkcja asynchroniczna do pobrania wszystkich słów z bazy danych
async function getAllWords(db) {
    const rows = await db.all('SELECT word FROM words');
    return rows.map(row => row.word);
}

// Funkcja asynchroniczna do pobrania lub stworzenia sesji
async function getSession(db, id) {
    const session = await db.get('SELECT words FROM sessions WHERE id = ?', id);
    if (session) {
        return JSON.parse(session.words);
    }
    return null;
}

// Funkcja asynchroniczna do zapisania sesji
async function saveSession(db, id, words) {
    const wordsJson = JSON.stringify(words);
    await db.run('INSERT OR REPLACE INTO sessions (id, words) VALUES (?, ?)', id, wordsJson);
}

const server = http.createServer(async (req, res) => {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    const method = req.method;
    const path = reqUrl.pathname;

    if (path === '/') {
        const id = reqUrl.searchParams.get('id');

        const db = await openDatabase();
        const allWords = await getAllWords(db);

        if (id) {
            // Pobieramy istniejącą sesję
            let sessionWords = await getSession(db, id);

            if (!sessionWords) {
                res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Sesja o podanym id nie istnieje' }));
                await db.close();
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ id, words: sessionWords }));
        } else {
            // Generujemy nowe id i tablicę słów
            const newId = Date.now().toString();
            const shuffledWords = allWords.slice().sort(() => Math.random() - 0.5);
            const randomWords = shuffledWords.slice(0, 20);

            // Zapisujemy sesję w bazie danych
            await saveSession(db, newId, randomWords);

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ id: newId, words: randomWords }));
        }

        await db.close();
    } else if (path === '/replace' && method === 'POST') {
        // Obsługa zamiany słowa
        let body = '';
        req.on('data', chunk => {
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
                let sessionWords = await getSession(db, id);

                if (!sessionWords) {
                    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Sesja o podanym id nie istnieje' }));
                    await db.close();
                    return;
                }

                if (!sessionWords.includes(word)) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Słowo do zamiany nie znajduje się w tablicy' }));
                    await db.close();
                    return;
                }

                // Lista słów, które nie są w tablicy
                const remainingWords = allWords.filter(w => !sessionWords.includes(w));

                if (remainingWords.length === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Brak dostępnych słów do zamiany' }));
                    await db.close();
                    return;
                }

                // Wybieramy losowe słowo do zamiany
                const newWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];

                // Tworzymy nową tablicę z zamienionym słowem
                const updatedWords = sessionWords.map(w => (w === word ? newWord : w));

                // Aktualizujemy sesję w bazie danych
                await saveSession(db, id, updatedWords);

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ id, words: updatedWords }));

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

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Serwer działa pod adresem http://localhost:${PORT}`);
});