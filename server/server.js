import http from 'http';
import seedrandom from 'seedrandom';
import {URL} from 'url';
import sqlite3 from 'sqlite3';
import {open} from 'sqlite';

async function openDatabase() {
    return open({
        filename: 'words.db',
        driver: sqlite3.Database
    });
}

async function getAllWords(db) {
    const rows = await db.all('SELECT word FROM words');
    return rows.map(row => row.word);
}

const server = http.createServer(async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');

        const reqUrl = new URL(req.url, `http://${req.headers.host}`);
        const id = reqUrl.searchParams.get('id');

        const db = await openDatabase();
        const words = await getAllWords(db);
        await db.close();

        const generateWords = (seed) => {
            const rng = seedrandom(seed);
            const shuffledWords = words.slice().sort(() => rng() - 0.5);
            return shuffledWords.slice(0, 20);
        };

        if (reqUrl.pathname === '/') {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});

            if (id) {
                const randomWords = generateWords(id);

                res.end(JSON.stringify({id, words: randomWords}));
            } else {
                const newId = Date.now().toString();
                const randomWords = generateWords(newId);

                res.end(JSON.stringify({id: newId, words: randomWords}));
            }
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    } catch (error) {
        console.error('Server error', error);
        res.writeHead(500);
        res.end('Internal Server Error');
    }
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server working on  http://localhost:${PORT}`);
});

