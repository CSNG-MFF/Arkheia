import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

const Installation = () => {
  const [documentation, setDocumentation ] = useState('')

  useEffect(() => {
    const path = 'README.md'
    fetch(path)
      .then(response => response.text())
      .then(data => setDocumentation(data));
  }, []);
  return (
    <div className = "installation">
      <ReactMarkdown>{documentation}</ReactMarkdown>
    </div>
  )
}

export default Installation