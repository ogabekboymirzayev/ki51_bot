# 🤖 Telegram Quiz Bot - Falsafa & Dinshunoslik

A complete Node.js Telegram bot using `node-telegram-bot-api` for conducting interactive quizzes on Falsafa (Philosophy) and Dinshunoslik (Religious Studies).

## ✨ Features

### Core Functionality
- **Two Quiz Modes**: Falsafa and Dinshunoslik
- **Group & Private Chat Support**: Works in groups and direct messages
- **Customizable Timer**: 10, 15, 20, or 25 seconds per question
- **30 Random Questions**: Each quiz session with 30 randomly selected questions
- **Multiple Choice**: 4 options (A, B, C, D) - correct answer shuffled
- **One Answer Per User**: Each participant can answer only once per question
- **Live Score Tracking**: Scores tracked in real-time during quiz
- **Ranked Results**: Final results sorted by score with percentages

### Security & Validation
- **Group Member Check**: Validates users via `getChatMember()` API
- **Unauthorized Access Message**: Non-members see: "Admin bilan bog'laning: @ogabek_boymirzayev"
- **Session Management**: Prevents multiple simultaneous quizzes per chat

### Admin Commands
- `/reload` - Reload question files without restarting bot
- `/getid` - Get current chat ID
- `/start` - Show welcome message
- `/falsafa` - Start Falsafa quiz
- `/dinshunoslik` - Start Dinshunoslik quiz
- `/stop` - End active quiz and show results

## 🚀 Installation & Setup

### Prerequisites
- Node.js v16+ 
- npm or yarn
- Telegram Bot Token (from @BotFather)

### Installation Steps

1. **Clone/Setup the project**
```bash
cd "New Folder (Copy)"
npm install
```

2. **Configure environment variables**
Edit `.env` file:
```
BOT_TOKEN=your_bot_token_here
```

3. **Prepare question files**
Question files should be in `src/data/` directory:
- `FALSAFA_uzb.txt` - Philosophy questions (381 currently loaded)
- `dinshunoslik.txt` - Religious studies questions (24 currently loaded)

### File Format Requirements

Questions must follow this exact format:

```
Question text here?
=====
Correct answer (appears first)
=====
Wrong answer 2
=====
Wrong answer 3
=====
Wrong answer 4

+++++

Next question here?
=====
Correct answer
=====
Wrong answer 2
=====
Wrong answer 3
=====
Wrong answer 4
```

- Questions separated by `+++++`
- Answer options separated by `=====`
- First option **must be the correct answer** (bot shuffles automatically)
- Minimum 5 lines per question block (1 question + 4 answers)

## 📱 User Interface

### Private Chat Flow
```
/start
  ↓
[📚 Falsafa] [🕌 Dinshunoslik]
  ↓
[10s] [15s] [20s] [25s]
  ↓
Quiz starts with 30 questions
```

### Group Chat Flow
```
/falsafa or /dinshunoslik
  ↓
[10s] [15s] [20s] [25s]  (group members only)
  ↓
Multiple users answer simultaneously
  ↓
Results sorted by score
```

### Quiz Interface
```
Savol 1/30:
[Question Text]

[A] [B]
[C] [D]

⏱️ Timer: 15 seconds
```

After timer expires → Shows correct answer → Next question

## 🎯 Quiz Flow

1. **Question Display** (0-X seconds)
   - User selects answer from inline buttons
   - Each user can answer only once per question
   - Callback shows immediate feedback (✅ or ❌)

2. **Timer Expiration** (X seconds)
   - Answer buttons removed
   - Correct answer displayed
   - 1-second delay before next question

3. **Question 30 Complete**
   - Quiz ends
   - Results displayed with ranking:
     ```
     🏆 Quiz natijalari:
     
     🥇 Ali
        ✅ 28/30 (93%)
     
     🥈 Fatima
        ✅ 24/30 (80%)
     
     🥉 Omar
        ✅ 20/30 (67%)
     ```

## 🏗️ Project Structure

```
src/
├── main.js                 # Bot entry point & command handlers
├── utils/
│   ├── parser.js          # Question file parser
│   └── helpers.js         # Utility functions (shuffle, format)
├── state/
│   └── session.js         # Session management
└── data/
    ├── FALSAFA_uzb.txt    # Philosophy questions
    └── dinshunoslik.txt   # Religious studies questions
```

## 📋 API Reference

### Session State
```javascript
{
  chatId,                    // Telegram chat ID
  quizType,                  // 'falsafa' or 'dinshunoslik'
  timerSeconds,              // 10, 15, 20, or 25
  questions,                 // Array of question objects
  currentQuestionIndex,      // Current question position
  userScores,                // Map<userId, {name, correct, total}>
  answeredUsers,             // Set of users who answered current Q
  currentMessageId,          // Message ID of current question
  timerTimeoutId,            // Timeout ID for timer
  state,                     // 'running' or 'finished'
  optionMap,                 // {A, B, C, D} → answer text
  correctAnswerLetter,       // Letter of correct answer
  correctAnswerText          // Text of correct answer
}
```

### Commands Handled

| Command | Where | Effect |
|---------|-------|--------|
| `/start` | Any | Show quiz type buttons (private) or help (group) |
| `/falsafa` | Group only | Start philosophy quiz (member check) |
| `/dinshunoslik` | Group only | Start religious studies quiz (member check) |
| `/stop` | Active quiz | End quiz & show current results |
| `/reload` | Any | Reload question files |
| `/getid` | Any | Return current chat ID |

## 🔧 Advanced Configuration

### Modify Timer Options
In [main.js](src/main.js), find timer callbacks and update:
```javascript
{ text: '30s', callback_data: 'timer_falsafa_30' }  // Add new option
```

### Change Questions Per Quiz
In [main.js](src/main.js), line ~260:
```javascript
session.questions = getRandomQuestions(questionCache[quizType], 50); // Change 30 to 50
```

### Add New Quiz Type
1. Create new question file: `src/data/new_quiz.txt`
2. In `loadQuestions()`: Add parsing for new file
3. Add new command: `/new_quiz`
4. Add callback handler for timer selection

## ⚙️ Running the Bot

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

## 📊 Example Session

```
User sends: /falsafa
Bot: "⏱️ Vaqtni tanlang:"
     [10s] [15s] [20s] [25s]

User clicks: 20s
Bot: "🚀 Quiz boshlanmoqda..."
     
Bot: "Savol 1/30: Ratsionalizm nima?"
     [A] [B]
     [C] [D]

User clicks: A (after 8 seconds)
Bot: "✅ To'g'ri!" (callback)

[12 seconds later - timer expires]
Bot: "To'g'ri javob: A - Aql..."
     
[repeats for questions 2-30]

Bot: "🏆 Quiz natijalari:
      🥇 Jasur
         ✅ 27/30 (90%)
      🥈 Maria
         ✅ 24/30 (80%)"
```

## 🐛 Troubleshooting

### Bot not responding
- Check `BOT_TOKEN` in `.env`
- Verify polling is active: `polling: true`
- Check bot permissions in group (admin rights needed for getChatMember)

### Questions not loading
- Verify file format (+++++, ===== separators)
- Check file encoding (UTF-8 with BOM support)
- Ensure minimum 5 lines per question block

### Users from other chats can answer
- This is expected - sessions are per-chat
- Answers only visible to that chat

### Wrong answers appearing sometimes
- Might be caching issue → Use `/reload` command
- File not properly formatted

## 📝 Notes

- First answer option **must always be correct** - bot handles shuffling
- Recommended 20-25 seconds per question for complex topics
- Bot uses polling (no webhooks needed)
- Session data stored in memory (lost on restart)
- Works with UTF-8 Uzbek text

## 🤝 Support

For issues or feature requests related to @ogabek_boymirzayev, contact the admin.

## 📄 License

Created for Falsafa and Dinshunoslik education purposes.
5. Private chatda yakuniy natija ko‘rsatiladi.
6. Guruhda `/stop` bilan yakuniy leaderboard chiqadi.

## Fayl formati

- Har savol bloki `+++++` bilan ajratiladi.
- Har blok ichida maydonlar `=====` bilan ajratiladi.
- 1-qator: savol
- 2-qator: to‘g‘ri javob
- 3-qator: noto‘g‘ri javob
- 4-qator: noto‘g‘ri javob
- 5-qator: noto‘g‘ri javob

## Ishga tushirish

`.env` faylida `BOT_TOKEN` bo‘lishi kerak.

```bash
npm install
npm start
```
# Telegram Quiz Bot

This repository contains a Telegram bot that generates multiple-choice quizzes from uploaded files (PDF, DOCX, TXT) using OpenAI.

## Setup

1. Copy `.env.example` to `.env` and fill values:

```
BOT_TOKEN=<your-telegram-bot-token>
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_MODEL=gpt-4o-mini
```

2. Install dependencies:

```bash
npm install
```

3. Run the bot:

```bash
npm start
```

## Usage

- Send `/start` to see the welcome message.
- Upload a PDF, DOCX or TXT file; the bot will extract text and create a quiz.
- Commands:
  - `/soni N` — set number of questions
  - `/qiyin` — hard questions
  - `/oson` — easy questions
  - `/mavzu name` — set topic
  - `/qayta` — regenerate questions from last uploaded file
  - `/javobsiz` — toggle hide answers (only questions will be returned)

## Notes

- Make sure `.env` has `BOT_TOKEN` and `OPENAI_API_KEY` set.
- The bot requests quiz generation from OpenAI; API usage may incur costs.
# 🤖 Telegram Quiz Bot

JavaScript da yozilgan, TXT fayllardan quiz tayyorlash qoladigan Telegram boti.

## ✨ Xususiyatlari

- ✅ TXT fayllardagi quiz tayyorlash
- 🔀 Javoblarni avtomatik aralashtirasih
- ⏱️ Foydalanuvchi tanlashi mumkin bo'lgan taymeri (15, 20, 25 soniya)
- 👥 Guruhda va shaxsiy chatda ishlash
- 📊 Natijalarni avtomatik hisoblash
- 🎯 Har bir foydalanuvchi uchun alohida test

## 📋 TXT Fayl Formati

```
Savol 1?
A) To'g'ri javob
B) Noto'g'ri javob 1
C) Noto'g'ri javob 2
D) Noto'g'ri javob 3

Savol 2?
A) To'g'ri javob
B) Noto'g'ri javob
C) Noto'g'ri javob
D) Noto'g'ri javob
```

**Muhim:** 
- Har bir to'g'ri javob **"A"** bilan boshlansa kerak
- Savollar bo'sh satr bilan ajratilsin
- TXT formatida bo'lsin

## 🚀 O'rnatish va Ishga Tushirish

### 1. Node.js o'rnatish
https://nodejs.org dan Node.js o'rnating

### 2. Fayllari yuklab olish
```bash
cd /path/to/bot
```

### 3. Paketlarni o'rnatish
```bash
npm install
```

### 4. Bot tokenini olish
- Telegramda @BotFather ga yozing
- /newbot buyrug'ini ishlating
- Bot nomini kiriting
- Sizga bergan tokenni .env fayliga qo'ying

### 5. .env fayl yaratish
```
BOT_TOKEN=YOUR_BOT_TOKEN_HERE
```

### 6. Botni ishga tushirish

**Development rejimida (avtomatik restart bilan):**
```bash
npm run dev
```

**Production rejimida:**
```bash
npm start
```

## 📱 Bot Buyruqlari

- `/start` - Botni ishga tushirish
- `/help` - Yordam
- `/about` - Bot haqida

## 🎮 Qanday Ishlaydi?

1. **Shaxsiy chat:**
   - TXT fayli yuboring
   - Bot taymerni tanlashini so'raydi (15, 20, 25 soniya)
   - Test boshlash
   - Javoblarni tanlang
   - Natijalarni ko'ring

2. **Guruh:**
   - Botni guruhga qo'shing
   - TXT fayli yuboring
   - Har bir a'zo alohida test qiladi
   - Foydalanuvchi shaxsiy natijalarini oladi

## 📁 Fayl Strukturasi

```
telegram-quiz-bot/
├── bot.js                 # Asosiy bot fayli
├── package.json          # NPM paketlari
├── .env                  # Bot token (yaratish kerak)
├── .env.example          # .env shabloni
├── sample_quiz.txt       # Test quiz fayli
├── README.md             # Bu fayl
└── temp/                 # Vaqtiy fayllar (avtomatik yaratiladi)
```

## 🛠️ Texnik Tafsilotlar

- **Kutubxona:** Telegraf v4.14
- **Node.js versiyasi:** 14.x yoki undan yuqori
- **Vaqt olchovi:** Sekund
- **Fayl o'lchami:** Maksimum 1MB

## 🐛 Muammolar Yechimi

### Bot javob bermaydi
- Bot tokeni to'g'ri ekanligini tekshiring
- .env faylida BOT_TOKEN mavjudligini tekshiring
- Bot tokenini @BotFather dan oling

### Fayl parse qilishmaydi
- TXT faylining formatini tekshiring
- To'g'ri javob "A" bilan boshlansa
- Savollar bo'sh satr bilan ajratilsa

### Bot guruhda ishlam haydi
- Botning "Group Privacy" o'chirilganligini tekshiring
- @BotFather ga yozing
- /mybots -> Botingizni tanlang -> Settings -> Group Privacy -> OFF

## 📞 Yordam

Muammolar yoki taklif uchun:
1. Faylning formatini tekshiring
2. Bot tokeni to'g'ri ekanligini tekshiring
3. Konsolda xatolarni ko'ring

## 📝 Lisenizya

MIT License

## 🎓 O'rganish Resurslari

- [Telegraf dokumentasiyasi](https://telegraf.js.org)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [JavaScript Async/Await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)

---

**Happy quizzing! 🎯**
