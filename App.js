import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const AGENT = {
  name: "Navratan Royal Bot",
  role: "Gemstone & Jewellery Assistant",
  img: process.env.PUBLIC_URL + "https://i.postimg.cc/Bv5LwssZ/Chat-GPT-Image-Jul-9-2025-11-00-42-AM-removebg-preview.png", // replace with model/profile image if needed
  photo: process.env.PUBLIC_URL + "https://i.postimg.cc/Bv5LwssZ/Chat-GPT-Image-Jul-9-2025-11-00-42-AM-removebg-preview.png", // or use a real agent pic!
};

function App() {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hello! I’m <b>Navratan Royal Bot</b>, an <b>AI Agent</b> here to assist you.<br>How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);
  // Generate or get sessionId for user (persist for session)
  const [sessionId] = useState(() => {
    let id = sessionStorage.getItem("navratan_session_id");
    if (!id) {
      id = uuidv4();
      sessionStorage.setItem("navratan_session_id", id);
    }
    return id;
  });

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { type: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    const userInput = input;
    setInput("");
    try {
      const res = await fetch("http://localhost:4201/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput, sessionId })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.text) {
        setMessages((m) => [...m, { type: "bot", text: data.text }]);
      } else {
        setMessages((m) => [...m, { type: "bot", text: "(No reply from AI)" }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { type: "bot", text: `AI connection error: ${err.message}` }]);
    }
  };

  return (
    <div className="chat-root" style={{background:'#f8f9fc', minHeight:'100vh', borderRadius:24, boxShadow:'0 8px 38px #b4bbfa40', display:'flex', fontFamily: 'Inter, Arial, sans-serif'}}>
      {/* Main Layout: Left = chat, Right = profile */}
      <div style={{display:'flex', flex:1, height:'100vh', borderRadius:24}}>
        {/* Left Side */}
        <div style={{flex:1, background:'#fff', borderRadius:'24px 0 0 24px', display:'flex', flexDirection:'column', padding:'0 0 0 0'}}>
          {/* Top Bar (removed constant message and logo as per request) */}
          <div style={{height:32}}></div>
          {/* Suggestion Button removed as per request */}
          {/* Chat Area */}
          <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 0 0 0', minHeight:320}}>
            <div style={{flex:1}}></div>
            <div style={{padding:'0 0 24px 48px', display:'flex', flexDirection:'column', gap:12}}>
              {messages.map((msg, i) =>
                msg.type === "bot" ? (
                  <div key={i} style={{display:'flex', alignItems:'flex-start', gap:10}}>
                    <img src={AGENT.photo} alt="Bot" style={{width:36, height:36, borderRadius:'50%', background:'#ecefff', objectFit:'cover', boxShadow:'0 1.5px 10px #e4e7ff26'}} />
                    <div
                      style={{background:'#716c9c', color:'#fff', alignSelf:'flex-start', borderRadius:17, borderBottomLeftRadius:5, maxWidth:'75%', padding:'13px 18px 13px 14px', fontSize:'1.10em', lineHeight:1.55, marginBottom:3, boxShadow:'0 1.5px 10px #e4e7ff26'}}
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                  </div>
                ) : (
                  <div key={i} style={{display:'flex', alignItems:'flex-start', justifyContent:'flex-end', gap:10, marginRight:32}}>
                    <div style={{background:'#716c9c', color:'#fff', alignSelf:'flex-end', borderRadius:17, borderBottomRightRadius:5, maxWidth:'75%', padding:'13px 18px 13px 14px', fontSize:'1.10em', lineHeight:1.55, marginBottom:3, boxShadow:'0 1.5px 10px #e4e7ff26'}}>{msg.text}</div>
                  </div>
                )
              )}
            </div>
          </div>
          {/* Input */}
          <form onSubmit={sendMessage} style={{background:'#f8f9fc', border:'none', borderRadius:'0 0 0 24px', margin:'0 0 0 0', padding:'24px 24px 24px 24px', display:'flex', alignItems:'center'}}>
            <input
              placeholder="Type here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{flex:1, borderRadius:12, border:'none', background:'#e9ebf3', fontSize:'1.09em', padding:'16px 18px', color:'#23306a', fontFamily:'Inter, Arial, sans-serif'}} 
              autoFocus
            />
            <button type="submit" style={{background:'#3a4a8c', color:'#fff', border:'none', borderRadius:'50%', width:44, height:44, fontSize:'1.4em', marginLeft:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>&#9658;</button>
          </form>
          {/* Brand */}
          <div style={{textAlign:'center', fontSize:'1em', opacity:0.37, margin:'7px 0 2px 0', color:'#23306a', fontFamily:'Inter, Arial, sans-serif'}}>Powered By <a href="/terms" style={{color:'#3a4a8c',textDecoration:'underline'}}>Terms</a> @<b style={{color:'#3a4a8c'}}>Navratan AI</b></div>
        </div>
        {/* Right Side - Profile Card Theme Only (menu icon removed, spacing adjusted) */}
        <div style={{background:'#716c9c', minWidth:420, maxWidth:480, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', overflow:'hidden', borderRadius:'24px', boxShadow:'0 8px 38px #b4bbfa40', margin:'16px 8px 16px 0', position:'relative'}}>
          {/* Agent Image Only */}
          <div style={{width:'100%', textAlign:'center', color:'#fff', marginTop:40, marginBottom:10, fontWeight:600, fontSize:'1.18em', letterSpacing:'.01em'}}>Your Customer service representative</div>
          <img 
            src={AGENT.photo} 
            alt="Profile" 
            style={{width:'90%', maxWidth:340, height:'auto', borderRadius:24, background:'#ecefff', border:'none', objectFit:'cover', boxShadow:'0 1.5px 10px #e4e7ff26', margin:'60px auto 32px auto', display:'block'}} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;