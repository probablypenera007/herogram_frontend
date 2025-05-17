import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { createPoll } from '../api/client';

export default function CreatePoll() {
  const navigate = useNavigate();
  const toast = useToast();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const createPollMutation = useMutation({
    mutationFn: createPoll,
    onSuccess: (data) => {
      navigate(`/poll/${data.id}`);
      toast({
        title: 'Poll created successfully',
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to create poll',
        status: 'error',
        duration: 3000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPollMutation.mutate({
      question,
      options: options.filter(opt => opt.trim() !== ''),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <Box maxW="600px" mx="auto">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Question</FormLabel>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question"
            />
          </FormControl>

          <Text fontWeight="bold">Options</Text>
          {options.map((option, index) => (
            <FormControl key={index} isRequired>
              <FormLabel>Option {index + 1}</FormLabel>
              <Input
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Enter option ${index + 1}`}
              />
            </FormControl>
          ))}

          <Button onClick={addOption} variant="outline">
            Add Option
          </Button>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={createPollMutation.isPending}
          >
            Create Poll
          </Button>
        </VStack>
      </form>
    </Box>
  );
} 