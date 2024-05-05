import React, { useState, useEffect } from 'react'
import Markdown from 'react-markdown'

const Installation = () => {
  const [documentation, setDocumentation ] = useState('')

  useEffect(() => {
    const path = '/documentation/README.md'
    fetch(path)
      .then(response => response.text())
      .then(data => setDocumentation(data));
  }, []);
  return (
    <div style={{ paddingLeft: '20px'}}>
      <Markdown>{documentation}</Markdown>
    </div>
  )
}

export default Installation