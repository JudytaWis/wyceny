# BODO — SZABLON WYCENY (offert) — TEMPLATE-GOTOWIEC

> **Cel pliku:** kiedy wrzucasz Claude'owi dane do nowej wyceny, podaj mu ten plik jako referencję.
> Claude wygeneruje wycenę 1:1 w stylu Bodobygg — strukturalnie, językowo, cenowo, z całą boilerplate'ką.
>
> **Język wyceny:** SZWEDZKI (domyślnie). W wyjątkach klient zagraniczny → angielski.
> **Format docelowy:** Canva (A4 pionowy, 5–9 stron). Tę instrukcję można też renderować do PDF/HTML.
> **Źródło wzorca:** 5 reprezentatywnych wycen z Canva (7/2026 Tillbyggnad-Vettershaga, 5/2026 Mörk-Eidem, 25/2026 Dränering, 38/2024 Stllning, 89A/2025 Rivning Liding).
> **Ostatnia aktualizacja:** 2026-05-16.

---

## 1. DANE STAŁE FIRMY (boilerplate — NIE ZMIENIAĆ)

**Aktualna nazwa prawna (od 2026):**
```
BODO Build and Track AB
Lillkalmarvgen 30A
182 65 Djursholm
office@buildandtrack.com
+46 702 784 918
bodobygg.se
```

**Stare wyceny (przed 2026) używały:**
- `Artasbygg AB · Nsbyvgen 2, 183 56 Tby · info@artasbygg.se · artasbygg.se`
- `Artas Nordic AB · Lillkalmarvgen 30A, 182 65 Djursholm · Org.nr: 559547-8453`

→ **Dla wszystkich nowych wycen używaj BODO Build and Track AB.**

**Tagline (zawsze w nagłówku):**
> *"A joyful home, a peaceful mind. Build your Oasis."*

**Logo / nazwa marki w grafice:** `BODO`

**Slogan zaufania (powtarza się w nagłówku):**
> *Vra kunder litar p oss eftersom vi alltid hller deadlines, hller budgeten och erbjuder 20 rs garanti.*

---

## 2. STRUKTURA DOKUMENTU (5–9 stron, w zależności od skomplikowania)

### Strona 1 — OKŁADKA / HEADER
- Logo `BODO` + tagline
- Tytuł sekcji: `Szczegy cennika wraz z szacowanym budetem i zakresem usug`
- Pole nagłówkowe:
  ```
  Offert:       Datum:              Kund:        Adress:        Projekt:
  Nr {{NUMER}}/{{ROK}}   {{DATA}}    {{KLIENT}}  {{ADRES}}      {{NAZWA_PROJEKTU}}
  ```
- Jeśli była rewizja: `Nr {{NUMER}}/{{ROK}} rev {{N}}, {{DATA_REWIZJI}}`
- Stopka strony: `bodobygg.se` · `0 702 784 918` · `Build and Track AB` · `se vra rapporter p sociala medier`

### Strona 2 — OPIS PROJEKTU + CHARAKTER PRAC
- Krótki opis charakteru projektu (1 akapit):
  > *Projektet r att betrakta som en [tillbyggnad / ombyggnation / renovering / rivning / drnering] med [hg / medel / standard] teknisk och arkitektonisk komplexitet.*
- Bullet-lista kluczowych elementów projektu (5–8 punktów).

### Strona 3 — ENTREPRENADFORM (forma kontraktu)
Wybierz JEDEN z dwóch standardowych modeli:

**Model A — Totalentreprenad (zalecany dla większych):**
```
Freslagen entreprenadform:
Totalentreprenad enligt ABS18
Utfrande enligt ppet redovisad lpande rkning.

- Veckovis fakturering
- Full kostnadstransparens
- Lpande ekonomisk uppfljning
```

**Model B — Fixed price (dla mniejszych, jednoznacznych zakresów):**
```
FIXED PRICE PROPOSAL
TOTAL FAST PRIS: {{KWOTA}} kr inkl moms
```

Dla większych remontów / rivning: `ABT 06 Design and Build conditions`.

### Strony 4–N — ETAPY PRAC (po jednej stronie na etap)
Każdy etap ma identyczny szkielet:
```
ETAPP {{N}}  {{NAZWA_ETAPU_CAPS}}
Omfattningen av arbetet:
- {{punkt 1}}
- {{punkt 2}}
- ...

Bedmd kostnadsram:  {{KWOTA}} kr inkl moms
   ALBO
Budgetestimat  Etapp {{N}}:
Arbetskostnad: {{godziny}} timmar  {{stawka}} kr/timme inkl moms = {{kwota}} kr
(Arbetsram: {{min}}  {{max}} kr)
```

**Typowe nazwy etapów (CAPS):**
- `ETAPP 1  MARK & GRUND` — prace ziemne, fundamenty
- `ETAPP 2  STOMME & KLIMATSKAL` — konstrukcja, dach, elewacja
- `ETAPP 3  INTEGRATION MED BEFINTLIG BYGGNAD` — łączenie z istniejącym
- `ETAPP 4  INVNDIGA ARKITEKTONISKA DELAR` — prace wewnętrzne
- `ETAPP 1: Rivning av befintlig {{X}}` — wyburzenia
- `ETAPP 2: Ny {{X}} frn grund` — budowa od zera

### Strona N+1 — KOSZTORYS ZBIORCZY
```
SAMMANFATTAD KOSTNADSRAM

ETAPP 1: {{X}}  {{KWOTA}}
ETAPP 2: {{X}}  {{KWOTA}}
...

Total berknad projektkostnad:
{{MIN}}  {{MAX}} kr inkl moms
   ALBO
{{KWOTA}} MSEK inkl moms
(exklusive {{co_nie_wchodzi}}  separat offert inhmtas)
```

### Strona N+2 — DODATKI, STAWKI, MATERIAŁY (zawsze obecna)

**Stawki za prace dodatkowe (ROK 2026 — aktualne):**
```
ndringar / tillggsarbeten:
Arbetstimme:                650 kr inkl. moms
Arbete med grvmaskin:        925980 kr inkl. moms / timme
Arbete med lastbil:          1 168 kr inkl. moms / timme
Grvmaskin (dag):             5 875 kr inkl moms / day
Transport:                   1 500 kr / st
Avfallshantering:            3 500 kr / st
Resor / servicebil:          600 kr / dag
Debiteras enligt faktisk frbrukning.
```

**Polityka materiałów:**
```
Material bestlls och samordnas av entreprenren.
Vid materialinkp tillkommer: 10 % entreprenrsarvode

Detta inkluderar:
- Inkpshantering
- Logistik
- Samordning
- Ansvar enligt totalentreprenad
- Garantihantering
```

**Budgetstyrning (zawsze):**
```
Om prognosen indikerar att projektet riskerar att verstiga budgetramen
med mer n 10 %, pausas arbetet fr gemensam ekonomisk genomgng.
Eventuella ndringar eller tillggsarbeten ska godknnas av bestllaren
innan utfrande.
```

### Strona N+3 — "VARFR VLJA OSS?" (boilerplate — kopiuj 1:1)
```
Varfr vlja oss?

1. Offert inom 5 dagar.
2. Vi frhandlar inte om priserna  vi dljer inga kostnader.
3. Vi anpassar arbetsomfattningen efter din budget och behov.
4. Snabb och solid  vi har en avancerad rekryteringsprocess dr vi noggrant
   granskar vra medarbetare fr erfarenhet och kvalitet.
5. De billigaste materialen av hg kvalitet  vi kan importera dem frn Polen t dig.
6. Vi erbjuder alla typer av byggtjnster  komplett service.
7. Skerhet  vi anvnder toppmoderna byggutrustningar och skerhetstgrder.
8. Vi hjlper dig med fastighetskp och vrdering av bostder fre och efter renovering.
9. Vi ger belningar fr att rekommendera oss till dina vnner.
```

```
Varfr r det frdelaktigt att samarbeta med oss p lng sikt?

1. Vi erbjuder upp till 20 rs garanti  Om det uppstr problem kommer vi
   och utfr reparationen kostnadsfritt.
2. Lojalitetskort fr terkommande kunder  Du fr rabatter p framtida projekt.
3. Prioriterad service  Om du behver hjlp snabbt r vi hos dig inom 3 dagar.
4. Dubbel belning  Rekommendera oss till vnner och skriv en recension,
   och vi belnar dig dubbel gng fr din rekommendation.
```

> **Uwaga:** w starych wycenach (do 2024) gwarancja to **10 lat**. Od 2026 to **20 lat**. Używaj 20.

### Ostatnia strona — TERM & CONDITIONS + PODPIS

**Boilerplate warunków (kopiuj 1:1):**
```
Regler och giltighetstid fr offert
Offert gller i 30 dagar frn ovanstende datum.

Betalningspolicy
10 dagar

Fakturering sker lpande enligt verenskommen produktionsplan.

Vid ofrutsedda frhllanden som inte kunnat bedmas utifrn nuvarande handlingar
sker ekonomisk genomgng och skriftligt godknnande innan vidare arbete.

Allt byggnadsarbete kommer att utfras i enlighet med de krav och freskrifter
i lag och byggnormer som gller i Sverige.

I vrderingen ingr inte kostnader fr inredning och utrustning ssom mbler,
vitvaror, belysning etc. om de inte ingr i avtalet som en separat post.

Betalningsvillkor kommer att anges i avtalet och kommer att bero p byggskeden
och den tid som krvs fr att slutfra varje etapp.
```

**Dla wycen rivning / większych — dodać:**
```
This offer and the forthcoming contract are based on ABT 06 Design and Build conditions.

The client is responsible for providing the following documents before the work begins:
- Demolition permit (Rivningslov)
- Environmental inspection report (Miljinventering)
- Control plan (Kontrollplan)
- Demolition plan (Rivningsplan)
```

**Blok podpisu:**
```
Godknnande

Datum:
Kundsignatur:

Kund:           {{KLIENT}}
                {{ADRES}}
                {{PROJEKT}}

Entreprenr:    BODO Build and Track AB
                Lillkalmarvgen 30A
                182 65 Djursholm
```

---

## 3. WSZYSTKIE PLACEHOLDERY (do podmiany przez Claude'a)

| Placeholder | Opis | Przykład |
|---|---|---|
| `{{NUMER}}/{{ROK}}` | Numer wyceny (kolejny w roku) | `7/2026` |
| `{{DATA}}` | Data wystawienia (DD.MM.RRRR) | `24.02.2026` |
| `{{DATA_REWIZJI}}` | (opcjonalnie) data rewizji | `29.04.2026` |
| `{{KLIENT}}` | Imię + nazwisko / nazwa firmy | `Mikael Lnnster` |
| `{{ADRES}}` | Adres inwestycji | `grdsvgen 11, 761 12 Bergshamra` |
| `{{NAZWA_PROJEKTU}}` | Krótka nazwa | `Tillbyggnad-Vettershaga` |
| `{{TYP_KONTRAKTU}}` | Forma | `Totalentreprenad ABS18` / `Fast pris` / `ABT 06` |
| `{{ETAPY[]}}` | Lista etapów z nazwą, zakresem, budżetem | — |
| `{{KWOTA_TOTAL}}` | Suma końcowa | `11  13 MSEK inkl moms` |
| `{{STAWKA_GODZ}}` | Stawka godzinowa pracy | `650 kr/timme inkl moms` |
| `{{CO_NIE_WCHODZI}}` | Wykluczenia | `fnster och ytterdrrar` |
| `{{ROT_RUT}}` | Czy dopisać ROT/RUT-avdrag | tak/nie |

---

## 4. STYL JĘZYKOWY — ZASADY

1. **Język = szwedzki** (chyba że klient jednoznacznie nie-szwedzki → wtedy angielski; nigdy nie mieszać w obrębie jednej wyceny).
2. **Ton:** profesjonalny, rzeczowy, premium. Brak emocji, brak superlatyw poza sekcją "Varfr vlja oss".
3. **Liczby:** zawsze "inkl moms" (z VAT). Tysiące spacją: `1 500 kr`. Milony: `1,3 MSEK`.
4. **Stawki:** standardowo `650 kr/timme`. Maszyny — patrz tabela wyżej.
5. **Zakres "lpande rkning" vs "fast pris":**
   - Większe i niejednoznaczne → `lpande rkning` z `Budgetram MIN  MAX`.
   - Małe, jednoznaczne (np. wynajem rusztowania, prosta rivning) → `FAST PRIS`.
6. **Zawsze dodaj klauzulę 10% przekroczenia** (Budgetstyrning).
7. **Zawsze dodaj klauzulę nieprzewidzianych okoliczności** ("Om ovntade problem uppstr...").

---

## 5. WARIANTY SPECJALNE

### Drnering (np. 25/2026):
- Dodaj `Mjlighet till ROT/RUT-avdrag p arbetskostnaden.`
- Wspomnij o `ISODRN SYSTEM` jeśli standard.
- Dwa spotkania tygodniowe + dzienny raport kosztów.

### Rivning / demolition (np. 89A/2025):
- ABT 06 zamiast ABS18.
- Lista dokumentów od klienta (Rivningslov, Miljinventering, Kontrollplan, Rivningsplan).
- Klauzula o asbestoi/blue concrete osobno.
- Tabela kosztów: `MANPOWER / Container truck / Mashinery / Demolition mashinery / Disposal SORAB` z osobnymi sumami.

### Tillbyggnad / duża inwestycja (np. 7/2026):
- 4 etapy: MARK & GRUND → STOMME & KLIMATSKAL → INTEGRATION → INVNDIGA.
- Sumaryczna kosztorysu w MSEK z zakresem MIN-MAX.
- `Vderskydd under produktionsperiod` jako osobna linia.

### Wynajem rusztowania (np. 38/2024):
- Krótkie — 1–2 strony zakresu, reszta to boilerplate.
- Fast pris, ex moms (a nie inkl moms — wyjątek!).
- Osobna sekcja: `I priset ingr` / `Ingr ej` / `Returpolicy`.

---

## 6. JAK UŻYĆ TEGO PLIKU Z CLAUDEM

**Prompt-szkielet dla nowej wyceny:**
```
Stwórz wycenę Bodobygg na podstawie pliku /Users/judytawis/Documents/BodoOffice/BODO_QUOTE_TEMPLATE.md.

Dane:
- Numer: {{X/ROK}}
- Data: {{DD.MM.RRRR}}
- Klient: {{imię + adres}}
- Projekt: {{krtki opis}}
- Typ: {{tillbyggnad / rivning / drnering / renovering / ...}}
- Zakres (po polsku, ja go przetłumaczę): 
  - {{punkt 1}}
  - {{punkt 2}}
  - ...
- Szacowany budżet / godziny: {{...}}
- Specjalne wymagania: {{ROT/RUT? ABT06? lopande/fast?}}

Wygeneruj kompletną wycenę po szwedzku w strukturze z template'a, gotową do wklejenia do Canva.
```

**Output, którego oczekujesz od Claude'a:**
- Tekst sekcja po sekcji (1 sekcja = 1 strona Canvy), gotowy do skopiowania.
- Wszystkie boilerplate'y wstawione 1:1 (nie parafrazowane).
- Stawki, gwarancja, kontakt — zgodne z tym plikiem (aktualizacja 2026).

---

## 7. ŻRÓDŁA (wyceny analizowane przy budowie szablonu)

| Wycena | Design ID | Edit URL |
|---|---|---|
| 7/2026 Tillbyggnad-Vettershaga | DAHCQupph0U | https://www.canva.com/d/DNH0ZSEBpk1Th_S |
| 5/2026 Alexander Mrk-Eidem | DAHB24a4Xtg | https://www.canva.com/d/KCHDx1PiOYjDC2S |
| 25/2026 Drnering Joachim/Magdalena | DAHFKu6hZ38 | https://www.canva.com/d/VmNc6t90_HQ5km1 |
| 38/2024 Stllning Golvproffsen | DAGP6mnmhsE | https://www.canva.com/d/HcA3z-P6BVH-1Sd |
| 89A/2025 Rivning Liding | DAGxM8ZFiAw | https://www.canva.com/d/vXFv0ozNrY8-PZB |

---

**Jak utrzymywać ten plik:** co kwartał sprawdź czy stawki (650/925/1168/1500/3500/600) się nie zmieniły. Co rok sprawdź dane firmy i gwarancję.
