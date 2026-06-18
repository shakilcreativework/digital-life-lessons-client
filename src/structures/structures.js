// digital-life-lessons-client/
// ├── public/
// ├── src/
// │   ├── app/
// │   │   ├── (auth)/                 # Group for clean auth routing paths
// │   │   │   ├── login/
// │   │   │   │   └── page.js
// │   │   │   └── register/
// │   │   │       └── page.js
// │   │   ├── (dashboard)/            # Group that isolates private layout logic
// │   │   │   ├── dashboard/
// │   │   │   │   ├── page.js         # Main stats overview panel
// │   │   │   │   ├── add-lesson/
// │   │   │   │   │   └── page.js
// │   │   │   │   ├── my-lessons/
// │   │   │   │   │   └── page.js
// │   │   │   │   ├── my-favorites/
// │   │   │   │   │   └── page.js
// │   │   │   │   └── profile/
// │   │   │   │       └── page.js
// │   │   │   └── layout.js           # Shared Dashboard Sidebar/Navbar layout
// │   │   ├── lessons/
// │   │   │   ├── page.js             # Public Lessons page (Search/Filter/Sort)
// │   │   │   └── [id]/
// │   │   │       └── page.js         # Life Lesson Details page
// │   │   ├── pricing/
// │   │   │   └── page.js
// │   │   ├── payment/
// │   │   │   ├── success/
// │   │   │   │   └── page.js
// │   │   │   └── cancel/
// │   │   │       └── page.js
// │   │   ├── layout.js               # Global Root Layout (Navbar, Footer, Providers)
// │   │   ├── page.js                 # Home Landing Page
// │   │   └── not-found.js            # Custom 404 Page
// │   ├── components/                 # Reusable UI Architecture
// │   │   ├── common/
// │   │   │   ├── Navbar.js
// │   │   │   └── Footer.js
// │   │   ├── lessons/
// │   │   │   ├── LessonCard.js
// │   │   │   ├── BlurredPremiumCard.js
// │   │   │   └── CommentSection.js
// │   │   └── providers/
// │   │       └── HeroUIProvider.js   # Combines HeroUI + Theme toggle providers
// │   ├── lib/                        # Global setup files
// │   │   └── auth-client.js          # Better Auth client config
// │   └── styles/
// │       └── globals.css             # Holds your Tailwind v4 @theme colors