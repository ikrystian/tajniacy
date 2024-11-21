<script>
    import {onMount} from "svelte";
    let socket;
    const accessKey = 'U4ihy6aaUwyN-kkeN_JMpC9A6HN3432FQmym_eAjc-E';

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
        "kot", "pies", "samochod", "dom", "drzewo", "slonce", "ksiezyc", "gwiazda", "rzeka", "morze",
        "gora", "las", "miasto", "wies", "szkola", "biuro", "stol", "krzeslo", "komputer", "telefon",
        "kawa", "herbata", "chleb", "ser", "maslo", "mleko", "jajko", "ryba", "mieso", "warzywa",
        "owoce", "ciasto", "lody", "cukier", "sol", "pieprz", "zupa", "makaron", "pizza", "hamburger",
        "kanapka", "salatka", "deser", "wino", "piwo", "woda", "sok", "napoj", "kwiat", "drzewo",
        "krzew", "trawa", "kamien", "piasek", "snieg", "deszcz", "wiatr", "burza", "tornado", "lawina"
    ];

    const translationMap = {
        "kot": "cat",
        "pies": "dog",
        "samochod": "car",
        "dom": "house",
        "drzewo": "tree",
        "slonce": "sun",
        "ksiezyc": "moon",
        "gwiazda": "star",
        "rzeka": "river",
        "morze": "sea",
        "gora": "mountain",
        "las": "forest",
        "miasto": "city",
        "wies": "village",
        "szkola": "school",
        "biuro": "office",
        "stol": "table",
        "krzeslo": "chair",
        "komputer": "computer",
        "telefon": "phone",
        "kawa": "coffee",
        "herbata": "tea",
        "chleb": "bread",
        "ser": "cheese",
        "maslo": "butter",
        "mleko": "milk",
        "jajko": "egg",
        "ryba": "fish",
        "mieso": "meat",
        "warzywa": "vegetables",
        "owoce": "fruits",
        "ciasto": "cake",
        "lody": "ice cream",
        "cukier": "sugar",
        "sol": "salt",
        "pieprz": "pepper",
        "zupa": "soup",
        "makaron": "pasta",
        "pizza": "pizza",
        "hamburger": "hamburger",
        "kanapka": "sandwich",
        "salatka": "salad",
        "deser": "dessert",
        "wino": "wine",
        "piwo": "beer",
        "woda": "water",
        "sok": "juice",
        "napoj": "drink",
        "kwiat": "flower",
        "krzew": "bush",
        "trawa": "grass",
        "kamien": "stone",
        "piasek": "sand",
        "snieg": "snow",
        "deszcz": "rain",
        "wiatr": "wind",
        "burza": "storm",
        "tornado": "tornado",
        "lawina": "avalanche",
        "zima": "winter",
        "wiosna": "spring",
        "lato": "summer",
        "jesien": "autumn",
        "dziecko": "child",
        "mezczyzna": "man",
        "kobieta": "woman",
        "rodzina": "family",
        "przyjaciel": "friend",
        "sasiad": "neighbor",
        "nauczyciel": "teacher",
        "uczen": "student",
        "nastolatek": "teenager",
        "dorosly": "adult",
        "starzec": "elder",
        "muzyka": "music",
        "film": "movie",
        "ksiazka": "book",
        "obrazy": "pictures",
        "teatr": "theater",
        "taniec": "dance",
        "sport": "sport",
        "pilka": "ball",
        "koszykowka": "basketball",
        "siatkowka": "volleyball",
        "tenis": "tennis",
        "boks": "boxing",
        "wyscigi": "racing",
        "szachy": "chess",
        "gra": "game",
        "zabawa": "play",
        "zawody": "competition",
        "turniej": "tournament",
        "mecz": "match",
        "lekcja": "lesson",
        "klasa": "class",
        "nauka": "science",
        "wiedza": "knowledge",
        "technologia": "technology",
        "internet": "internet",
        "programowanie": "programming",
        "kod": "code",
        "aplikacja": "application",
        "strona": "website",
        "grafika": "graphics",
        "zdjecie": "photo",
        "instrument": "instrument",
        "piano": "piano",
        "gitara": "guitar",
        "perkusja": "drums",
        "flet": "flute",
        "trabka": "trumpet",
        "orkiestra": "orchestra",
        "koncert": "concert",
        "festyn": "festival",
        "impreza": "party",
        "urodziny": "birthday",
        "swieto": "holiday",
        "wakacje": "vacation",
        "podroz": "travel",
        "lotnisko": "airport",
        "samolot": "airplane",
        "pociag": "train",
        "autobus": "bus",
        "statek": "ship",
        "rower": "bicycle",
        "spacer": "walk",
        "wedrowka": "hike",
        "wycieczka": "trip",
        "kemping": "camping",
        "biwak": "camp",
        "plaza": "beach",
        "gory": "mountains",
        "park": "park",
        "ogrod": "garden",
        "zoo": "zoo",
        "ocean": "ocean",
        "wyspa": "island",
        "kultura": "culture",
        "tradycja": "tradition",
        "zwyczaj": "custom",
        "obrzed": "ritual",
        "milosc": "love",
        "szacunek": "respect",
        "zaufanie": "trust",
        "wsparcie": "support",
        "pomoc": "help",
        "szczescie": "happiness",
        "radosc": "joy",
        "smutek": "sadness",
        "zlosc": "anger",
        "strach": "fear",
        "nadzieja": "hope",
        "marzenie": "dream",
        "cel": "goal",
        "praca": "work",
        "kariera": "career",
        "firma": "company",
        "projekt": "project",
        "wynagrodzenie": "salary",
        "oszczednosci": "savings",
        "wydatki": "expenses",
        "budzet": "budget",
        "handel": "trade",
        "sklep": "shop",
        "reklama": "advertisement",
        "marketing": "marketing",
        "klient": "client",
        "analiza": "analysis",
        "innowacja": "innovation",
        "partnerstwo": "partnership",
        "spotkanie": "meeting",
        "dyskusja": "discussion",
        "opinia": "opinion",
        "argument": "argument",
        "historia": "history",
        "teraźniejszosc": "present",
        "przyszlosc": "future",
        "wiek": "century",
        "cywilizacja": "civilization",
        "literatura": "literature",
        "wystawa": "exhibition",
        "muzeum": "museum",
        "festiwal": "festival",
        "statystyki": "statistics",
        "eksperyment": "experiment",
        "teoria": "theory",
        "koncepcja": "concept",
        "tworczosc": "creativity",
        "postep": "progress",
        "rewolucja": "revolution",
        "tendencje": "trends",
        "prognozy": "predictions",
        "ryzyka": "risks",
        "osiagniecie": "success",
        "inteligencja": "intelligence",
        "talent": "talent",
        "edukacja": "education",
        "informacja": "information",
        "perspektywa": "perspective",
        "transformacja": "transformation",
        "rezultat": "result",
        "efekt": "effect"
    };


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
        word,
        value: generateArray()[index],
        image: null,
        english: translationMap[word],
        clicked: false
    })));


    let key = false;
    let red = 0;
    let blue = 0;


    onMount(() => {
        socket = new WebSocket('ws://localhost:8080');

        socket.onmessage = (event) => {
            console.log('Received data:', event.data); // Log raw data
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
        console.log(data);
        try {
            const index = data.index;
            if (index >= 0 && index < combinedArray.length) {
                combinedArray[index].clicked = true;
                combinedArray[index].image = data.image || null; // Ensure image exists
            } else {
                throw new Error('Invalid index');
            }
        } catch (err) {
            console.error('Error handling received event:', err);
        }
    };

    const reloadBoard = () => {
        window.location.href = 'http://' + window.location.host
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
        console.log(combinedArray[index]);
        if (!combinedArray[index].clicked) {
            combinedArray[index].clicked = true;
            const imageUrl = await getFirstUnsplashPhotoByTag(combinedArray[index].word);
            combinedArray[index].image = imageUrl;

            const eventData = {
                index,
                image: imageUrl,
                word: combinedArray[index].word,
                value: combinedArray[index].value,
                english: combinedArray[index].english
            };

            socket.send(JSON.stringify(eventData));

            if (combinedArray[index].value === 1) blue++;
            else if (combinedArray[index].value === 2) red++;
            else if (combinedArray[index].value === 3) alert('Przejebaliscie!');
        }
    };
</script>

<header>
    <p class="result-blue"><strong>{blue} </strong>&nbsp;/ 8</p>
    <p class="result-red"><strong>{red} </strong>&nbsp;/ 9</p>
</header>
<table class="key" class:key={key} border="1">
    <tbody>
    {#each Array(5) as _, rowIndex}
        <tr>
            {#each Array(5) as _, colIndex}
                <td
                        on:click={() => handleClick(rowIndex * 5 + colIndex)}
                        class="class-{combinedArray[rowIndex * 5 + colIndex].value} {combinedArray[rowIndex * 5 + colIndex].clicked ? 'clicked' : ''}">
                    <span>{combinedArray[rowIndex * 5 + colIndex].word}</span>
                    {#if combinedArray[rowIndex * 5 + colIndex].clicked}
                        {#if (combinedArray[rowIndex * 5 + colIndex].image)}
                            <img src={combinedArray[rowIndex * 5 + colIndex].image}>
                        {/if}
                    {/if}
                </td>
            {/each}
        </tr>
    {/each}
    </tbody>
</table>

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

    table {
        width: 100%;
        margin: auto;
        height: 80vh;
    }

    td {
        width: 20%;
        height: 20%;
        font-size: 2vh;
        text-transform: uppercase;
        font-family: verdana;
        background-color: #c1aa92;
        text-align: center;
        position: relative;
        transition: background-color 0.3s;
        overflow: hidden;
    }

    td span {
        display: inline-block;
        padding: 1rem;
        transition: 0.2s ease-in-out;
    }

    td img {
        position: absolute;
        inset: 0;
        width: calc(100% - 12px);
        height: calc(100% - 12px);
        opacity: 1;
        border: 6px solid #c1aa92;
        z-index: 1;
        object-fit: cover;
        object-position: center;
    }

    td:hover {
        cursor: pointer;
        background-color: #dedede;
    }

    td:hover span {
        transform: scale(1.2);
    }




    .key .class-1, .class-1.clicked {
        background-color: #0475aa;
    }
    .class-1 img {
        border: 5px solid #0475aa;
    }

    .key .class-2, .class-2.clicked {
        background-color: #cd171d;
    }

    .class-2 img {
        border: 5px solid #cd171d;
    }

    .key .class-3, .class-3.clicked {
        background-color: #000;
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
</style>