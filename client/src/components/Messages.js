import { useState } from 'react'
import { useParams } from 'react-router-dom'

function Messages({ messages, setLake, user }) {

  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const { id } = useParams()

  function textHandler(e) {
    setText(e.target.value)
  }

  function sendMessage() {
    if (!user.username) return setError('Please sign in.')
    fetch('/messages', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        text: text,
        user_id: user.id,
        lake_id: id
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
      {error && <h2>{error}</h2>}
    </div>
  )
}

export default Messages