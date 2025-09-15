# Project Description
This project is a NextJS based web application designed to create custom universal dashboards with various widgets created by AI agents. It allows users to select and configure widgets to display information in a personalized dashboard or create custom widgets by providing prompts for AI agents, which will generate the widget content in a runtime. The information about the user's preferences and configurations is stored in a database for future reference and customization. Generated widgets can be saved, reused or shared with others, providing a flexible and dynamic user experience.

## Libraries and Frameworks
- [Node.js](https://nodejs.org/): JavaScript runtime for server-side development.
- [Next.js](https://nextjs.org/): React framework for server-side rendering and static site generation.
- [React](https://reactjs.org/): JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/): Superset of JavaScript that adds static typing.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework for styling.
- [Supabase](https://supabase.com/): Backend as a service for database and authentication.
- [shadcn/ui](https://ui.shadcn.com/): Component library for building user interfaces.


## Project Guidelines
- Follow best practices for React and Next.js development.
- Use consistent coding styles and conventions.
- Name files and folders clearly and descriptively.
- Follow ESLint configurations (defined in `.eslint.config.ts`).

## Core Principles
- **Modularity**: Break down the application into smaller, reusable components.
- **Scalability**: Design the application to handle growth and increased complexity.
- **Maintainability**: Write clean, well-documented code that is easy to understand and maintain.
- **Performance**: Optimize the application for speed and responsiveness.
- **User Experience**: Focus on creating an intuitive and engaging user interface.
- **Security First**: Implement best practices to protect user data and ensure application security.
- **AI Integration**: Leverage AI agents to enhance functionality and user experience.
- **Layered Architecture**: Organize code into layers to separate concerns and improve maintainability.
- **Type Safety**: Utilize TypeScript to catch errors early and improve code quality.

## Directory Structure
```
├── .husky                  # Git hooks
├── .vscode                 # VSCode settings
├── .ssh-keys               # SSH keys for authentication
├── .github                 # GitHub-related files
├── .swc                    # SWC auto-generation files - do not edit
├── locales                 # Localization files
├── log                     # Log files
├── node_modules            # Node.js modules
├── public                  # Static assets
├── src                     # Source files
│   ├─ agents               # AI agents
│   ├── app                 # Next.js app directory
│   │   ├── api             # API routes
│   │   ├── actions         # Server actions
│   │   ├── [locale]        # Locale-specific routes
│   │   │   ├── components  # Route-specific components
│   │   │   ├── layout.tsx  # Locale-specific layout
│   │   │   └── page.tsx    # Home page
│   │   ├── 404             # 404 error page
│   │   ├── 500             # 500 error page
│   │   ├── global.css      # Global CSS
│   │   ├── layout.tsx      # Root layout
│   │   └── favicon.ico     # Favicon
│   ├─ components           # Reusable components
│   ├─ config               # Application configuration
│   ├─ enums                # Enumeration types
│   ├─ layers               # Layered architecture implementation
│   │   ├─ Authentication    # Authentication layer
│   │   ├─ Configuration     # Configuration layer
│   │   ├─ Data              # Data layer
│   │   ├─ Feature           # Feature layer
│   │   ├─ Internationalization  # Internationalization layer
│   │   ├─ Logging          # Logging layer
│   ├─ shadcn               # Shadcn/ui components
│   ├─ tailwind             # Tailwind CSS plugins and utils
│   ├─ tools                # Development tools and utilities
│   ├─ types                # TypeScript type definitions
│   ├─ utils                # Utility functions
│   ├─ workers              # Web Workers
│   ├─ dashboards           # Dashboard components
│   ├─ widgets              # Reusable widgets
│   ├─ stores               # State management
│   ├─ styles               # Global styles
│   ├─ di.ts                # Dependency injection setup
│   ├─ index.ts             # Dependency injection initialization
│   ├─ instrumentation.ts   # Server-side instrumentation setup
│   ├─ instrumentation-client.ts # Client-side instrumentation setup
│   ├─ middleware.ts        # Next.js middleware
│   └─ trace.ts             # Vercel server container tracing setup
├── .env.development.local   # Automatically generated environment variables for development - do not edit
├── .env.production.local    # Automatically generated environment variables for production - do not edit
├── .editorconfig            # Editor configuration
├── .gitignore               # Git ignore file
├── .gitattributes           # Git attributes file
├── .npmrc                   # NPM configuration
├── .nvmrc                   # Node Version Manager configuration
├── eslint.config.ts         # ESLint configuration
├── global.d.ts              # Global TypeScript definitions
├── jest.config.ts           # Jest configuration
├── jest.setup.client.ts     # Jest setup for client tests
├── jsconfig.json            # JavaScript configuration
├── next.config.ts           # Next.js configuration
├── package-lock.json        # NPM package lock file
├── package.json             # NPM package file
├── postcss.config.mjs       # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.test.json       # TypeScript configuration for tests
├── tsconfig.worker.json     # TypeScript configuration for web workers
└── tailwind.config.ts       # Tailwind CSS configuration