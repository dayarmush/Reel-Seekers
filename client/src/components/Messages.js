import { useState } from 'react'
import { json } from 'react-router-dom'

function Messages({ messages, setLake }) {

  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function textHandler(e) {
    setText(e.target.value)
  }

  function sendMessage() {
    fetch('/messages', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        text: text,
        user_id: user.id
      })
    })
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => {
          setLake(pre => {
            const newMessages = [...pre.messages, data]
            return {...pre, messages: newMessages}
          })
        })
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
  }

  return (
    <div>
      {error && <h2>{error}</h2>}
      {messages.map(message => {
        return <div key={message.id}>
          <h6>{message.created_at}</h6>
          <h3>{message.user.username}</h3>
          <p>{message.text}</p>
        </div>
      })}
      <input
        placeholder="Write a Message"
        type="text"
        name='message'
        value={text}
        onChange={textHandler}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}

export default Messages