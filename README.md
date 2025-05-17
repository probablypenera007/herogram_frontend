# Team Polls Frontend

A modern React application for creating and participating in real-time polls.

## Features

- Create polls with multiple options
- Real-time vote updates
- Responsive design
- Anonymous authentication
- Progress bars for vote visualization

## Prerequisites

- Node.js 18+
- npm or yarn

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following content:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

```bash
npm run build
```

## Technologies Used

- React 18
- TypeScript
- Vite
- Chakra UI
- React Query
- React Router
- Axios

## Project Structure

```
src/
  ├── api/          # API client and types
  ├── components/   # React components
  ├── App.tsx       # Main application component
  └── main.tsx      # Application entry point
```

## Development

The application uses:
- Chakra UI for styling
- React Query for data fetching and caching
- React Router for navigation
- Axios for API requests

## License

ISC
