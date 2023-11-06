import React, { useState, useEffect } from 'react'
import Markdown from 'react-markdown'

const Api = () => {
  const [apiDocumentation, setApiDocumentation ] = useState('')

  useEffect(() => {
    const path = '/documentation/api.md'
    fetch(path)
      .then(response => response.text())
      .then(data => setApiDocumentation(data));
  }, []);
  return (
    <div className = "installation">
      <Markdown>{apiDocumentation}</Markdown>
    </div>
  )
}

export default Api