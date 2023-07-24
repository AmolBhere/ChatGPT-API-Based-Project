import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const apiKey = "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";

function App() {
  
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am your Personal ChatGPT. Ask me anyting !",
      sender: "ChatGPT"
    }
  ])
  const [typing, setTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: 'user',
      direction: 'outgoing'
    }

    const newMessages = [...messages, newMessage]; // all the old messagse + new message 
    
    // update the messages state
    setMessages(newMessages);

    // set a typing indicator
    setTyping(true);

    // process message to ChatGPT (send it over and see the response)
    await processMessageToChatGPT(newMessages)
  }


  async function processMessageToChatGPT(chatMessages) {
    
    let apiMessages = chatMessages.map((messageObject) => {
      
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      }
      else{
        role = "user";
      }
      return { role: role, content: messageObject.message }
    });

    // role "user" -> a message from the user, "assistant" -> a response from ChatGPT
    // "system" -> generally one initial message defining how we want chatgpt to talk

    const systemMessage  = {
      "role": "system",
      "content": "Explain all concepts like a great assistant."
      // Speak like pirate, Explain like 10 year experienced software engineer
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages // [message1 ,message2, message3]
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]
      );
      setTyping(false);
    });
  }

  return (
    <div className="App">
      <div className='heading'>
          <h1>This is ChatGPT <span>2.0</span></h1>
      </div>
      <div style={{position: 'relative', height: '550px', width: '700px'}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
            scrollBehavior='smooth'
              typingIndicator = {typing ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder='Type message here' onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
