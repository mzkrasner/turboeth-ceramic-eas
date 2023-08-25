# ⚡ TurboETH with Ceramic and EAS 
Web3 App Template starter kit using Next.js, RainbowKit, SIWE, Ceramic, and EAS

For more on TurboETH, visit the [TurboETH Documentation](https://docs.turboeth.xyz)

# Getting Started

The `pnpm` CLI is the recommended package manager but `npm` and `yarn` should work too.

1. Install your dependencies:

```bash
pnpm install
```

2. Generate your admin seed, admin did, and ComposeDB configuration file:

```bash
npm run generate
```

3. Create a .env file and enter the three required environment variables outlined in .env.example

4. Run the application (make sure you are using node version 16):

#### Development
```bash
pnpm begin
```

#### Build
```bash
pnpm build
```

### Web3 Core
- [WAGMI CLI](https://wagmi.sh/cli/getting-started) - Automatic React Hook Generation
- [RainbowKit](https://www.rainbowkit.com/) - Wallet connection manager
- [Sign-In With Ethereum](https://login.xyz/) - Account authentication

### Web2 Frameworks
- [Vercel](https://vercel.com/) - App Infrastructure
- [Prisma](https://www.prisma.io/) - Database ORM 

### Developer Experience
- [TypeScript](https://www.typescriptlang.org/) – Static type checker for end-to-end typesafety
- [Prettier](https://prettier.io/) – Opinionated code formatter for consistent code style
- [ESLint](https://eslint.org/) – Pluggable linter for Next.js and TypeScript

### User Interface
- [TailwindCSS](https://tailwindcss.com) – Utility-first CSS framework for rapid UI development
- [Radix](https://www.radix-ui.com/) – Primitives like modal, popover, etc. to build a stellar user experience
- [Framer Motion](https://www.framer.com/motion/) – Motion library for React to animate components with ease
- [Lucide](https://lucide.dev/docs/lucide-react) – Beautifully simple, pixel-perfect icons

The [ui.shadcn.com](https://ui.shadcn.com) components are included in the `/components/shared/ui` folder.

<hr/>

Copyright 2023 [Kames Geraghty](https://twitter.com/KamesGeraghty)
