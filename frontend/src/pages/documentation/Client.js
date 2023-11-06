import React, { useState, useEffect } from 'react'
import Markdown from 'react-markdown'

const Client = () => {
  const [clientDocumentation, setClientDocumentation ] = useState('')

  useEffect(() => {
    const path = '/documentation/client.md'
    fetch(path)
      .then(response => response.text())
      .then(data => setClientDocumentation(data));
  }, []);
  return (
    <div className = "client-documentation">
      <Markdown>{clientDocumentation}</Markdown>
    </div>
  )
}

export default Client