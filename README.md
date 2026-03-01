# OsintX - Frontend

Professional OSINT tools platform for cybersecurity investigations.

## Features

### Tools Available
- **Breach Database** - Check email/password compromises
- **Data Mining** - Extract patterns from datasets  
- **DNS Records** - Lookup DNS configurations
- **Domain Analysis** - WHOIS, subdomains, SSL checks
- **Email Forensics** - Header analysis and verification
- **Geolocation** - IP and phone location tracking
- **Hash Analyzer** - Malware hash detection
- **Image EXIF** - Extract metadata from images
- **IP Intelligence** - Comprehensive IP analysis
- **Phone Lookup** - Carrier and validation checks
- **Social Profiler** - Username searches across platforms
- **URL Scanner** - Threat analysis for URLs
- **Global Threat Map** - Real-time cyber attack visualization

### User Roles
- **Student** - Limited tool access for learning
- **User** - Full tool access with standard features

## Tech Stack

- **React 18** with Vite
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Simple Maps** for threat map visualization
- **Lucide Icons** for UI icons

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
cd frontend
npm install

# Copy environment config
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create `.env` file with:

```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/ws
VITE_ENABLE_MOCK_MODE=true
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components (Toast, Loading, Error)
│   │   ├── auth/            # Auth components (ProtectedRoute)
│   │   ├── tools/           # Tool-specific components
│   │   └── ThreatMap/       # Threat map visualization
│   ├── context/             # React Context providers
│   │   ├── AuthContext      # Authentication state
│   │   ├── RoleContext      # User role management
│   │   ├── CreditContext    # Credit/usage tracking
│   │   └── ...
│   ├── services/            # API services
│   │   ├── api.js           # Base API config
│   │   ├── tools/           # Tool-specific services
│   │   └── ...
│   ├── utils/               # Utilities
│   │   └── validators.js    # Input validation
│   ├── hooks/               # Custom hooks
│   │   ├── useFetch.js      # Data fetching
│   │   └── useDebounce.js   # Debounced values
│   ├── pages/               # Page components
│   │   ├── auth/            # Login, Signup
│   │   └── dashboards/      # Role-specific dashboards
│   └── mock-api/            # Mock data for development
└── ...
```

## Development

### Mock Mode
Enable mock mode in `.env` to develop without backend:
```env
VITE_ENABLE_MOCK_MODE=true
```

### Building for Production
```bash
npm run build
```

Output in `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

## API Integration

All tools use service modules in `src/services/tools/`. Each service:
- Validates inputs
- Handles errors
- Returns typed responses

Example usage:
```javascript
import { ipIntelligenceService } from '@/services';

const result = await ipIntelligenceService.lookup('8.8.8.8');
```

See [API Documentation](../docs/API.md) for full endpoint details.

## Component Usage

### Toast Notifications
```javascript
import { useToast } from '@/components/common/Toast';

const toast = useToast();
toast.success('Operation completed');
toast.error('Something went wrong');
```

### Loading States
```javascript
import { Spinner, LoadingOverlay } from '@/components/common/Loading';

// Inline spinner
<Spinner size="md" />

// Full-screen overlay
<LoadingOverlay message="Processing..." />
```

### Error Handling
```javascript
import { ErrorMessage, EmptyState } from '@/components/common/ErrorDisplay';

<ErrorMessage message="Failed to load" onRetry={refetch} />
<EmptyState title="No results" message="Try different search terms" />
```

### Protected Routes
```javascript
import { ProtectedRoute, RoleRoute } from '@/components/auth/ProtectedRoute';

// Require authentication
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Require specific role
<RoleRoute role="user">
  <Dashboard />
</RoleRoute>
```

## Input Validation

Use validators from `utils/validators.js`:

```javascript
import { validateEmail, validateIP, validateDomain } from '@/utils/validators';

const result = validateEmail('test@example.com');
if (!result.valid) {
  console.error(result.error);
}
```

Available validators:
- `validateEmail()`
- `validateIP()`
- `validateDomain()`
- `validateURL()`
- `validatePhone()`
- `validateHash()`
- `validateUsername()`
- And more...

## Credits & Usage

Tools consume credits per use. Check `CreditContext` for current balance:

```javascript
import { useCredit } from '@/context/CreditContext';

const { credits, deductCredits } = useCredit();
```

## Security

- All inputs are sanitized
- XSS protection enabled
- CSRF tokens on mutations
- Rate limiting enforced
- Authentication required for all tools

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

Proprietary - All rights reserved
