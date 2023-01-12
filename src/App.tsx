import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState<File>()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div>
      <input type='file' onChange={handleFileChange} />

      <div>{file && `${file.name} - ${file.type}`}</div>

      {/* <button onClick={handleUploadClick}>Upload</button> */}
    </div>
  )
}

export default App
