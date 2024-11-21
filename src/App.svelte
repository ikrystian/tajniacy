<script>
    import {onMount} from "svelte";

    let socket;
    const accessKey = 'U4ihy6aaUwyN-kkeN_JMpC9A6HN3432FQmym_eAjc-E';
    let endplay = false;

    async function getFirstUnsplashPhotoByTag(tag) {
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${tag}&per_page=1`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Client-ID ${accessKey}`,
                },
            });

            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const firstPhoto = data.results[0];
                return firstPhoto.urls.full; // Return the URL of the first photo
            } else {
                console.log('No images found for the specified tag.');
                return null;
            }
        } catch (error) {
            console.error('Error fetching data from Unsplash API:', error);
            return null;
        }
    }

    const words = [
        'cat',
        'dog',
        'car',
        'house',
        'tree',
        'sun',
        'moon',
        'star',
        'river',
        'sea',
        'mountain',
        'forest',
        'city',
        'village',
        'school',
        'office',
        'table',
        'chair',
        'computer',
        'phone',
        'coffee',
        'tea',
        'bread',
        'cheese',
        'butter',
        'milk',
        'egg',
        'fish',
        'meat',
        'vegetables',
        'fruits',
        'cake',
        'ice cream',
        'sugar',
        'salt',
        'pepper',
        'soup',
        'pasta',
        'pizza',
        'hamburger',
        'sandwich',
        'salad',
        'dessert',
        'wine',
        'beer',
        'water',
        'juice',
        'drink',
        'flower',
        'bush',
        'grass',
        'stone',
        'sand',
        'snow',
        'rain',
        'wind',
        'storm',
        'tornado',
        'avalanche',
        'winter',
        'spring',
        'summer',
        'autumn',
        'child',
        'man',
        'woman',
        'family',
        'friend',
        'neighbor',
        'teacher',
        'student',
        'teenager',
        'adult',
        'elder',
        'music',
        'movie',
        'book',
        'pictures',
        'theater',
        'dance',
        'sport',
        'ball',
        'basketball',
        'volleyball',
        'tennis',
        'boxing',
        'racing',
        'chess',
        'game',
        'play',
        'competition',
        'tournament',
        'match',
        'lesson',
        'class',
        'science',
        'knowledge',
        'technology',
        'internet',
        'programming',
        'code',
        'application',
        'website',
        'graphics',
        'photo',
        'instrument',
        'piano',
        'guitar',
        'drums',
        'flute',
        'trumpet',
        'orchestra',
        'concert',
        'festival',
        'party',
        'birthday',
        'holiday',
        'vacation',
        'travel',
        'airport',
        'airplane',
        'train',
        'bus',
        'ship',
        'bicycle',
        'walk',
        'hike',
        'trip',
        'camping',
        'camp',
        'beach',
        'mountains',
        'park',
        'garden',
        'zoo',
        'ocean',
        'island',
        'culture',
        'tradition',
        'custom',
        'ritual',
        'love',
        'respect',
        'trust',
        'support',
        'help',
        'happiness',
        'joy',
        'sadness',
        'anger',
        'fear',
        'hope',
        'dream',
        'goal',
        'work',
        'career',
        'company',
        'project',
        'salary',
        'savings',
        'expenses',
        'budget',
        'trade',
        'shop',
        'advertisement',
        'marketing',
        'client',
        'analysis',
        'innovation',
        'partnership',
        'meeting',
        'discussion',
        'opinion',
        'argument',
        'history',
        'present',
        'future',
        'century',
        'civilization',
        'literature',
        'exhibition',
        'museum',
        'statistics',
        'experiment',
        'theory',
        'concept',
        'creativity',
        'success',
        'progress',
        'revolution',
        'trends',
        'predictions',
        'risks',
        'intelligence',
        'talent',
        'education',
        'information',
        'perspective',
        'transformation',
        'result',
        'effect'
    ];

    const translationMap = {
        'cat': 'kot',
        'dog': 'pies',
        'car': 'samochód',
        'house': 'dom',
        'tree': 'drzewo',
        'sun': 'słońce',
        'moon': 'księżyc',
        'star': 'gwiazda',
        'river': 'rzeka',
        'sea': 'morze',
        'mountain': 'góra',
        'forest': 'las',
        'city': 'miasto',
        'village': 'wieś',
        'school': 'szkoła',
        'office': 'biuro',
        'table': 'stół',
        'chair': 'krzesło',
        'computer': 'komputer',
        'phone': 'telefon',
        'coffee': 'kawa',
        'tea': 'herbata',
        'bread': 'chleb',
        'cheese': 'ser',
        'butter': 'masło',
        'milk': 'mleko',
        'egg': 'jajko',
        'fish': 'ryba',
        'meat': 'mięso',
        'vegetables': 'warzywa',
        'fruits': 'owoce',
        'cake': 'ciasto',
        'ice cream': 'lody',
        'sugar': 'cukier',
        'salt': 'sól',
        'pepper': 'pieprz',
        'soup': 'zupa',
        'pasta': 'makaron',
        'pizza': 'pizza',
        'hamburger': 'hamburger',
        'sandwich': 'kanapka',
        'salad': 'sałatka',
        'dessert': 'deser',
        'wine': 'wino',
        'beer': 'piwo',
        'water': 'woda',
        'juice': 'sok',
        'drink': 'napój',
        'flower': 'kwiat',
        'bush': 'krzew',
        'grass': 'trawa',
        'stone': 'kamień',
        'sand': 'piasek',
        'snow': 'śnieg',
        'rain': 'deszcz',
        'wind': 'wiatr',
        'storm': 'burza',
        'tornado': 'tornado',
        'avalanche': 'lawina',
        'winter': 'zima',
        'spring': 'wiosna',
        'summer': 'lato',
        'autumn': 'jesień',
        'child': 'dziecko',
        'man': 'mężczyzna',
        'woman': 'kobieta',
        'family': 'rodzina',
        'friend': 'przyjaciel',
        'neighbor': 'sąsiad',
        'teacher': 'nauczyciel',
        'student': 'uczeń',
        'teenager': 'nastolatek',
        'adult': 'dorosły',
        'elder': 'starzec',
        'music': 'muzyka',
        'movie': 'film',
        'book': 'książka',
        'pictures': 'obrazy',
        'theater': 'teatr',
        'dance': 'taniec',
        'sport': 'sport',
        'ball': 'piłka',
        'basketball': 'koszykówka',
        'volleyball': 'siatkówka',
        'tennis': 'tenis',
        'boxing': 'boks',
        'racing': 'wyścigi',
        'chess': 'szachy',
        'game': 'gra',
        'play': 'zabawa',
        'competition': 'zawody',
        'tournament': 'turniej',
        'match': 'mecz',
        'lesson': 'lekcja',
        'class': 'klasa',
        'science': 'nauka',
        'knowledge': 'wiedza',
        'technology': 'technologia',
        'internet': 'internet',
        'programming': 'programowanie',
        'code': 'kod',
        'application': 'aplikacja',
        'website': 'strona',
        'graphics': 'grafika',
        'photo': 'zdjęcie',
        'instrument': 'instrument',
        'piano': 'piano',
        'guitar': 'gitara',
        'drums': 'perkusja',
        'flute': 'flet',
        'trumpet': 'trąbka',
        'orchestra': 'orkiestra',
        'concert': 'koncert',
        'festival': 'festiwal',
        'party': 'impreza',
        'birthday': 'urodziny',
        'holiday': 'święto',
        'vacation': 'wakacje',
        'travel': 'podróż',
        'airport': 'lotnisko',
        'airplane': 'samolot',
        'train': 'pociąg',
        'bus': 'autobus',
        'ship': 'statek',
        'bicycle': 'rower',
        'walk': 'spacer',
        'hike': 'wędrówka',
        'trip': 'wycieczka',
        'camping': 'kemping',
        'camp': 'biwak',
        'beach': 'plaża',
        'mountains': 'góry',
        'park': 'park',
        'garden': 'ogród',
        'zoo': 'zoo',
        'ocean': 'ocean',
        'island': 'wyspa',
        'culture': 'kultura',
        'tradition': 'tradycja',
        'custom': 'zwyczaj',
        'ritual': 'obrzęd',
        'love': 'miłość',
        'respect': 'szacunek',
        'trust': 'zaufanie',
        'support': 'wsparcie',
        'help': 'pomoc',
        'happiness': 'szczęście',
        'joy': 'radość',
        'sadness': 'smutek',
        'anger': 'złość',
        'fear': 'strach',
        'hope': 'nadzieja',
        'dream': 'marzenie',
        'goal': 'cel',
        'work': 'praca',
        'career': 'kariera',
        'company': 'firma',
        'project': 'projekt',
        'salary': 'wynagrodzenie',
        'savings': 'oszczędności',
        'expenses': 'wydatki',
        'budget': 'budżet',
        'trade': 'handel',
        'shop': 'sklep',
        'advertisement': 'reklama',
        'marketing': 'marketing',
        'client': 'klient',
        'analysis': 'analiza',
        'innovation': 'innowacja',
        'partnership': 'partnerstwo',
        'meeting': 'spotkanie',
        'discussion': 'dyskusja',
        'opinion': 'opinia',
        'argument': 'argument',
        'history': 'historia',
        'present': 'teraźniejszość',
        'future': 'przyszłość',
        'century': 'wiek',
        'civilization': 'cywilizacja',
        'literature': 'literatura',
        'exhibition': 'wystawa',
        'museum': 'muzeum',
        'statistics': 'statystyki',
        'experiment': 'eksperyment',
        'theory': 'teoria',
        'concept': 'koncepcja',
        'creativity': 'twórczość',
        'success': 'osiągnięcie',
        'progress': 'postęp',
        'revolution': 'rewolucja',
        'trends': 'tendencje',
        'predictions': 'prognozy',
        'risks': 'ryzyka',
        'intelligence': 'inteligencja',
        'talent': 'talent',
        'education': 'edukacja',
        'information': 'informacja',
        'perspective': 'perspektywa',
        'transformation': 'transformacja',
        'result': 'rezultat',
        'effect': 'efekt'
    }


    const getRandomWords = (wordsArray, count) =>
        wordsArray.sort(() => Math.random() - 0.5).slice(0, count);


    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function generateArray() {
        const array = Array(8).fill(1)      // 8 razy 1
            .concat(Array(9).fill(2))       // 9 razy 2
            .concat([3])                     // 1 raz 4
            .concat(Array(7).fill(0));       // 7 razy 0 (25 - 8 - 9 - 1 = 7)
        return array;
    }

    const toBase64 = str => btoa(unescape(encodeURIComponent(str)));
    const fromBase64 = str => decodeURIComponent(escape(atob(str)));

    const getParamData = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const base64Data = urlParams.get('data');
        const d = base64Data ? JSON.parse(fromBase64(base64Data)) : null;
        return d;
    };

    const saveAsGetParam = (combinedArray) => {
        const jsonString = JSON.stringify(combinedArray);
        const base64String = toBase64(jsonString);
        const url = new URL(window.location.href);
        url.searchParams.set('data', base64String);
        window.history.pushState({}, '', url);
    };

    // Component state
    let combinedArray = shuffle(getRandomWords(words, 25).map((word, index) => ({
        word: translationMap[word],
        value: generateArray()[index],
        image: null,
        english: word,
        clicked: false
    })));


    let key = false;
    let red = 0;
    let blue = 0;


    onMount(() => {
        socket = new WebSocket('ws://localhost:8080');

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                handleReceivedEvent(data.originalMessage);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        if (getParamData()) {
            combinedArray = getParamData();
            key = true;
        } else {
            saveAsGetParam(combinedArray);
        }

        return () => {
            socket.close();
        };


    });

    const handleReceivedEvent = (data) => {
        if (endplay) return;
        try {
            const index = data.index;
            if (index >= 0 && index < combinedArray.length) {
                combinedArray[index].clicked = true;
                combinedArray[index].image = data.image || null; // Ensure image exists

                if (combinedArray[index].value === 1) blue++;
                if (combinedArray[index].value === 2) red++;
                if (combinedArray[index].value === 3) {
                    alert('Przejebaliscie!');
                    endplay = true;
                }

                if (blue === 8) {
                    endplay = true;
                    alert('Dzień dobry niebiescy');
                }
                if (red === 9) {
                    endplay = true;
                    alert('Dzień dobry czerwoni');
                }

            } else {
                throw new Error('Invalid index');
            }
        } catch (err) {
            console.error('Error handling received event:', err);
        }
    };

    const reloadBoard = () => {
        const userConfirmed = confirm('Czy na pewno chcesz wygenerować nową tablice?');
        if (userConfirmed) {
            window.location.href = 'http://' + window.location.host;

        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('URL copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleClick = async (index) => {
        if (endplay) return;
        if (!combinedArray[index].clicked) {
            combinedArray[index].clicked = true;
            const imageUrl = await getFirstUnsplashPhotoByTag(combinedArray[index].english);
            combinedArray[index].image = imageUrl;

            const eventData = {
                index,
                image: imageUrl,
                word: combinedArray[index].word,
                value: combinedArray[index].value,
                english: combinedArray[index].english
            };

            socket.send(JSON.stringify(eventData));
        }
    };
</script>

<header>
    <p class="result-blue {blue > red ? 'active' : ''}"><strong>{blue} </strong>&nbsp;/ 8</p>
    <p class="result-red {red > red ? 'active' : ''}"><strong>{red} </strong>&nbsp;/ 9</p>
</header>
<div class="board key" class:end={endplay} class:key={key}>
    {#each Array(5) as _, rowIndex}
        {#each Array(5) as _, colIndex}
            <div class="card">
                <button
                        disabled={endplay}
                        on:click={() => handleClick(rowIndex * 5 + colIndex)}
                        class="class-{combinedArray[rowIndex * 5 + colIndex].value} {combinedArray[rowIndex * 5 + colIndex].clicked ? 'clicked' : ''}">
                    <span>{combinedArray[rowIndex * 5 + colIndex].word}</span>
                    {#if combinedArray[rowIndex * 5 + colIndex].clicked}
                        {#if (combinedArray[rowIndex * 5 + colIndex].image)}
                            <img src={combinedArray[rowIndex * 5 + colIndex].image}>
                        {/if}
                    {/if}
                </button>
            </div>
        {/each}
    {/each}
</div>

<footer>
    <button on:click={reloadBoard}>Generuj nowa tablice</button>
    <button on:click={copyToClipboard}>Kopiuj adres tablicy</button>
</footer>


<style>
    body {
        min-height: 100vh;
    }

    header {
        display: flex;
        justify-content: center;
        gap: 1.2rem;
        margin-bottom: 1.2rem;
    }

    header p {
        aspect-ratio: 1;
        padding: 1.2rem;
        color: #fff;
        font-size: 1.4em;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        border-radius: 50%;

    }

    header p strong {
        font-size: 1.5em;
    }

    .result-blue {
        background-color: #0475aa;
    }

    .result-red {
        background-color: #cd171d;
    }

    .board {
        display: grid;
        margin: auto;
        width: 95vw;
        gap: 12px;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(5, 1fr);
    }

    .board:not(.end):has(.card:hover) .card:not(:hover) {
        transform: scale(0.95);
        opacity: 0.6;
    }

    .card {
        transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
        border-radius: 12px;
        font-family: Calibri;
        background-color: #c1aa92;
        text-align: center;
        position: relative;
        overflow: hidden;
        border: 0;
    }
    .card:hover button {
        color: #fff;
    }
    .card:hover {

        --border-angle: 0turn;
        --main-bg: conic-gradient(
                from var(--border-angle),
                #213,
                #112 5%,
                #112 60%,
                #213 95%
        );
        border: solid 5px transparent;
        border-radius: 12px;
        --gradient-border: conic-gradient(from var(--border-angle), transparent 25%, #08f, #f03 99%, transparent);
        background: var(--main-bg) padding-box, var(--gradient-border) border-box, var(--main-bg) border-box;
        background-position: center center;
        -webkit-animation: bg-spin 3s linear infinite;
        animation: bg-spin 3s linear infinite;
    }

    @-webkit-keyframes bg-spin {
        to {
            --border-angle: 1turn;
        }
    }

    @keyframes bg-spin {
        to {
            --border-angle: 1turn;
        }
    }


    @property --border-angle {
        syntax: "<angle>";
        inherits: true;
        initial-value: 0turn;
    }


    .card button[disabled] {
        transition: none !important;
        transform: none !important;
        opacity: 1 !important;
    }

    .card button {
        aspect-ratio: 1;
        width: 90%;
        margin: 5% auto;
        border: 0;
        background-color: transparent;
        cursor: pointer;
        font-size: 18px;
        text-transform: uppercase;
        border-radius: 24px;
    }


    .card button:not(.clicked):hover {
        inset: 6px;
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
        border-radius: 50%;
    }

    .card button.clicked {
        cursor: not-allowed;

    }

    .card span {
        display: inline-block;
        padding: 1rem;
        transition: 0.2s ease-in-out;
    }

    .card img {
        display: none;
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 1;
        z-index: 1;
        object-fit: cover;
        object-position: center;
    }

    .class-0 img {
        filter: grayscale(1);
    }

    .key button {
        color: transparent !important;
    }

    .key .class-0, .class-0.clicked {
        color: #fff;
        background-color: rgba(0, 0, 0, 0.1);
    }

    .key .class-1, .class-1.clicked {
        color: #fff;
        background-color: #0475aa;
    }

    .class-1 img {
        border: 5px solid #0475aa;
    }

    .key .class-2, .class-2.clicked {
        color: #fff;
        background-color: #cd171d;
    }

    .class-2 img {
        border: 5px solid #cd171d;
    }

    .key .class-3, .class-3.clicked {
        background-color: #000;
        color: #fff;
    }

    .class-3 img {
        border: 5px solid #000;
    }

    footer {
        position: fixed;
        right: 0;
        bottom: 0;
        padding: 0.5rem;
        display: flex;
        gap: 0.5rem;
    }

    footer button {
        padding: 0.5rem;
        text-transform: uppercase;
    }

    .active {
        animation: pulse 2s infinite;
        transform: scale(1);
    }

    @keyframes pulse {
        0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
        }

        70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
        }

        100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        }
    }
</style>