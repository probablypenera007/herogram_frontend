import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getAnonymousToken, setAuthToken } from './api/client';
import CreatePoll from './components/CreatePoll';
import PollView from './components/PollView';

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const token = await getAnonymousToken();
        setAuthToken(token);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication failed:', error);
      }
    };

    authenticate();
  }, []);

  if (!isAuthenticated) {
    return (
      <ChakraProvider>
        <Box p={4}>Loading...</Box>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Box p={4}>
            <Routes>
              <Route path="/" element={<CreatePoll />} />
              <Route path="/poll/:id" element={<PollView />} />
            </Routes>
          </Box>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
