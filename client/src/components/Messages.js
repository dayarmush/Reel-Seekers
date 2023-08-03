import { useState } from 'react'

function Messages({ messages, setLake, user, lakeId }) {

  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function textHandler(e) {
    setText(e.target.value)
  }

  function sendMessage() {
    if (!user.id) return setError('Please sign in.')
    fetch('/messages', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        text: text,
        user_id: user.id,
        lake_id: lakeId
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
    .catch(err => setError('Network error. Please try again later.'))
  }

  return (
    <div>
      <h2>Messages:</h2>
      {messages.map(message => {
        return <div key={message.id}>
          <h6>{message.created_at}</h6>
          <h3>{message.user.username}</h3>
          <p>{message.text}</p>
        </div>
      })}
      {user.id &&
        <div>
          <form onSubmit={sendMessage}>
            <input
              placeholder="Write a Message"
              type="text"
              name='message'
              value={text}
              onChange={textHandler}
              required
            />
            <button type='submit'>Send</button>
          </form>
          
        </div>
      }
      {error && <h2>{error}</h2>}
    </div>
  )
}

export default Messages