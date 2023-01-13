import { useState, CSSProperties, useEffect } from 'react'
import './App.css'
import { useCSVReader } from 'react-papaparse'
import { isInstanciated, PhoneNumberAnalyzer } from './utils'
import uuid from 'react-uuid'

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  } as CSSProperties,
  browseFile: {
    width: '20%',
  } as CSSProperties,
  acceptedFile: {
    border: '1px solid #ccc',
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '80%',
  } as CSSProperties,
  remove: {
    borderRadius: 0,
    padding: '0 20px',
  } as CSSProperties,
  progressBarBackgroundColor: {
    backgroundColor: 'red',
  } as CSSProperties,
}
export type IdAndNumbers = [string, string][]

let analyzer: PhoneNumberAnalyzer

export function App() {
  const { CSVReader } = useCSVReader()
  const [uploads, setUploads] = useState<IdAndNumbers>([])
  const [input, setInput] = useState<string>('')
  const [elaborated, setElbaorated] = useState<{
    acceptableNumbers: string[]
    wrongNumbers: string[]
    correctedNumbers: {
      corrected: string
      corrections: string
      original: string
    }[]
  }>()

  useEffect(() => {
    if (uploads.length === 0) return
    console.log({ uploads })
    if (!isInstanciated) {
      analyzer = new PhoneNumberAnalyzer(uploads)
    }
    uploads.forEach((upload) => {
      analyzer.analyzeNumber(upload[1])
    })

    setElbaorated((prev) => ({
      ...prev,
      acceptableNumbers: analyzer.getAcceptableNumbers(),
      wrongNumbers: analyzer.getWrongNumbers(),
      correctedNumbers: analyzer.getCorrectedNumbers(),
    }))
  }, [uploads])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (input.length === 0) return
    e.preventDefault()
    if (!isInstanciated) {
      analyzer = new PhoneNumberAnalyzer([])
    }
    analyzer.analyzeNumber(input)

    setElbaorated((prev) => ({
      ...prev,
      acceptableNumbers: analyzer.getAcceptableNumbers(),
      wrongNumbers: analyzer.getWrongNumbers(),
      correctedNumbers: analyzer.getCorrectedNumbers(),
    }))
    setInput('')
  }

  return (
    <main>
      <CSVReader
        onUploadAccepted={(uploads: { data: [string, string][] }) => {
          console.log('---------------------------')
          console.log(uploads)
          console.log('---------------------------')
          setUploads(uploads.data.slice(1))
        }}
      >
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
        }: any) => (
          <>
            <div style={styles.csvReader}>
              <button
                type='button'
                {...getRootProps()}
                style={styles.browseFile}
              >
                Browse file
              </button>
              <div style={styles.acceptedFile}>
                {acceptedFile && acceptedFile.name}
              </div>
              <button {...getRemoveFileProps()} style={styles.remove}>
                Remove
              </button>
            </div>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>
      <div>
        <h2>Check your number</h2>
        <form onSubmit={handleSubmit}>
          <input
            type='number'
            placeholder='enter number'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button type='submit'>Check</button>
        </form>
      </div>
      {/* acceptable nums */}
      {elaborated && (
        <div className='flex'>
          <div>
            <h2>Acceptable numbers</h2>
            <ul>
              {elaborated.acceptableNumbers.map((num) => (
                <li key={uuid()}> {num}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Wrong numbers</h2>
            <ul>
              {elaborated.wrongNumbers.map((num) => (
                <li key={uuid()}> {num}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Corrected numbers</h2>
            <ul>
              {elaborated.correctedNumbers.map((num) => (
                <li key={uuid()}>
                  <div>original {num.original}</div>
                  <div>corrected {num.corrected}</div>
                  <div>corrections {num.corrections}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
