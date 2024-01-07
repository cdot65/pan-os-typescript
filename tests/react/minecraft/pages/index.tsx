/* eslint-disable @typescript-eslint/ban-types */
// tests/react/minecraft/pages/index.tsx
import {
  AnimatePresence,
  AnimateSharedLayout,
  MotionProps,
  motion,
  useInView,
} from 'framer-motion';
import {
  CopiedIcon,
  CopyIcon,
  GitHubIcon,
  PanosCMDK,
  PanosIcon,
  PrismaCMDK,
  PrismaIcon,
  ScmCMDK,
  ScmIcon,
  SettingsCMDK,
  SettingsIcon,
} from 'components';

import Image from 'next/image';
import React from 'react';
import packageJSON from '../../../../package.json';
import styles from 'styles/index.module.scss';

type TTheme = {
  theme: Themes;
  setTheme: Function;
};

type Themes = 'PAN-OS' | 'Prisma' | 'SCM' | 'Settings';

const ThemeContext = React.createContext<TTheme>({} as TTheme);

export default function Index() {
  const [theme, setTheme] = React.useState<Themes>('PAN-OS');

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.meta}>
          <div className={styles.info}>
            <VersionBadge />
            <h1>pan-os-typescript</h1>
            <p>Object-Oriented SDK for PAN-OS Firewalls.</p>
          </div>

          <div className={styles.buttons}>
            <InstallButton />
            <GitHubButton />
          </div>
        </div>

        <AnimatePresence exitBeforeEnter initial={false}>
          {theme === 'PAN-OS' && (
            <CMDKWrapper key="PAN-OS">
              <PanosCMDK />
            </CMDKWrapper>
          )}
          {theme === 'Prisma' && (
            <CMDKWrapper key="Prisma">
              <PrismaCMDK />
            </CMDKWrapper>
          )}
          {theme === 'SCM' && (
            <CMDKWrapper key="SCM">
              <ScmCMDK />
            </CMDKWrapper>
          )}
          {theme === 'Settings' && (
            <CMDKWrapper key="Settings">
              <SettingsCMDK />
            </CMDKWrapper>
          )}
        </AnimatePresence>

        <ThemeContext.Provider value={{ theme, setTheme }}>
          <ThemeSwitcher />
        </ThemeContext.Provider>

        <div aria-hidden className={styles.line} />
        {/* <Codeblock /> */}
      </div>
      <Footer />
    </main>
  );
}

function CMDKWrapper(props: MotionProps & { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={{
        height: 475,
      }}
      {...props}
    />
  );
}

//////////////////////////////////////////////////////////////////

function InstallButton() {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      className={styles.installButton}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(`npm install pan-os-typescript`);
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        } catch (e) {
          /* empty */
        }
      }}
    >
      npm install pan-os-typescript
      <span>{copied ? <CopiedIcon /> : <CopyIcon />}</span>
    </button>
  );
}

function GitHubButton() {
  return (
    <a
      href="https://github.com/cdot65/pan-os-typescript"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.githubButton}
    >
      <GitHubIcon />
      pan-os-typescript
    </a>
  );
}

//////////////////////////////////////////////////////////////////

const themes = [
  {
    icon: <PanosIcon />,
    key: 'PAN-OS',
  },
  {
    icon: <PrismaIcon />,
    key: 'Prisma',
  },
  {
    icon: <ScmIcon />,
    key: 'SCM',
  },
  {
    icon: <SettingsIcon />,
    key: 'Settings',
  },
];

function ThemeSwitcher() {
  const { theme, setTheme } = React.useContext(ThemeContext);
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const [showArrowKeyHint, setShowArrowKeyHint] = React.useState(false);

  React.useEffect(() => {
    function listener(e: KeyboardEvent) {
      const themeNames = themes.map((t) => t.key);

      if (e.key === 'ArrowRight') {
        const currentIndex = themeNames.indexOf(theme);
        const nextIndex = currentIndex + 1;
        const nextItem = themeNames[nextIndex];

        if (nextItem) {
          setTheme(nextItem);
        }
      }

      if (e.key === 'ArrowLeft') {
        const currentIndex = themeNames.indexOf(theme);
        const prevIndex = currentIndex - 1;
        const prevItem = themeNames[prevIndex];

        if (prevItem) {
          setTheme(prevItem);
        }
      }
    }

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <div className={styles.switcher}>
      <motion.span
        className={styles.arrow}
        initial={false}
        animate={{
          opacity: showArrowKeyHint ? 1 : 0,
          x: showArrowKeyHint ? -24 : 0,
        }}
        style={{
          left: 100,
        }}
      >
        ←
      </motion.span>
      <AnimateSharedLayout>
        {themes.map(({ key, icon }) => {
          const isActive = theme === key;
          return (
            <button
              ref={ref}
              key={key}
              data-selected={isActive}
              onClick={() => {
                setTheme(key);
                if (showArrowKeyHint === false) {
                  setShowArrowKeyHint(true);
                }
              }}
            >
              {icon}
              {key}
              {isActive && (
                <motion.div
                  layoutId="activeTheme"
                  transition={{
                    type: 'spring',
                    stiffness: 250,
                    damping: 27,
                    mass: 1,
                  }}
                  className={styles.activeTheme}
                />
              )}
            </button>
          );
        })}
      </AnimateSharedLayout>
      <motion.span
        className={styles.arrow}
        initial={false}
        animate={{
          opacity: showArrowKeyHint ? 1 : 0,
          x: showArrowKeyHint ? 20 : 0,
        }}
        style={{
          right: 100,
        }}
      >
        →
      </motion.span>
    </div>
  );
}

//////////////////////////////////////////////////////////////////

function VersionBadge() {
  return <span className={styles.versionBadge}>v{packageJSON.version}</span>;
}

function Footer() {
  const ref = React.useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '100px',
  });
  return (
    <footer ref={ref} className={styles.footer} data-animate={isInView}>
      <div className={styles.footerText}>
        Repository{' '}
        <a
          href="https://github.com/cdot65/pan-os-typescript"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/github-mark.png"
            alt="GitHub logo"
            width="15"
            height="15"
          />
          GitHub
        </a>
      </div>
    </footer>
  );
}
