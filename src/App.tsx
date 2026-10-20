import SpassFileConverter from './SpassFileConverter'

const REPO_URL = 'https://github.com/ArifKobel/spass-decryptor'

const STEPS = [
  {
    title: 'Export from Samsung Pass',
    text: 'In the Samsung Pass settings, export your data to the phone. You choose a password for the export file there.',
  },
  {
    title: 'Convert it here',
    text: 'Drop the file above and enter that password. Decryption runs in this tab; nothing is uploaded.',
  },
  {
    title: 'Import the CSV',
    text: 'Chrome: Password Manager → Settings → Import. Bitwarden, 1Password, Proton Pass and others take the same file.',
  },
]

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-stone-200 dark:border-stone-800">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <span className="font-mono text-sm font-semibold tracking-tight">f*ck .spass</span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener"
            aria-label="Source code on GitHub"
            className="rounded p-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
          >
            <svg viewBox="0 0 16 16" className="size-5" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Get your passwords out of Samsung&nbsp;Pass.
        </h1>
        <p className="mt-3 max-w-prose text-stone-600 dark:text-stone-400">
          Turns a <code className="font-mono text-sm">.spass</code> export into a CSV that Chrome and
          most password managers can import. Everything happens in your browser.
        </p>

        <div className="mt-8">
          <SpassFileConverter />
        </div>

        <section className="mt-14">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">How it works</h2>
          <ol className="mt-4 space-y-5">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="font-mono text-sm text-stone-400">{i + 1}</span>
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-stone-200 dark:border-stone-800">
        <div className="mx-auto flex max-w-2xl flex-wrap justify-between gap-2 px-4 py-4 text-xs text-stone-500">
          <span>
            Made by{' '}
            <a href="https://arif.kobel.click" target="_blank" rel="noopener" className="underline-offset-2 hover:underline">
              Arif Kobel
            </a>
            {' · '}
            <a href={`${REPO_URL}/blob/master/LICENSE`} target="_blank" rel="noopener" className="underline-offset-2 hover:underline">
              MIT
            </a>
          </span>
          <span>
            Format notes from{' '}
            <a href="https://github.com/0xdeb7ef/spass-manager" target="_blank" rel="noopener" className="underline-offset-2 hover:underline">
              spass-manager
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
