import React from 'react'

function ChatText(props) {
  let messages
  messages = <div>{props.message}</div>
  return (
    <div
      className={props.currentLayout}
      style={{ display: 'flex', flexDirection: 'row' }}>
      <img className={props.currentIconClass} src={props.icon} alt='' />
      <div className={props.currentTitle}>{messages}</div>
    </div>
  )
}

export default ChatText
