// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path');
// const session = require('express-session');

// const app = express();
// const PORT = process.env.PORT || 8000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());
// app.use(session({
//   secret: 'your_secret_key',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false } // Set to true if using HTTPS
// }));

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://ziyadkomakkal:vMkgHamkU48Zb0UZ@cluster0.t3c2a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// // Define a schema and model for storing chat data
// const chatSchema = new mongoose.Schema({
//   userId: String,
//   language: String,
//   name: String,
//   phone: String,
//   action: String,
//   createdAt: { type: Date, default: Date.now },
// });

// const Chat = mongoose.model('Chat', chatSchema);

// // Initial messages
// const initialMessages = {
//   en: {
//     greeting: 'Hi',
//     languageSelection: 'Choose language',
//     languageOptions: ['English', 'മലയാളം'],
//     namePrompt: 'What is your name?',
//     phonePrompt: 'What is your phone number?',
//     actionPrompt: 'What would you like to do?',
//     actionOptions: ['Company incorporation', 'Trademark', 'Subsidy'],
//     thankYou: 'Your information has been saved. Thank you!',
//   },
//   ml: {
//     greeting: 'ഹലോ',
//     languageSelection: 'ഭാ തിരഞ്ചെയ്‌ക്കുക',
//     languageOptions: ['ഇംഗ്ലീഷ്‍', 'മലയാളം'],
//     namePrompt: 'നിങ്ങളുടെ പേര്‍ എന്നത്?',
//     phonePrompt: 'നിങ്ങളുടെ ഫോൺ നമ്മർ എന്നത്?',
//     actionPrompt: 'നിങ്ങൾ എന്ത് ചെയ്യണം ചെയ്യണം?',
//     actionOptions: ['കമ്പനി ഇൻകോപോറേഷൻ', 'ട്രാഡ്മാർക്', 'സബ്സിഡി'],
//     thankYou: 'നിങ്ങളുടെ വിവരങ്ങൾ സംഭാവനിച്ചതാണ്. ധന്യാഭാവം!',
//   },
// };

// // Define states
// const STATES = {
//   GREETING: 'GREETING',
//   LANGUAGE_SELECTION: 'LANGUAGE_SELECTION',
//   NAME_PROMPT: 'NAME_PROMPT',
//   PHONE_PROMPT: 'PHONE_PROMPT',
//   ACTION_PROMPT: 'ACTION_PROMPT',
//   THANK_YOU: 'THANK_YOU',
// };

// // Handle incoming messages
// app.post('/webhook', async (req, res) => {
//   const userMessage = req.body.message;
//   const userId = req.session.userId || req.body.userId;
//   let language = req.session.language || 'en';

//   if (!userId) {
//     req.session.userId = 'user_' + Math.random().toString(36).substr(2, 9);
//     req.session.language = 'en';
//     req.session.state = STATES.GREETING;
//     req.session.name = '';
//     req.session.phone = '';
//     req.session.action = '';
//   }

//   const chatHistory = req.session.chatHistory || [];
//   let currentState = req.session.state;

//   // Add user message to chat history
//   chatHistory.push({ id: chatHistory.length.toString(), type: 'user', text: userMessage });

//   // Process user message based on current state
//   let responseMessage;
//   let options = [];

//   switch (currentState) {
//     case STATES.GREETING:
//       responseMessage = initialMessages[language].greeting;
//       chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

//       responseMessage = initialMessages[language].languageSelection;
//       options = initialMessages[language].languageOptions;
//       chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage, options });

//       currentState = STATES.LANGUAGE_SELECTION;
//       break;

//     case STATES.LANGUAGE_SELECTION:
//       language = userMessage.toLowerCase().includes('മലയാളം') ? 'ml' : 'en';
//       responseMessage = initialMessages[language].languageSelection + ': ' + userMessage;
//       chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

//       responseMessage = initialMessages[language].namePrompt;
//       chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

//       currentState = STATES.NAME_PROMPT;
//       break;

//     case STATES.NAME_PROMPT:
//       const name = userMessage;
//       responseMessage = initialMessages[language].namePrompt + ': ' + userMessage;
//       chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

//       responseMessage = initialMessages[language].phonePrompt;
//       chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

//       currentState = STATES.PHONE_PROMPT;
//       req.session.name = name;
//       break;

//     case STATES.PHONE_PROMPT:
//       const phone = userMessage;
//       responseMessage = initialMessages[language].phonePrompt + ': ' + userMessage;
//       chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

//       responseMessage = initialMessages[language].actionPrompt;
//       options = initialMessages[language].actionOptions;
//       chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage, options });

//       currentState = STATES.ACTION_PROMPT;
//       req.session.phone = phone;
//       break;

//     case STATES.ACTION_PROMPT:
//       const action = userMessage;
//       responseMessage = initialMessages[language].actionPrompt + ': ' + userMessage;
//       chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

//       responseMessage = initialMessages[language].thankYou;
//       chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

//       // Save the chat entry to the database
//       const chatData = new Chat({
//         userId: userId,
//         language: language,
//         name: req.session.name,
//         phone: req.session.phone,
//         action: action,
//       });

//       await chatData.save();

//       // Reset conversation
//       chatHistory.length = 0;
//       currentState = STATES.GREETING;
//       req.session.language = 'en';
//       req.session.name = '';
//       req.session.phone = '';
//       req.session.action = '';
//       break;

//     default:
//       responseMessage = 'നിങ്ങളുടെ സന്ദേശം പിന്തുണിച്ചില്ല. അദ്ദേഹത്തിനു പുനഃശുരുകാർ ചെയ്യുക.';
//       chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

//       // Reset conversation
//       chatHistory.length = 0;
//       currentState = STATES.GREETING;
//       req.session.language = 'en';
//       req.session.name = '';
//       req.session.phone = '';
//       req.session.action = '';
//       break;
//   }

//   req.session.chatHistory = chatHistory;
//   req.session.state = currentState;

//   res.json({ chatHistory, language });
// });

// app.get('/chat-history/:userId', (req, res) => {
//    const userId = req.params.userId;
//    const chatHistory = req.session.chatHistory || [];
//   res.json({ chatHistory });
// });

// // Admin page to list all chat entries
// app.get('/admin', (req, res) => {
//     res.sendFile(path.join(__dirname, 'admin.html'));
//   });
  
//   // Admin data endpoint
//   app.get('/admin-data', async (req, res) => {
//     try {
//       const chats = await Chat.find();
//       res.json(chats);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });

// // Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });





const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'your_secret_key',
  resave: true, // Ensures that the session is saved back to the store
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Connect to MongoDB
mongoose.connect('mongodb+srv://ziyadkomakkal:vMkgHamkU48Zb0UZ@cluster0.t3c2a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema and model for storing chat data
const chatSchema = new mongoose.Schema({
  userId: String,
  language: String,
  name: String,
  phone: String,
  action: String,
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', chatSchema);

// Initial messages
const initialMessages = {
  en: {
    greeting: 'Hi',
    languageSelection: 'Choose language',
    languageOptions: ['English', 'മലയാളം'],
    namePrompt: 'What is your name?',
    phonePrompt: 'What is your phone number?',
    actionPrompt: 'What would you like to do?',
    actionOptions: ['Company incorporation', 'Trademark', 'Subsidy'],
    thankYou: 'Your information has been saved. Thank you!',
  },
  ml: {
    greeting: 'ഹലോ',
    languageSelection: 'ഭാ തിരഞ്ചെയ്‌ക്കുക',
    languageOptions: ['ഇംഗ്ലീഷ്‍', 'മലയാളം'],
    namePrompt: 'നിങ്ങളുടെ പേര്‍ എന്നത്?',
    phonePrompt: 'നിങ്ങളുടെ ഫോൺ നമ്പർ എന്നത്?',
    actionPrompt: 'നിങ്ങൾ എന്ത് ചെയ്യണം ചെയ്യണം?',
    actionOptions: ['കമ്പനി ഇൻകോപോറേഷൻ', 'ട്രാഡ്മാർക്', 'സബ്സിഡി'],
    thankYou: 'നിങ്ങളുടെ വിവരങ്ങൾ സംഭാവനിച്ചതാണ്. ധന്യാധാനം!',
  },
};

// Define states
const STATES = {
  GREETING: 'GREETING',
  LANGUAGE_SELECTION: 'LANGUAGE_SELECTION',
  NAME_PROMPT: 'NAME_PROMPT',
  PHONE_PROMPT: 'PHONE_PROMPT',
  ACTION_PROMPT: 'ACTION_PROMPT',
  THANK_YOU: 'THANK_YOU',
};

// Handle incoming messages
app.post('/webhook', async (req, res) => {
  const userMessage = req.body.message;
  let userId = req.session.userId || req.body.userId;
  let language = req.session.language || 'en';
  let currentState = req.session.state || STATES.GREETING;
  
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    req.session.userId = userId;
    req.session.language = language;
    req.session.state = STATES.GREETING;
    req.session.name = '';
    req.session.phone = '';
    req.session.action = '';
  }

  const chatHistory = req.session.chatHistory || [];
  // Add user message to chat history
  chatHistory.push({ id: chatHistory.length.toString(), type: 'user', text: userMessage });

  // Process user message based on current state
  let responseMessage;
  let options = [];

  switch (currentState) {
    case STATES.GREETING:
      responseMessage = initialMessages[language].greeting;
      chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

      responseMessage = initialMessages[language].languageSelection;
      options = initialMessages[language].languageOptions;
      chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage, options });

      currentState = STATES.LANGUAGE_SELECTION;
      break;

    case STATES.LANGUAGE_SELECTION:
      language = userMessage.toLowerCase().includes('മലയാളം') ? 'ml' : 'en';
      responseMessage = initialMessages[language].languageSelection + ': ' + userMessage;
      chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

      responseMessage = initialMessages[language].namePrompt;
      chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

      currentState = STATES.NAME_PROMPT;
      break;

    case STATES.NAME_PROMPT:
      const name = userMessage;
      responseMessage = initialMessages[language].namePrompt + ': ' + userMessage;
      chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

      responseMessage = initialMessages[language].phonePrompt;
      chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

      currentState = STATES.PHONE_PROMPT;
      req.session.name = name;
      break;

    case STATES.PHONE_PROMPT:
      const phone = userMessage;
      responseMessage = initialMessages[language].phonePrompt + ': ' + userMessage;
      chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

      responseMessage = initialMessages[language].actionPrompt;
      options = initialMessages[language].actionOptions;
      chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage, options });

      currentState = STATES.ACTION_PROMPT;
      req.session.phone = phone;
      break;

    case STATES.ACTION_PROMPT:
      const action = userMessage;
      responseMessage = initialMessages[language].actionPrompt + ': ' + userMessage;
      chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

      responseMessage = initialMessages[language].thankYou;
      chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

      // Save the chat entry to the database
      const chatData = new Chat({
        userId: userId,
        language: language,
        name: req.session.name,
        phone: req.session.phone,
        action: action,
      });

      await chatData.save();

      // Reset conversation if needed or leave the user in 'THANK_YOU' state
      currentState = STATES.THANK_YOU; // Do not reset to GREETING unless a new conversation is desired.
      break;

    default:
      responseMessage = 'Invalid message. Please start again.';
      chatHistory.push({ id: chatHistory.length.toString(), type: 'bot', text: responseMessage });

      // Optionally reset conversation
      chatHistory.length = 0;
      currentState = STATES.GREETING;
      req.session.language = 'en';
      req.session.name = '';
      req.session.phone = '';
      req.session.action = '';
      break;
  }

  // Save session state and chat history
  req.session.chatHistory = chatHistory;
  req.session.state = currentState;

  res.json({ chatHistory, language });
});

// Admin page to list all chat entries
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Admin data endpoint
app.get('/admin-data', async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
