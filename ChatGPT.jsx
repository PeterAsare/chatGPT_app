import React, { useState, useRef, useEffect } from "react";
import ucc from './assets/ucc.png';
import './ChatGPT_APP.css';
import UpgradeModal from './UpgradeModal'; // --- 1. Import the new modal component ---


function ChatGPTapp() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [input, setInput] = useState("");
    const [chatLog, setChatLog] = useState([{
        user: "gpt",
        message: "How can I help you today?"
    }]);
    // --- NEW: Add a loading state ---
    const [isLoading, setIsLoading] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false); // --- 2. Add state for the modal
    const chatLogRef = useRef(null);

    // This useEffect handles auto-scrolling
    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatLog]);

    // --- NEW: This useEffect plays a sound on new GPT responses ---
    useEffect(() => {
        // Ensure the chat has more than the initial message
        if (chatLog.length > 1) {
            const lastMessage = chatLog[chatLog.length - 1];
            // If the last message is from the bot, play the sound
            if (lastMessage.user === 'gpt') {
                const audio = new Audio('/notification.mp3'); // Path relative to the /public folder
                audio.play();
            }
        }
    }, [chatLog]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

   const handleSend = async (e) => {
      e.preventDefault();
      const trimmedInput = input.trim();
      // --- FIX: Prevent sending while a response is loading ---
      if (!trimmedInput || isLoading) return;

      const userMessage = { user: "me", message: trimmedInput };
      
      // --- FIX: Use functional update to add the user's message ---
      setChatLog(prevChatLog => [...prevChatLog, userMessage]);
      setInput("");
      setIsLoading(true); // --- Set loading to true

      try {
        const response = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmedInput }),
        });

        if (!response.ok) {
            // Handle HTTP errors like 404 or 500
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();

        const botResponse = {
          user: "gpt",
          message: data.reply || "Error: No response from API",
        };

        // --- FIX: Use functional update to add the bot's response ---
        setChatLog(prevChatLog => [...prevChatLog, botResponse]);

      } catch (err) {
        console.error(err);
        const errorResponse = { user: "gpt", message: "⚠️ Error connecting to backend. Please check if the server is running." };
        // --- FIX: Use functional update for the error message ---
        setChatLog(prevChatLog => [...prevChatLog, errorResponse]);
      } finally {
        setIsLoading(false); // --- Set loading back to false ---
      }
    };

    // --- NEW: Function to handle clicks on the query buttons ---
    const handleQuickQuery = async (queryText) => {
        // Prevent sending a new query while one is already loading
        if (isLoading) return;

        const userMessage = { user: "me", message: queryText };
        
        // Add the user's message to the chat log
        setChatLog(prevChatLog => [...prevChatLog, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch(" http://localhost:5174/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: queryText }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();
            const botResponse = {
                user: "gpt",
                message: data.reply || "Error: No response from API",
            };

            // Add the bot's response to the chat log
            setChatLog(prevChatLog => [...prevChatLog, botResponse]);

        } catch (err) {
            console.error(err);
            const errorResponse = { user: "gpt", message: "⚠️ Error connecting to backend. Please check if the server is running." };
            setChatLog(prevChatLog => [...prevChatLog, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };


    const handleNewChat = () => {
        // Resets the chat log to the initial welcome message
        setChatLog([{
            user: "gpt",
            message: "How can I help you today?"
        }]);
        // Also clear the input field
        setInput("");
    };

    const handleSaved = () => {
        // 1. Filter the chat log to get only messages from the AI assistant.
        const gptMessages = chatLog.filter(entry => entry.user === 'gpt');

        // 2. If there are no messages to save, show an alert and exit.
        if (gptMessages.length === 0) {
            alert("There are no messages from the assistant to save.");
            return;
        }

        // 3. Format the messages into a single string for the text file.
        const fileContent = gptMessages
            .map(entry => `Assistant: ${entry.message}`)
            .join('\n\n' + '-'.repeat(50) + '\n\n'); // Separate messages for readability

        // 4. Create a Blob object, which represents the raw file data.
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });

        // 5. Create a temporary anchor element (<a>) to trigger the download.
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        
        // 6. Set the filename for the download.
        const timestamp = new Date().toISOString().split('T')[0]; // e.g., "2025-09-02"
        link.download = `chatgpt-saved-${timestamp}.txt`;

        // 7. Programmatically click the link to start the download, then remove it.
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 8. Clean up by revoking the object URL to free up memory.
        URL.revokeObjectURL(link.href);
    };

    const handleUpgrade = () => {
        setIsUpgradeModalOpen(true); // --- 3. Open the modal ---
    };

    const closeUpgradeModal = () => {
        setIsUpgradeModalOpen(false); // --- 4. Function to close the modal ---
    };

    // --- The rest of your JSX remains the same ---
    return (
        <div className={isDarkMode ? "APP" : "APP light-mode"}>
            <div className="sidebar">
                <div className="upperSideBar">
                    <div className="upperSideTop">
                        <img src={ucc} height={25} width={25} alt="Logo" className="logo" />
                        <span className="brand">GhatGPT</span>
                    </div>
                    {/* Added the onClick handler to the button */}
                    <button className="mid_btn" onClick={handleNewChat}><i className="fas fa-plus"></i>New Chat</button>
                    <div className="upperSideBottom">
                        {/* --- FIX: Added onClick handlers and disabled state --- */}
                        <button 
                            className="query" 
                            onClick={() => handleQuickQuery("What is Programming?")}
                            disabled={isLoading}
                        >
                            <i className="far fa-comment-alt"></i>What is Programming?
                        </button>
                        <button 
                            className="query" 
                            onClick={() => handleQuickQuery("What is JavaScript?")}
                            disabled={isLoading}
                        >
                            <i className="far fa-comment-alt"></i>What is JavaScript?
                        </button>
                    </div>
                </div>
                <div className="lowerSideBar">
                    {/* The "Home" button can also trigger a new chat */}
                    <div className="listItems" onClick={handleNewChat}><i className="fas fa-home"></i>Home</div>
                    <div className="listItems" onClick={handleSaved}><i className="fas fa-bookmark"></i>Saved</div>
                    <div className="listItems" onClick={handleUpgrade}><i className="fas fa-rocket"></i>Upgrade To Pro</div>
                    <div className="listItems theme-toggle" onClick={toggleTheme}>
                        {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
                        {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </div>
                </div>
            </div>
            <div className="main">
                <div className="chat">
                    {chatLog.map((entry, index) => (
                        <ChatMessage key={index} message={entry.message} user={entry.user} />
                    ))}
                    <div ref={chatLogRef} />
                </div>
                <div className="chatInput">
                    {/* --- FIX: Disable form elements while loading --- */}
                    <form onSubmit={handleSend}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isLoading ? "AI is thinking..." : "Send a message..."}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}>
                            {/* --- Show a spinner icon when loading --- */}
                            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                        </button>
                    </form>
                </div>
            </div>

            {/* --- 5. Render the modal conditionally --- */}
            {isUpgradeModalOpen && <UpgradeModal onClose={closeUpgradeModal} />}
        </div>
    );
}

const ChatMessage = ({ message, user }) => {
    return (
        <div className={`chatMessage ${user === "gpt" ? "gpt" : ""}`}>
            <div className="chatMessage-logo">
                <img src={ucc} alt="Logo" />
            </div>
            <p className="message">{message}</p>
        </div>
    );
};

export default ChatGPTapp;