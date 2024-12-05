import http from 'http';
import seedrandom from 'seedrandom';
import {URL} from 'url';

const words = [

];

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    const id = reqUrl.searchParams.get('id');

    // Funkcja do generowania losowych słów na podstawie ziarna
    const generateWords = (seed) => {
        const rng = seedrandom(seed);
        const shuffledWords = words.slice().sort(() => rng() - 0.5);
        return shuffledWords.slice(0, 20);
    };

    if (reqUrl.pathname === '/') {
        if (id) {
            const randomWords = generateWords(id);

            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify({id, words: randomWords}));
        } else {
            const newId = Date.now().toString();
            const randomWords = generateWords(newId);

            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify({id: newId, words: randomWords}));
        }
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Serwer działa pod adresem http://localhost:${PORT}`);
});