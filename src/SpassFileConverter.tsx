import { useEffect, useState } from 'react'
import convertSpassToChromeCSV from './utils/spassDecryptor'
import { AlertCircle, Check, Eye, EyeOff, FileKey, Lock, WifiOff } from './icons'

type Status =
  | { kind: 'idle' }
  | { kind: 'working' }
  | { kind: 'error'; message: string }
  | { kind: 'done'; count: number }

function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])
  return online
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const field = 'rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900'

export default function SpassFileConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const online = useOnline()

  const pickFile = (selected: File | null) => {
    setFile(selected)
    setStatus({ kind: 'idle' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setStatus({ kind: 'error', message: 'Choose your .spass file first.' })
      return
    }
    if (!password) {
      setStatus({ kind: 'error', message: 'Enter the password you set when exporting.' })
      return
    }

    setStatus({ kind: 'working' })
    try {
      const result = await convertSpassToChromeCSV(file, password, { autoDownload: true })
      setStatus({ kind: 'done', count: result.recordCount })
    } catch (err) {
      const message = err instanceof Error ? err.message.replace(/^Conversion failed: /, '') : 'Unknown error'
      setStatus({ kind: 'error', message: `${message}.` })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/40"
    >
      <span className="block text-sm font-medium">Export file</span>
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          pickFile(e.dataTransfer.files[0] ?? null)
        }}
        className={`${field} mt-1.5 flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors hover:border-zinc-400 dark:hover:border-zinc-500 ${
          dragging ? 'border-zinc-900 dark:border-zinc-100' : ''
        }`}
      >
        <input type="file" accept=".spass" className="sr-only" onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
        <FileKey className="size-4 shrink-0 text-zinc-400" />
        <span className={`min-w-0 flex-1 truncate text-[15px] ${file ? '' : 'text-zinc-400'}`}>
          {file ? file.name : 'No file selected'}
        </span>
        {file && <span className="text-xs text-zinc-400">{formatSize(file.size)}</span>}
        <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[13px] font-medium dark:border-zinc-700 dark:bg-zinc-800">
          {file ? 'Change' : 'Browse'}
        </span>
      </label>

      <label htmlFor="spass-password" className="mt-5 block text-sm font-medium">
        Export password
      </label>
      <div className={`${field} mt-1.5 flex items-center focus-within:border-zinc-900 dark:focus-within:border-zinc-100`}>
        <input
          id="spass-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          placeholder="Set when you exported"
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[15px] placeholder:text-zinc-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="px-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      <button
        type="submit"
        disabled={status.kind === 'working'}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {status.kind === 'working' && (
          <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {status.kind === 'working' ? 'Decrypting…' : 'Convert and download CSV'}
      </button>

      <div aria-live="polite">
        {status.kind === 'error' && (
          <p className="mt-4 flex gap-2 text-sm text-red-700 dark:text-red-400">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {status.message}
          </p>
        )}
        {status.kind === 'done' && (
          <p className="mt-4 flex gap-2 text-sm text-emerald-700 dark:text-emerald-400">
            <Check className="mt-0.5 size-4 shrink-0" />
            <span>
              {status.count} {status.count === 1 ? 'login' : 'logins'} exported. The CSV contains your passwords in plain
              text, so delete it after importing.
            </span>
          </p>
        )}
      </div>

      <p className="mt-5 flex items-start gap-2 border-t border-zinc-200 pt-4 text-[13px] text-zinc-500 dark:border-zinc-800">
        {online ? <Lock className="mt-0.5 size-3.5 shrink-0" /> : <WifiOff className="mt-0.5 size-3.5 shrink-0" />}
        {online ? (
          <span>
            Your file is decrypted on this device and never uploaded.{' '}
            <a href="#faq" className="underline underline-offset-2">
              How can I check?
            </a>
          </span>
        ) : (
          <span>You're offline. Nothing can leave this device.</span>
        )}
      </p>
    </form>
  )
}
