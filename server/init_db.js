import sqlite3 from 'sqlite3';
import {open} from 'sqlite';

const words = ["Dom", "Drzewo", "Samochód", "Kot", "Pies", "Książka", "Stół", "Krzesło", "Ogród", "Szkoła", "Nauczyciel", "Uczeń", "Komputer", "Telefon", "Miasto", "Wieś", "Jezioro", "Góra", "Rzeka", "Morze", "Plaża", "Las", "Ptak", "Ryba", "Słońce", "Księżyc", "Gwiazda", "Niebo", "Chmura", "Deszcz", "Śnieg", "Wiatr", "Ogień", "Woda", "Ziemia", "Powietrze", "Rodzina", "Przyjaciel", "Dziecko", "Mama", "Tata", "Brat", "Siostra", "Babcia", "Dziadek", "Kwiat", "Owoc", "Warzywo", "Chleb", "Mleko", "Ser", "Mięso", "Jajko", "Cukier", "Sól", "Pieprz", "Herbata", "Kawa", "Sok", "Woda", "Czekolada", "Lody", "Ciasto", "Tort", "Pizza", "Makaron", "Ryż", "Zupa", "Kanapka", "Sałatka", "But", "Koszula", "Spodnie", "Sukienka", "Kapelusz", "Kurtka", "Płaszcz", "Rękawiczki", "Szalik", "Czapka", "Sklep", "Kino", "Teatr", "Muzeum", "Biblioteka", "Restauracja", "Kawiarnia", "Szpital", "Apteka", "Policja", "Straż", "Poczta", "Dworzec", "Lotnisko", "Port", "Ulica", "Droga", "Most", "Plac", "Park", "Bank", "Hotel", "Biuro", "Fabryka", "Warsztat", "Księgarnia", "Sklep", "Galeria", "Centrum", "Uniwersytet", "Kościół", "Synagoga", "Meczet", "Świątynia", "Pomnik", "Zamek", "Pałac", "Wieża", "Basen", "Stadion", "Boisko", "Siłownia", "Plac zabaw", "Ogród zoologiczny", "Cyrk", "Festiwal", "Koncert", "Wystawa", "Impreza", "Święto", "Urodziny", "Wesele", "Pogrzeb", "Spotkanie", "Praca", "Zadanie", "Projekt", "Plan", "Cel", "Sukces", "Porażka", "Szansa", "Ryzyko", "Wyzwanie", "Nauka", "Badanie", "Odkrycie", "Wynalazek", "Eksperyment", "Teoria", "Prawo", "Matematyka", "Fizyka", "Chemia", "Biologia", "Historia", "Geografia", "Sztuka", "Muzyka", "Literatura", "Film", "Fotografia", "Rzeźba", "Malarstwo", "Architektura", "Filozofia", "Psychologia", "Socjologia", "Ekonomia", "Polityka", "Prawo", "Medycyna", "Inżynieria", "Informatyka", "Technologia", "Internet", "Sieć", "Program", "Aplikacja", "Gry", "Sport", "Piłka nożna", "Koszykówka", "Siatkówka", "Tenis", "Hokej", "Bieg", "Pływanie", "Jazda", "Rower", "Samolot", "Pociąg", "Autobus", "Tramwaj", "Metro", "Statek", "Łódź", "Motocykl", "Skuter", "Ciężarówka", "Transport", "Podróż", "Wakacje", "Urlop", "Hotel", "Namiot", "Przygoda", "Mapa", "Bilet", "Paszport", "Walizka", "Plecak", "Pieniądze", "Karta", "Bankomat", "Kredyt", "Faktura", "Rachunek", "Podatek", "Budżet", "Osoba", "Człowiek", "Kobieta", "Mężczyzna", "Dziecko", "Młodzież", "Starzec", "Przyjaciel", "Znajomy", "Sąsiad", "Kolega", "Szef", "Pracownik", "Klient", "Gość", "Lekarz", "Pielęgniarka", "Policjant", "Strażak", "Nauczyciel", "Student", "Artysta", "Muzyk", "Aktor", "Pisarka", "Dziennikarz", "Kucharz", "Kelner", "Sprzedawca", "Mechanik", "Inżynier", "Programista", "Projektant", "Architekt", "Prawnik", "Sędzia", "Notariusz", "Księgowy", "Menadżer", "Dyrektor", "Prezes", "Minister", "Prezydent", "Król", "Królowa", "Książę", "Księżniczka", "Rycerz", "Mag", "Czarodziej", "Smok", "Elf", "Krasnolud", "Wiedźma", "Potwór", "Duch", "Zombie", "Wampir", "Wilkołak", "Bohater", "Złoczyńca", "Detektyw", "Szpieg", "Agent", "Polityk", "Dyplomata", "Żołnierz", "Generał", "Kapitan", "Pilot", "Marynarz", "Astronauta", "Naukowiec", "Odkrywca", "Podróżnik", "Ksiądz", "Mnich", "Zakonnica", "Guru", "Prorok", "Słońce", "Księżyc", "Gwiazda", "Planeta", "Kosmos", "Galaktyka", "Wszechświat", "Atom", "Molekuła", "Komórka", "Organizm", "Gatunek", "Ewolucja", "Genetyka", "DNA", "Bakteria", "Wirus", "Szczepionka", "Mikroskop", "Teleskop", "Laboratorium", "Eksperyment", "Teoria", "Hipoteza", "Dowód", "Fakt", "Informacja", "Dane", "Analiza", "Synteza", "Metoda", "Strategia", "Taktyka", "Operacja", "Projekt", "Program", "System", "Struktura", "Funkcja", "Proces", "Mechanizm", "Model", "Symulacja", "Algorytm", "Sieć", "Internet", "Komputer", "Serwer", "Dysk", "Pamięć", "Procesor", "Klawiatura", "Mysz", "Monitor", "Drukarka", "Skener", "Kamera", "Mikrofon", "Głośnik", "Słuchawki", "Telefon", "Tablet", "Smartfon", "Aplikacja", "Program", "Gra", "Film", "Muzyka", "Zdjęcie", "Wideo", "Tekst", "Dokument", "Plik", "Folder", "System", "Sieć", "Strona", "Link", "Adres", "Hasło", "Login", "Użytkownik", "Admin", "Baza danych", "Konto", "Profil", "Forum", "Czat", "Blog", "Wpis", "Komentarz", "Like", "Share", "Subskrypcja", "Powiadomienie", "Wiadomość", "Email", "Spam", "Atak", "Bezpieczeństwo"];

async function initDatabase() {
    const db = await open({
        filename: 'words.db',
        driver: sqlite3.Database
    });

    await db.exec('CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT)');


    const insert = 'INSERT INTO words (word) VALUES (?)';
    const stmt = await db.prepare(insert);

    for (const word of words) {
        await stmt.run(word);
    }

    await stmt.finalize();

    await db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      words TEXT
    )
  `);

    await db.close();

    console.log('Baza danych została zainicjalizowana.');
}

initDatabase().catch((err) => {
    console.error(err);
});