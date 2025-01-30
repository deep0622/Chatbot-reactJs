import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState([false]);

  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const updateHistory = (text) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: "model", text}])
    }
    history = history.map(({role, text}) => ({role, parts: [{text}]}));

    const requestOptions = {
      method : 'POST',
      Headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({contents: history})
    };

    try{
      // make the API call to get the bot's response 
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || "something went wrong!");
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    }catch (error) {
    console.log(error);
      }
    };

    useEffect(() =>{
      chatBodyRef.current.scrollTo({top : chatBodyRef.current.scrollHeight, behavior: "smooth"});
    }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <buttton onClick={() => setShowChatbot(prev = !prev) } id="chatbot-toggler">
        <span class="material-symbols-rounded">mode_comment</span>
        <span class="material-symbols-rounded">close</span>
      </buttton>


      <div className="chatbot-popup">
        {/* Chatbot header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <div className="logo-text">
              <b>Chatbot</b>
            </div>
          </div>
          <button class="material-symbols-rounded">keyboard_arrow_down</button>
        </div>
        {/* Chatbot body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text"> Hi! How can I help you today?</p>
          </div>

          {/* render the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage  key={index} chat={chat} />
          ))}
         
        </div>

        {/* Chatbot footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
};

export default App;
