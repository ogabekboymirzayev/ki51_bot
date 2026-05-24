export const sessions = new Map();
export const pollToSessionMap = new Map();  // Map poll ID to chat ID

export function createSession(chatId, quizType, timerSeconds, startIndex = 0, endIndex = 30, chatType = 'group') {
  const session = {
    chatId,
    quizType,
    timerSeconds,
    startIndex,
    endIndex,
    chatType,
    questions: [],
    currentQuestionIndex: 0,
    userScores: new Map(),
    answeredUsers: new Set(),
    currentPollId: null,
    currentPollMessageId: null,
    timerTimeoutId: null,
    state: 'running',
  };
  sessions.set(chatId, session);
  return session;
}

export function getSession(chatId) {
  return sessions.get(chatId);
}

export function deleteSession(chatId) {
  const session = sessions.get(chatId);
  if (session && session.timerTimeoutId) {
    clearTimeout(session.timerTimeoutId);
  }
  if (session && session.currentPollId) {
    pollToSessionMap.delete(session.currentPollId);
  }
  sessions.delete(chatId);
}

export function mapPollToSession(pollId, chatId) {
  pollToSessionMap.set(pollId, chatId);
}
