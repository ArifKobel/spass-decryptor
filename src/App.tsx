import SpassFileConverter from './SpassFileConverter'
import { Check, ChevronDown, GitHub, Lock } from './icons'

const REPO_URL = 'https://github.com/ArifKobel/spass-decryptor'

const STEPS = [
  'In the Samsung Pass settings, export your data to your phone and set a password.',
  'Choose the .spass file here and enter that password.',
  'Import the CSV into Chrome or your password manager, then delete the CSV.',
]

const FAQ = [
  {
    q: 'Is it safe to enter my export password here?',
    a: 'The file and password stay in this browser tab. Decryption uses the Web Crypto API built into your browser and nothing is uploaded. If you want to be sure, load the page, go offline and convert the file then. It works the same.',
  },
  {
    q: 'What ends up in the CSV?',
    a: 'Your saved logins with name, website, username, password and note. Cards, addresses and notes are not exported yet.',
  },
  {
    q: 'Where can I import the CSV?',
    a: 'Chrome (Password Manager → Settings → Import) and most password managers that read Chrome CSV files, like Bitwarden, 1Password, Proton Pass or Firefox.',
  },
  {
    q: 'It says wrong password, but the password is right.',
    a: 'Samsung changes the export format now and then. Open an issue on GitHub with your Samsung Pass version. Never attach the file itself.',
  },
  {
    q: 'Who made this?',
    a: 'Arif Kobel, as a small open-source side project. It is not affiliated with Samsung. The file format research comes from spass-manager by 0xdeb7ef.',
  },
]

const link = 'underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900 dark:decoration-zinc-600 dark:hover:decoration-zinc-100'

export default function App() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[34rem] flex-col px-4">
      <header className="flex items-center justify-between py-5">
        <a href="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            <Lock className="size-3.5" strokeWidth={2.5} />
          </span>
          spass-decryptor
        </a>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <GitHub className="size-4" />
          GitHub
        </a>
      </header>

      <main className="flex-1 pt-8 pb-16 sm:pt-14">
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight text-balance sm:text-[32px]">
          Convert your Samsung Pass export to CSV
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Samsung Pass only exports to an encrypted <span className="font-mono text-[0.9em]">.spass</span> file.
          This tool decrypts it so you can move your passwords to another password manager.
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
          {['Runs in your browser', 'Nothing is uploaded', 'Open source'].map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <Check className="size-4 text-emerald-600 dark:text-emerald-500" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <SpassFileConverter />
        </div>

        <section className="mt-14">
          <h2 className="text-[15px] font-semibold">How it works</h2>
          <ol className="mt-4 space-y-3">
            {STEPS.map((step, i) => (
              <li key={step} className="flex gap-3 text-[15px] text-zinc-600 dark:text-zinc-400">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-xs font-medium text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="faq" className="mt-14">
          <h2 className="text-[15px] font-semibold">Questions</h2>
          <div className="mt-2 divide-y divide-zinc-200 dark:divide-zinc-800">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group py-3.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown className="size-4 shrink-0 text-zinc-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="flex flex-wrap justify-between gap-2 border-t border-zinc-200 py-6 text-[13px] text-zinc-500 dark:border-zinc-800">
        <p>
          By{' '}
          <a href="https://arif.kobel.click" target="_blank" rel="noopener" className={link}>
            Arif Kobel
          </a>
          . Not affiliated with Samsung.
        </p>
        <p>
          <a href={`${REPO_URL}/blob/master/LICENSE`} target="_blank" rel="noopener" className={link}>
            MIT license
          </a>
        </p>
      </footer>
    </div>
  )
}
