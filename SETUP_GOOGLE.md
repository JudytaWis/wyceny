# Setup Gmail + Google Drive MCP for `office@buildandtrack.com`

Cel: podpiąć Claude Code w folderze `~/Documents/BodoOffice/` do Gmaila i Drive na koncie `office@buildandtrack.com` z pełnymi uprawnieniami read+write.

---

## Krok 1: Google Cloud Console — utworzenie projektu i OAuth credentials

Wykonaj zalogowana na **office@buildandtrack.com** (lub kontem admina Workspace dla domeny buildandtrack.com).

### 1.1 Nowy projekt

1. Otwórz https://console.cloud.google.com/
2. Górny pasek → dropdown z projektami → **New Project**
3. Nazwa: `BuildTrack Office MCP` (lub dowolna)
4. Organization: `buildandtrack.com` (powinna być widoczna bo Workspace)
5. **Create** → poczekaj ~10 sek aż się utworzy
6. Wybierz ten projekt z dropdownu (musi być aktywny)

### 1.2 Enable APIs

W lewym menu: **APIs & Services → Library**. Wyszukaj i kliknij **Enable** dla KAŻDEGO z poniższych:

- [ ] **Gmail API**
- [ ] **Google Drive API**
- [ ] **Google Docs API**
- [ ] **Google Sheets API**
- [ ] **Google Slides API**
- [ ] **Google Calendar API**

(Każde zajmuje 2-3 sek)

### 1.3 OAuth consent screen

Lewe menu: **APIs & Services → OAuth consent screen**

1. **User Type**: wybierz **Internal** (możesz bo Workspace) → **Create**
2. Wypełnij:
   - **App name**: `BuildTrack Office MCP`
   - **User support email**: `office@buildandtrack.com`
   - **Developer contact**: `office@buildandtrack.com`
3. **Save and Continue**
4. **Scopes** → pomiń (kliknij **Save and Continue**) — scope dodamy na poziomie OAuth client
5. **Save and Continue** → **Back to Dashboard**

### 1.4 OAuth Client ID

Lewe menu: **APIs & Services → Credentials**

1. **+ Create Credentials** → **OAuth client ID**
2. **Application type**: **Desktop app**
3. **Name**: `BuildTrack MCP Desktop Client`
4. **Create**
5. W modalu pojawi się Client ID i Secret → kliknij **Download JSON** (pobierz plik)
6. Plik nazywa się np. `client_secret_XXXXX.googleusercontent.com.json`

### 1.5 Umieść credentials w odpowiednich lokalizacjach

Otwórz Terminal i wykonaj (zamień ścieżkę na realną do pobranego pliku):

```bash
# Stwórz katalogi konfiguracyjne dla obu MCP serverów
mkdir -p ~/.gmail-mcp
mkdir -p ~/.gdrive-mcp

# Skopiuj credentials do obu (zamień PATH_DO_POBRANEGO_PLIKU)
cp ~/Downloads/client_secret_*.json ~/.gmail-mcp/gcp-oauth.keys.json
cp ~/Downloads/client_secret_*.json ~/.gdrive-mcp/gcp-oauth.keys.json
```

---

## Krok 2: Uruchom OAuth flow dla obu serverów (jednorazowo)

W terminalu:

### 2.1 Gmail

```bash
npx @gongrzhe/server-gmail-autoauth-mcp auth
```

→ Otworzy się przeglądarka. Zaloguj się na **office@buildandtrack.com**.
→ Akceptuj wszystkie scope.
→ Po sukcesie token zapisze się w `~/.gmail-mcp/credentials.json`.

### 2.2 Drive (Docs/Sheets/Slides/Calendar)

```bash
npx @piotr-agier/google-drive-mcp auth
```

→ Ponownie przeglądarka → office@buildandtrack.com → akceptuj scope.
→ Token zapisze się w `~/.gdrive-mcp/credentials.json`.

---

## Krok 3: Restart Claude Code

W tym folderze (`~/Documents/BodoOffice/`):

1. Zamknij sesję Claude Code (Ctrl+C lub zamknij terminal)
2. Uruchom ponownie: `claude` (lub przez VS Code/Cursor extension)
3. Claude wczyta `.mcp.json` z folderu i poprosi o potwierdzenie zaufania do MCP servers — wybierz **Trust**.
4. Sprawdź dostępne narzędzia: `/mcp` → powinny być widoczne `gmail` i `gdrive` z listą tools.

---

## Krok 4: Test

Po restarcie zapytaj Claude'a:
- `pokaż mi 5 ostatnich maili z office@buildandtrack.com`
- `wyszukaj w Drive folder "BuildTrack"`
- `stwórz testowy dokument w Drive`

---

## Troubleshooting

- **"invalid_grant" przy OAuth**: usuń `~/.gmail-mcp/credentials.json` (lub `~/.gdrive-mcp/`) i uruchom auth ponownie.
- **MCP server nie startuje**: sprawdź czy `gcp-oauth.keys.json` istnieje w obu katalogach.
- **Brak narzędzi po restarcie**: w Claude Code wpisz `/mcp` i sprawdź status — jeśli "failed", zobacz logi: `claude --debug`.
- **Workspace admin blokuje OAuth**: zaloguj się na admin.google.com → Security → API controls → upewnij się że "Trust internal apps" jest włączone dla projektu.
