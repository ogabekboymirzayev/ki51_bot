import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';

import { parseQuestions } from './utils/parser.js';
import { sessions, createSession, getSession, deleteSession, mapPollToSession, pollToSessionMap } from './state/session.js';
<<<<<<< HEAD
import { getRandomQuestions, getSequentialQuestions, shuffleOptions, formatResults, buildResultsText, shuffleArray } from './utils/helpers.js';
=======
import { getSequentialQuestions, shuffleArray, shuffleOptions, formatResults, buildResultsText } from './utils/helpers.js';
>>>>>>> 28d36a2 (boshqa guruh uchun)

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.BOT_TOKEN) {
    throw new Error('BOT_TOKEN topilmadi. .env faylni tekshiring.');
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

let questionCache = { mikro: [] };
const pollAnswerCounts = new Map(); // Track answer counts per poll

function loadQuestions() {
<<<<<<< HEAD
    const falsafaPath = path.join(__dirname, 'data', 'FALSAFA_uzb.txt');
    const dinshunoslikPath = path.join(__dirname, 'data', 'dinshunoslik.txt');
    const dinshunoslik2Path = path.join(__dirname, 'data', 'dinshunoslik2.txt');
=======
    const mikroPath = path.join(__dirname, 'data', 'mikro.txt');
>>>>>>> 28d36a2 (boshqa guruh uchun)

    try {
        const questions = parseQuestions(mikroPath);
        questionCache.mikro = questions;
        console.log(`Mikro savollar yuklab olingan: ${questions.length}`);
    } catch (err) {
<<<<<<< HEAD
        console.error('Falsafa faylini o\'qishda xato:', err);
        questionCache.falsafa = [];
    }

    try {
        const raw = parseQuestions(dinshunoslikPath);
        questionCache.dinshunoslik = shuffleArray(raw);
        console.log(`Dinshunoslik 1 savollar yuklab olingan: ${questionCache.dinshunoslik.length}`);
    } catch (err) {
        console.error('Dinshunoslik faylini o\'qishda xato:', err);
        questionCache.dinshunoslik = [];
=======
        console.error('Mikro.txt faylini o\'qishda xato:', err);
        questionCache.mikro = [];
>>>>>>> 28d36a2 (boshqa guruh uchun)
    }

    try {
        const raw2 = parseQuestions(dinshunoslik2Path);
        questionCache.dinshunoslik2 = shuffleArray(raw2);
        console.log(`Dinshunoslik 2 savollar yuklab olingan: ${questionCache.dinshunoslik2.length}`);
    } catch (err) {
        console.error('Dinshunoslik 2 faylini o\'qishda xato:', err);
        questionCache.dinshunoslik2 = [];
    }
}

loadQuestions();

// Helper function to send next question as quiz poll
async function sendNextQuestion(chatId) {
    const session = getSession(chatId);
    if (!session || session.state === 'finished') return;

    if (session.currentQuestionIndex >= session.questions.length) {
        await endQuiz(chatId);
        return;
    }

    const question = session.questions[session.currentQuestionIndex];
    const shuffled = shuffleOptions(question);

    // Calculate global question number for display
    const globalQuestionNum = session.startIndex + session.currentQuestionIndex + 1;

    const questionText = `[${globalQuestionNum}/${session.endIndex}] ${shuffled.question}`;

    try {
        const poll = await bot.sendPoll(chatId, questionText, shuffled.options, {
            type: 'quiz',
            correct_option_id: shuffled.correctAnswerIndex,
            is_anonymous: false,
            open_period: session.timerSeconds,
        });

        session.currentPollId = poll.poll.id;
        session.currentPollMessageId = poll.message_id;
        session.correctAnswerLetter = shuffled.correctAnswerLetter;
        session.correctAnswerText = shuffled.correctAnswerText;
        session.correctAnswerIndex = shuffled.correctAnswerIndex;

        // Initialize answer count for this poll
        pollAnswerCounts.set(poll.poll.id, 0);

        // Map poll ID to session chat ID for tracking answers
        mapPollToSession(poll.poll.id, chatId);

        // Set timer to move to next question after poll closes
        if (session.timerTimeoutId) {
            clearTimeout(session.timerTimeoutId);
        }

        session.timerTimeoutId = setTimeout(async () => {
            // Check if anyone answered
            const answerCount = pollAnswerCounts.get(poll.poll.id) || 0;
            pollAnswerCounts.delete(poll.poll.id);

            if (answerCount === 0) {
                // No one answered, auto-stop quiz
                await bot.sendMessage(chatId, '❌ Hech kim jami javob bermadi. Quiz to\'xtatildi.');
                deleteSession(chatId);
                return;
            }

            session.currentQuestionIndex++;
            await new Promise(resolve => setTimeout(resolve, 1000));
            await sendNextQuestion(chatId);
        }, session.timerSeconds * 1000 + 500);
    } catch (err) {
        console.error('Savol yuborish xatosi:', err);
    }
}

async function endQuiz(chatId) {
    const session = getSession(chatId);
    if (!session) return;

    if (session.timerTimeoutId) {
        clearTimeout(session.timerTimeoutId);
    }

    session.state = 'finished';

    if (session.userScores.size === 0) {
        await bot.sendMessage(chatId, '❌ Hech kim jami javob bermadi.');
        deleteSession(chatId);
    } else {
        const results = formatResults(session.userScores);
        const resultsText = buildResultsText(results);
        await bot.sendMessage(chatId, resultsText, { parse_mode: 'HTML' });

        // Ask if they want to continue with next 30 questions
        await bot.sendMessage(chatId, '🔄 Keyingi 30 savolni boshlaysizmi?', {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '✅ Ha, davom et', callback_data: `continue_${session.quizType}` },
                        { text: '❌ Yo\'q, tugat', callback_data: 'stop_quiz' },
                    ],
                ],
            },
        });
    }
}

// Start command
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    const isBotPrivate = msg.chat.type === 'private';

    if (isBotPrivate) {
        const text = `👋 Salom! Quizga xush kelibsiz!\n\nQuyidagi tugmani tanlang:`;
        await bot.sendMessage(chatId, text, {
            reply_markup: {
                inline_keyboard: [
<<<<<<< HEAD
                    [{ text: '📚 Falsafa', callback_data: 'quiz_falsafa' }],
                    [{ text: '🕌 Dinshunoslik 1', callback_data: 'quiz_dinshunoslik' }],
                    [{ text: '🕌 Dinshunoslik 2', callback_data: 'quiz_dinshunoslik2' }],
=======
                    [{ text: '📗 Mikroiqtisodiyot', callback_data: 'quiz_mikro' }],
>>>>>>> 28d36a2 (boshqa guruh uchun)
                ],
            },
        });
    } else {
<<<<<<< HEAD
        const text = `👋 Salom! Quizga xush kelibsiz!\n\n<b>Buyruqlar:</b>\n/falsafa - Falsafa quizi\n/dinshunoslik - Dinshunoslik 1 quizi\n/dinshunoslik2 - Dinshunoslik 2 quizi\n/stop - Quizni to'xtatish\n/getid - Chat ID\n/reload - Savollar faylini qayta yukla`;
=======
        const text = `👋 Salom! Quizga xush kelibsiz!\n\n<b>Buyruqlar:</b>\n/mikro - Mikroiqtisodiyot testi\n/stop - Quizni to'xtatish\n/getid - Chat ID\n/reload - Savollar faylini qayta yukla`;
>>>>>>> 28d36a2 (boshqa guruh uchun)
        await bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
    }
});

// /getid command
bot.onText(/\/getid/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, `Chat ID: <code>${chatId}</code>`, { parse_mode: 'HTML' });
});

// /reload command
bot.onText(/\/reload/, async (msg) => {
    loadQuestions();
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, '✅ Mikro savollar qayta yuklab olingan.');
});

// /mikro command
bot.onText(/\/mikro/, async (msg) => {
    const chatId = msg.chat.id;

    if (getSession(chatId)) {
        await bot.sendMessage(chatId, '⚠️ Allaqachon quiz davom etmoqda.');
        return;
    }

    const text = '⏱️ Vaqtni tanlang:';
    await bot.sendMessage(chatId, text, {
        reply_markup: {
            inline_keyboard: [
                [
<<<<<<< HEAD
                    { text: '10s', callback_data: 'timer_falsafa_10' },
                    { text: '15s', callback_data: 'timer_falsafa_15' },
                    { text: '20s', callback_data: 'timer_falsafa_20' },
                    { text: '25s', callback_data: 'timer_falsafa_25' },
                ],
            ],
        },
    });
});

// /dinshunoslik2 command
bot.onText(/\/dinshunoslik2/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const isInGroup = await isInRequiredGroup(userId);
    if (!isInGroup) {
        await bot.sendMessage(chatId, 'Admin bilan bog\'laning: @ogabek_boymirzayev');
        return;
    }

    if (msg.chat.type !== 'private') {
        const isMember = await isGroupMember(chatId, userId);
        if (!isMember) {
            await bot.sendMessage(chatId, 'Admin bilan bog\'laning: @ogabek_boymirzayev');
            return;
        }
    }

    if (getSession(chatId)) {
        await bot.sendMessage(chatId, '⚠️ Allaqachon quiz davom etmoqda.');
        return;
    }

    const text = '⏱️ Vaqtni tanlang:';
    await bot.sendMessage(chatId, text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '10s', callback_data: 'timer_dinshunoslik2_10' },
                    { text: '15s', callback_data: 'timer_dinshunoslik2_15' },
                    { text: '20s', callback_data: 'timer_dinshunoslik2_20' },
                    { text: '25s', callback_data: 'timer_dinshunoslik2_25' },
                ],
            ],
        },
    });
});

// /dinshunoslik command
bot.onText(/\/dinshunoslik/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    // Check if user is in required group
    const isInGroup = await isInRequiredGroup(userId);
    if (!isInGroup) {
        await bot.sendMessage(chatId, 'Admin bilan bog\'laning: @ogabek_boymirzayev');
        return;
    }

    if (msg.chat.type !== 'private') {
        const isMember = await isGroupMember(chatId, userId);
        if (!isMember) {
            await bot.sendMessage(chatId, 'Admin bilan bog\'laning: @ogabek_boymirzayev');
            return;
        }
    }

    if (getSession(chatId)) {
        await bot.sendMessage(chatId, '⚠️ Allaqachon quiz davom etmoqda.');
        return;
    }

    const text = '⏱️ Vaqtni tanlang:';
    await bot.sendMessage(chatId, text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '10s', callback_data: 'timer_dinshunoslik_10' },
                    { text: '15s', callback_data: 'timer_dinshunoslik_15' },
                    { text: '20s', callback_data: 'timer_dinshunoslik_20' },
                    { text: '25s', callback_data: 'timer_dinshunoslik_25' },
=======
                    { text: '10s', callback_data: 'timer_mikro_10' },
                    { text: '15s', callback_data: 'timer_mikro_15' },
                    { text: '20s', callback_data: 'timer_mikro_20' },
                    { text: '25s', callback_data: 'timer_mikro_25' },
>>>>>>> 28d36a2 (boshqa guruh uchun)
                ],
            ],
        },
    });
});

// /davom command (for groups to continue quiz)
bot.onText(/\/davom/, async (msg) => {
    const chatId = msg.chat.id;
    const session = getSession(chatId);

    if (!session || session.state === 'finished') {
        await bot.sendMessage(chatId, '❌ Quiz davom etmayapti.');
        return;
    }

    // Resume quiz
    session.state = 'running';
    session.answeredUsers.clear();
    session.currentQuestionIndex++;

    await bot.sendMessage(chatId, '🚀 Quiz davom etmoqda...');
    await sendNextQuestion(chatId);
});

// /stop command
bot.onText(/\/stop/, async (msg) => {
    const chatId = msg.chat.id;
    const session = getSession(chatId);

    if (!session) {
        await bot.sendMessage(chatId, '❌ Quiz davom etmayapti.');
        return;
    }

    await endQuiz(chatId);
    await bot.sendMessage(chatId, '⏹️ Quiz to\'xtatildi.');
});

// Callback query handler for timer selection and quiz type
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const chatType = query.message.chat.type;
    const userId = query.from.id;
    const data = query.data;

    try {
        // Handle quiz type selection (private chat)
<<<<<<< HEAD
        if (data === 'quiz_falsafa' || data === 'quiz_dinshunoslik' || data === 'quiz_dinshunoslik2') {
            const quizType = data === 'quiz_falsafa' ? 'falsafa' : data === 'quiz_dinshunoslik' ? 'dinshunoslik' : 'dinshunoslik2';
=======
        if (data === 'quiz_mikro') {
            const quizType = 'mikro';
>>>>>>> 28d36a2 (boshqa guruh uchun)
            const text = '⏱️ Vaqtni tanlang:';
            await bot.editMessageText(text, {
                chat_id: chatId,
                message_id: query.message.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: '10s', callback_data: 'timer_mikro_10' },
                            { text: '15s', callback_data: 'timer_mikro_15' },
                            { text: '20s', callback_data: 'timer_mikro_20' },
                            { text: '25s', callback_data: 'timer_mikro_25' },
                        ],
                    ],
                },
            });
            await bot.answerCallbackQuery(query.id);
            return;
        }

        // Handle timer selection -> show range selection
        // Handle timer selection -> show range selection
        const timerMatch = data.match(/^timer_(\w+)_(\d+)$/);
        if (timerMatch) {
            const quizType = timerMatch[1];
            const timerSeconds = parseInt(timerMatch[2]);

            if (getSession(chatId)) {
                await bot.answerCallbackQuery(query.id, { text: 'Quiz allaqachon davom etmoqda', show_alert: true });
                return;
            }

            if (!questionCache[quizType] || questionCache[quizType].length === 0) {
                await bot.answerCallbackQuery(query.id, { text: 'Savollar topilmadi', show_alert: true });
                return;
            }

            // Dinamik guruhlar hisoblash
            const total = questionCache[quizType].length;
            const chunkSize = 30;
            const buttons = [];
            const row = [];

            for (let start = 0; start < total; start += chunkSize) {
                const end = Math.min(start + chunkSize, total);
                const label = `${start + 1}-${end}`;
                row.push({
                    text: label,
                    callback_data: `range_${quizType}_${timerSeconds}_${start}_${end}`
                });

                // Har qatorda max 3 ta button
                if (row.length === 3) {
                    buttons.push([...row]);
                    row.length = 0;
                }
            }

            // Qolgan buttonlar
            if (row.length > 0) {
                buttons.push([...row]);
            }

            await bot.editMessageText('📋 Qaysi savollar guruhini tanlaysiz?', {
                chat_id: chatId,
                message_id: query.message.message_id,
                reply_markup: { inline_keyboard: buttons },
            });

            await bot.answerCallbackQuery(query.id);
            return;
        }

        // Handle range selection -> start quiz
        const rangeMatch = data.match(/^range_(\w+)_(\d+)_(\d+)_(\d+)$/);
        if (rangeMatch) {
            const quizType = rangeMatch[1];
            const timerSeconds = parseInt(rangeMatch[2]);
            const startIndex = parseInt(rangeMatch[3]);
            const endIndex = parseInt(rangeMatch[4]);

            if (getSession(chatId)) {
                await bot.answerCallbackQuery(query.id, { text: 'Quiz allaqachon davom etmoqda', show_alert: true });
                return;
            }

            const session = createSession(chatId, quizType, timerSeconds, startIndex, endIndex, chatType);
            session.questions = getSequentialQuestions(questionCache[quizType], startIndex, endIndex);

            await bot.editMessageText('🚀 Quiz boshlanmoqda...', {
                chat_id: chatId,
                message_id: query.message.message_id,
                reply_markup: { inline_keyboard: [] },
            });

            await sendNextQuestion(chatId);
            await bot.answerCallbackQuery(query.id);
            return;
        }

        // Handle continue quiz
        const continueMatch = data.match(/^continue_(\w+)$/);
        if (continueMatch) {
            const quizType = continueMatch[1];
            const session = getSession(chatId);

            if (!session) {
                // Create new session with first range
                const newSession = createSession(chatId, quizType, 20, 0, 30, chatType);
                newSession.questions = getSequentialQuestions(questionCache[quizType], 0, 30);
                await bot.sendMessage(chatId, '🚀 Keyingi 30 savol boshlanmoqda...');
                await sendNextQuestion(chatId);
            } else {
                // Continue with next range
                const nextStartIndex = session.endIndex;
                const nextEndIndex = Math.min(session.endIndex + 30, questionCache[quizType].length);

                // Check if there are more questions available
                if (nextStartIndex >= questionCache[quizType].length) {
<<<<<<< HEAD
                    await bot.sendMessage(chatId, '✅ Barcha savollar tugadi! Yangi quizni /falsafa, /dinshunoslik yoki /dinshunoslik2 buyrug\'i bilan boshlang.');
=======
                    await bot.sendMessage(chatId, '✅ Barcha savollar tugadi! Yangi quizni /mikro buyrug\'i bilan boshlang.');
>>>>>>> 28d36a2 (boshqa guruh uchun)
                    deleteSession(chatId);
                    await bot.answerCallbackQuery(query.id);
                    return;
                }

                session.state = 'running';
                session.answeredUsers.clear();
                session.startIndex = nextStartIndex;
                session.endIndex = nextEndIndex;
                session.questions = getSequentialQuestions(questionCache[quizType], nextStartIndex, nextEndIndex);
                session.currentQuestionIndex = 0;

                await bot.sendMessage(chatId, `🚀 Keyingi 30 savol boshlanmoqda... (${nextStartIndex + 1}-${nextEndIndex})`);
                await sendNextQuestion(chatId);
            }
            await bot.answerCallbackQuery(query.id);
            return;
        }

        // Handle stop quiz from continue prompt
        if (data === 'stop_quiz') {
            const session = getSession(chatId);
            if (session) {
                deleteSession(chatId);
            }
            await bot.sendMessage(chatId, '⏹️ Quiz tugadi. Raxmat o\'yinlashganizlar uchun! 👋');
            await bot.answerCallbackQuery(query.id);
            return;
        }

        await bot.answerCallbackQuery(query.id);
    } catch (err) {
        console.error('Callback query xatosi:', err);
        await bot.answerCallbackQuery(query.id);
    }
});

// Poll handler - automatically handles score tracking
bot.on('poll_answer', async (pollAnswer) => {
    const chatId = pollToSessionMap.get(pollAnswer.poll_id);
    if (!chatId) return;

    const session = getSession(chatId);
    if (!session) return;

    const currentCount = (pollAnswerCounts.get(pollAnswer.poll_id) || 0) + 1;
    pollAnswerCounts.set(pollAnswer.poll_id, currentCount);

    const userId = pollAnswer.user_id;

    // User ismini olish
    let userName = 'Foydalanuvchi';
    if (pollAnswer.user) {
        const user = pollAnswer.user;
        if (user.first_name || user.last_name) {
            userName = [user.first_name, user.last_name].filter(Boolean).join(' ');
        } else if (user.username) {
            userName = '@' + user.username;
        } else {
            userName = 'User ' + userId;
        }
    }

    if (!session.userScores.has(userId)) {
        session.userScores.set(userId, {
            name: userName,
            correct: 0,
            total: 0,
        });
    } else {
        // Ism yangilash (ba'zan birinchi marta undefined keladi)
        const existing = session.userScores.get(userId);
        if (!existing.name || existing.name.startsWith('User ')) {
            existing.name = userName;
        }
    }

    const userScore = session.userScores.get(userId);
    userScore.total++;

    if (pollAnswer.option_ids && pollAnswer.option_ids.includes(session.correctAnswerIndex)) {
        userScore.correct++;
    }

    // If this is a private chat (one-on-one), advance to next question immediately
    try {
        if (session.chatType === 'private') {
            // Prevent multiple triggers from same user
            if (!session.answeredUsers.has(userId)) {
                session.answeredUsers.add(userId);

                // clear any poll timeout
                if (session.timerTimeoutId) {
                    clearTimeout(session.timerTimeoutId);
                    session.timerTimeoutId = null;
                }

                // Close the poll immediately so it behaves like timer hit 0
                if (session.currentPollMessageId) {
                    try {
                        await bot.stopPoll(chatId, session.currentPollMessageId);
                    } catch (stopErr) {
                        console.error('Private poll toxtatish xatosi:', stopErr);
                    }
                }

                // Move to next question
                session.currentQuestionIndex++;
                session.answeredUsers.clear();
                await sendNextQuestion(chatId);
            }
        }
    } catch (err) {
        console.error('Private chat next-question xatosi:', err);
    }
});

bot.on('polling_error', (error) => {
    console.error('Polling xatosi:', error);
});

console.log('🤖 Quiz bot ishga tushdi!');
