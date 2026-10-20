import { useState } from 'react'
import convertSpassToChromeCSV from './utils/spassDecryptor'

type Status =
  | { kind: 'idle' }
  | { kind: 'working' }
  | { kind: 'error'; message: string }
  | { kind: 'done'; count: number }

export default function SpassFileConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const pickFile = (selected: File | null) => {
    setFile(selected)
    setStatus({ kind: 'idle' })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    pickFile(e.dataTransfer.files[0] ?? null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !password) return

    setStatus({ kind: 'working' })
    try {
      const result = await convertSpassToChromeCSV(file, password, { autoDownload: true })
      setStatus({ kind: 'done', count: result.recordCount })
    } catch (err) {
      const message = err instanceof Error ? err.message.replace(/^Conversion failed: /, '') : 'Unknown error'
      setStatus({ kind: 'error', message })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 dark:border-stone-800 dark:bg-stone-900"
    >
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragging
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
            : 'border-stone-300 hover:border-stone-400 dark:border-stone-700 dark:hover:border-stone-600'
        }`}
      >
        <input
          type="file"
          accept=".spass"
          className="sr-only"
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <>
            <span className="font-mono text-sm break-all">{file.name}</span>
            <span className="mt-1 text-xs text-stone-500">Click to pick a different file</span>
          </>
        ) : (
          <>
            <span className="font-medium">Drop your .spass file here</span>
            <span className="mt-1 text-sm text-stone-500">or click to browse</span>
          </>
        )}
      </label>

      <label htmlFor="spass-password" className="mt-5 block text-sm font-medium">
        Export password
      </label>
      <div className="relative mt-1.5">
        <input
          id="spass-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          className="w-full rounded-lg border border-stone-300 bg-transparent px-3 py-2.5 pr-16 dark:border-stone-700"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute inset-y-0 right-0 px-3 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <button
        type="submit"
        disabled={!file || !password || status.kind === 'working'}
        className="mt-5 w-full rounded-lg bg-stone-900 px-4 py-3 font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300"
      >
        {status.kind === 'working' ? 'Decrypting…' : 'Convert and download CSV'}
      </button>

      <div aria-live="polite">
        {status.kind === 'error' && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-300">
            {status.message}. Double-check the password. If it's definitely right,{' '}
            <a
              href="https://github.com/ArifKobel/spass-decryptor/issues/new?template=bug_report.md"
              target="_blank"
              rel="noopener"
              className="underline"
            >
              open an issue
            </a>{' '}
            with your Samsung Pass version.
          </p>
        )}
        {status.kind === 'done' && (
          <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
            Exported {status.count} {status.count === 1 ? 'login' : 'logins'}. The CSV contains your passwords in
            plain text, so delete it once you've imported it.
          </p>
        )}
      </div>
    </form>
  )
}
