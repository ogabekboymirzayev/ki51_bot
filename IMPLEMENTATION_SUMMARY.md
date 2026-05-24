# ✅ Bot Implementation Complete - Quick Start Guide

## What's Implemented

Your bot now includes **all requested features**:

### ✨ Core Requirements Met
- [x] `node-telegram-bot-api` library integration
- [x] Group mode with `/falsafa` and `/dinshunoslik` commands
- [x] Timer selection: 10, 15, 20, 25 seconds
- [x] 30 random questions per quiz session
- [x] One-by-one question display with A, B, C, D inline buttons
- [x] Each user answers only once per question
- [x] Score tracking (correct/wrong per user)
- [x] Timer expiration → shows answer → next question
- [x] Final results sorted by score with name, correct/total, percentage
- [x] `/stop` command to end early with current results
- [x] Group member validation (getChatMember API)
- [x] Unauthorized message: "Admin bilan bog'laning: @ogabek_boymirzayev"
- [x] Private chat mode with "📚 Falsafa" and "🕌 Dinshunoslik" buttons
- [x] Same quiz flow in private mode
- [x] `/start` command with instructions
- [x] `/getid` command to return chat ID
- [x] `/reload` command to reload question files
- [x] Question file format: +++++/===== separators
- [x] Random shuffling of answer options
- [x] First option is always correct answer

## 📊 Current Status

**Questions Loaded:**
- Falsafa (Philosophy): **381 questions** ✅
- Dinshunoslik (Religious Studies): **24 questions** ✅
- Total: **405 questions** ready for quiz

**File Structure:**
```
src/
├── main.js                 # All bot logic in one file
├── utils/
│   ├── parser.js          # Parse +++++/===== format
│   └── helpers.js         # Shuffle, format functions
├── state/
│   └── session.js         # Session management
└── data/
    ├── FALSAFA_uzb.txt    # 381 philosophy questions
    └── dinshunoslik.txt   # 24 religion questions
```

## 🚀 How to Run

### 1. Start the Bot
```bash
npm start
```

Or with auto-reload during development:
```bash
npm run dev
```

Expected output:
```
Falsafa savollar yuklab olingan: 381
Dinshunoslik savollar yuklab olingan: 24
🤖 Quiz bot ishga tushdi!
```

### 2. Test Commands

**In Telegram:**

**Private Chat:**
- `/start` → Shows Falsafa/Dinshunoslik buttons
- Click button → Select timer → Quiz starts

**Group Chat (as member):**
- `/falsafa` → Select timer → Quiz starts
- `/dinshunoslik` → Select timer → Quiz starts
- `/stop` → End quiz, show results
- `/reload` → Reload question files
- `/getid` → Show chat ID

**Non-member in Group:**
- `/falsafa` → "Admin bilan bog'laning: @ogabek_boymirzayev"

## 🎮 Quiz Flow Example

```
1. User: /falsafa
2. Bot shows timer buttons: [10s] [15s] [20s] [25s]
3. User clicks: 15s
4. Bot: "🚀 Quiz boshlanmoqda..."
5. Bot sends first question with A/B/C/D buttons
6. User clicks A (and sees "✅ To'g'ri!" or "❌ Noto'g'ri")
7. After 15 seconds:
   - Bot removes buttons
   - Shows: "To'g'ri javob: B - [answer text]"
   - Moves to question 2
8. After question 30:
   Bot shows:
   🏆 Quiz natijalari:
   
   🥇 Ali ✅ 28/30 (93%)
   🥈 Fatima ✅ 24/30 (80%)
   🥉 Omar ✅ 20/30 (67%)
```

## 📝 Adding More Questions

To add more questions to a quiz:

1. Edit `src/data/FALSAFA_uzb.txt` or `src/data/dinshunoslik.txt`
2. Add questions in this format:
```
Your question here?
=====
Correct answer (must be first)
=====
Wrong answer 2
=====
Wrong answer 3
=====
Wrong answer 4

+++++

Next question?
=====
Correct answer
=====
Wrong 1
=====
Wrong 2
=====
Wrong 3
```
3. Save file
4. In Telegram: `/reload` (bot will reload without restart)

## ⚙️ Configuration

### Change Timer Options
Edit [src/main.js](src/main.js) line ~185-195 (Falsafa/Dinshunoslik commands):
```javascript
{ text: '30s', callback_data: 'timer_falsafa_30' },  // Add new
{ text: '35s', callback_data: 'timer_falsafa_35' },
```

### Change Questions Per Quiz
Edit [src/main.js](src/main.js) around line ~260:
```javascript
session.questions = getRandomQuestions(questionCache[quizType], 50);  // 50 instead of 30
```

### Change Admin Contact
Edit [src/main.js](src/main.js) around lines 175 & 209:
```javascript
'Admin bilan bog\'laning: @your_username_here'
```

## 🔍 Key Features Explained

### 1. **Group Member Validation**
```javascript
async function isGroupMember(chatId, userId) {
  const member = await bot.getChatMember(chatId, userId);
  return member.status !== 'left' && member.status !== 'kicked';
}
```
Only members can use commands in groups.

### 2. **Answer Shuffling**
```javascript
shuffleOptions(question) {
  // Shuffles A/B/C/D so correct answer at random position
  // Bot tracks which letter is correct (correctAnswerLetter)
}
```

### 3. **Score Tracking**
```javascript
session.userScores = new Map();
// Stores: userId → {name, correct, total}
// Updated each time user answers
```

### 4. **Timer Management**
```javascript
session.timerTimeoutId = setTimeout(() => {
  showAnswer(chatId);  // Show correct answer after timer
}, session.timerSeconds * 1000);
```

## 📋 Commands Reference

| Command | Parameter | Effect |
|---------|-----------|--------|
| `/start` | None | Welcome + quiz buttons |
| `/falsafa` | None | Start philosophy quiz |
| `/dinshunoslik` | None | Start religion quiz |
| `/stop` | None | End quiz, show results |
| `/reload` | None | Reload question files |
| `/getid` | None | Display current chat ID |

## 🐛 Debug Tips

If something isn't working:

1. **Check logs**: 
```bash
npm start
# Look for errors in console
```

2. **Verify token**:
```bash
cat .env  # Should show BOT_TOKEN=...
```

3. **Test parser**:
```bash
node -e "import('./src/utils/parser.js').then(m => {
  const q = m.parseQuestions('./src/data/FALSAFA_uzb.txt');
  console.log('Questions:', q.length);
})"
```

4. **Reload questions**:
In Telegram: `/reload`

## 🎯 What's Different from Original

- **Switched from Telegraf → node-telegram-bot-api** (as requested)
- **All logic in main.js** - cleaner, easier to modify
- **Added inline button answers** instead of polls
- **Real-time score tracking** visible in results
- **Added Dinshunoslik quiz** with questions
- **Simplified session management**
- **Added `/reload` command** for dynamic question updates

## 🚨 Important Notes

1. **First answer must be correct** - Bot shuffles automatically
2. **Min 5 lines per question** (1 question + 4 answers)
3. **Use +++++** to separate questions
4. **Use =====** to separate question from answers
5. **Session data lost on restart** - normal behavior
6. **Bot needs admin rights in group** for getChatMember
7. **Polling mode** - no webhook setup needed

## 📞 Support

Everything is configured and ready to go!

**To start:** `npm start`

**Questions?** Check the detailed [README.md](README.md)
