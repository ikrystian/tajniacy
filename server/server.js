import http from 'http';
import seedrandom from 'seedrandom';
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

// Funkcja do generowania losowych słów na podstawie ziarna
function generateWords(words, seed, count = 20) {
    const rng = seedrandom(seed);
    const shuffledWords = words.slice().sort(() => rng() - 0.5);
    return shuffledWords.slice(0, count);
}

const server = http.createServer(async (req, res) => {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    const method = req.method;
    const path = reqUrl.pathname;

    if (path === '/') {
        // Endpoint główny, obsługuje GET z opcjonalnym parametrem id
        const id = reqUrl.searchParams.get('id');

        const db = await openDatabase();
        const words = await getAllWords(db);
        await db.close();

        if (id) {
            // Jeśli podano id, odtwarzamy tablicę
            const randomWords = generateWords(words, id);

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ id, words: randomWords }));
        } else {
            // Jeśli nie podano id, generujemy nowe id
            const newId = Date.now().toString();
            const randomWords = generateWords(words, newId);

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ id: newId, words: randomWords }));
        }
    } else if (path === '/replace' && method === 'POST') {
        // Endpoint do zamiany słowa, oczekuje na POST z id i word
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
                await db.close();

                // Odtwarzamy pierwotną tablicę
                const originalWords = generateWords(allWords, id);

                if (!originalWords.includes(word)) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Słowo do zamiany nie znajduje się w tablicy' }));
                    return;
                }

                // Lista słów, które nie są w tablicy
                const remainingWords = allWords.filter(w => !originalWords.includes(w));

                if (remainingWords.length === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Brak dostępnych słów do zamiany' }));
                    return;
                }

                // Wybieramy losowe słowo do zamiany
                const rng = seedrandom();
                const newWord = remainingWords[Math.floor(rng() * remainingWords.length)];

                // Tworzymy nową tablicę z zamienionym słowem
                const updatedWords = originalWords.map(w => (w === word ? newWord : w));

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ id, words: updatedWords }));
            } catch (error) {
                console.error('Błąd podczas przetwarzania żądania:', error);
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    } else {
        // Obsługa nieznanych endpointów
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Serwer działa pod adresem http://localhost:${PORT}`);
});