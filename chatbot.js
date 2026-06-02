const questionBank = [
    {
        keywords: ['deadline', 'due', 'when'],
        question: 'How do I track a deadline?',
        answer: 'Use the Opportunities page to review application dates, then add the most urgent items to your weekly plan.'
    },
    {
        keywords: ['skills', 'learn', 'improve'],
        question: 'What skills should I focus on?',
        answer: 'Focus on the stack you already use in class: semantic HTML, CSS layout, and basic JavaScript DOM work.'
    },
    {
        keywords: ['project', 'portfolio'],
        question: 'How can I improve my portfolio?',
        answer: 'Pick two or three projects with clear outcomes, then keep the descriptions short, specific, and consistent.'
    },
    {
        keywords: ['contact', 'email', 'reach'],
        question: 'How do I contact the site owner?',
        answer: 'Use the Apply page or the business card page to find the email link and GitHub profile.'
    }
];

const chatFeed = document.getElementById('chat-feed');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const suggestedQuestions = document.getElementById('suggested-questions');
const clearChatButton = document.getElementById('clear-chat');

function createMessage(text, role, label) {
    const message = document.createElement('article');
    message.className = `message ${role}`;

    const messageLabel = document.createElement('span');
    messageLabel.className = 'message-label';
    messageLabel.textContent = label;

    const paragraph = document.createElement('p');
    paragraph.textContent = text;

    message.appendChild(messageLabel);
    message.appendChild(paragraph);

    return message;
}

function scrollChatToBottom() {
    chatFeed.scrollTop = chatFeed.scrollHeight;
}

function findAnswer(userText) {
    const normalized = userText.trim().toLowerCase();

    for (const item of questionBank) {
        if (item.keywords.some((keyword) => normalized.includes(keyword))) {
            return item.answer;
        }
    }

    return 'I do not have that exact answer yet, but you can try asking about deadlines, skills, projects, or contact details.';
}

function addBotMessage(text) {
    chatFeed.appendChild(createMessage(text, 'bot', 'CareerTrack Bot'));
    scrollChatToBottom();
}

function addUserMessage(text) {
    chatFeed.appendChild(createMessage(text, 'user', 'You'));
    scrollChatToBottom();
}

function renderSuggestedQuestions() {
    questionBank.forEach((item) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'question-chip';
        chip.textContent = item.question;
        chip.addEventListener('click', () => {
            sendQuestion(item.question);
        });
        suggestedQuestions.appendChild(chip);
    });
}

function sendQuestion(questionText) {
    const question = (questionText || chatInput.value || '').trim();
    if (!question) return;

    addUserMessage(question);
    addBotMessage(findAnswer(question));
    chatInput.value = '';
    chatInput.focus();
}

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    sendQuestion();
});

clearChatButton.addEventListener('click', () => {
    chatFeed.replaceChildren();
    addBotMessage('Chat cleared. Ask about deadlines, skills, projects, or contact details.');
});

renderSuggestedQuestions();
addBotMessage('Hi, I am the CareerTrack helper. Pick a suggested question or type one below.');