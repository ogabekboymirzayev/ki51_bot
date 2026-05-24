# 🎯 QUICK REFERENCE CARD - Telegram Quiz Bot

## ⚡ Quick Start (30 seconds)

```bash
cd "New Folder (Copy)"
npm start
```

✅ Bot will load 381 + 24 = 405 questions and start polling Telegram

---

## 🎮 Test Commands in Telegram

### Private Chat Test
1. Send: `/start`
2. Tap: `📚 Falsafa`
3. Tap: `15s`
4. Quiz starts → Tap A/B/C/D for each question
5. After 30 questions → See ranked results

### Group Chat Test (as member)
1. Send: `/falsafa`
2. Tap: `20s`
3. Quiz starts → Multiple users can answer
4. `/stop` to end early and see results

### Group Chat Test (as non-member)
1. Send: `/falsafa`
2. Bot responds: "Admin bilan bog'laning: @ogabek_boymirzayev" ✓

### Other Commands
- `/getid` → Shows chat ID
- `/reload` → Reload questions
- `/start` → Show help (group) or buttons (private)

---

## 📊 Quiz Flow Overview

```
User: /falsafa or clicks 📚 Falsafa
  ↓
Select timer: [10s] [15s] [20s] [25s]
  ↓
Bot: "🚀 Quiz boshlanmoqda..."
  ↓
Question 1-30 loop:
  ├─ Send question with A/B/C/D buttons
  ├─ User clicks answer (once only)
  ├─ Show "✅ To'g'ri!" or "❌ Noto'g'ri"
  ├─ Wait timer (15 seconds default)
  ├─ Show correct answer
  └─ Move to next
  ↓
Final: Show ranked results with scores
```

---

## 🔧 Configuration Quick Changes

**Add timer option:**
Edit `src/main.js` line 185:
```javascript
{ text: '30s', callback_data: 'timer_falsafa_30' }
```

**Change questions per quiz:**
Edit `src/main.js` line 260:
```javascript
session.questions = getRandomQuestions(questionCache[quizType], 50); // was 30
```

**Change admin contact:**
Edit `src/main.js` lines 175 & 209:
```javascript
'Admin bilan bog\'laning: @YOUR_USERNAME'
```

---

## 📋 File Locations

| File | Purpose |
|------|---------|
| `.env` | Bot token (keep secret!) |
| `src/main.js` | All bot code |
| `src/data/FALSAFA_uzb.txt` | 381 philosophy questions |
| `src/data/dinshunoslik.txt` | 24 religion questions |
| `README.md` | Full documentation |

---

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| Bot not responding | Check `.env` for BOT_TOKEN |
| No questions loading | Check file format: +++++/===== separators |
| Non-member can answer | Bot needs admin rights in group |
| Answers always wrong | Verify first line in file is correct answer |

---

## 🎯 What's Implemented

✅ node-telegram-bot-api (not Telegraf)  
✅ Group & private modes  
✅ Timer selection: 10/15/20/25s  
✅ 30 random questions per quiz  
✅ One answer per user per question  
✅ Score tracking & ranking  
✅ Group member validation  
✅ /start /falsafa /dinshunoslik /stop /reload /getid  
✅ Random answer shuffling  
✅ UTF-8 Uzbek text support  

---

## 💡 Pro Tips

1. **Use `/reload`** after adding new questions (no restart needed)
2. **15-20 seconds** is best timer for complex questions
3. **First answer in file** must always be correct
4. **Add 4 wrong answers** for each question (exactly)
5. **Use `+++++`** to separate questions
6. **Use `=====`** to separate question from answers

---

## 🚀 Deploy

```bash
npm start          # Production
npm run dev        # Development with auto-reload
```

Expected: `🤖 Quiz bot ishga tushdi!`

---

Last verified: May 16, 2026 ✅
