import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Progress,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { getPoll, castVote, PollResult } from '../api/client';

export default function PollView() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const { data: pollResult, isLoading } = useQuery<PollResult>({
    queryKey: ['poll', id],
    queryFn: () => getPoll(Number(id)),
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const voteMutation = useMutation({
    mutationFn: (optionIndex: number) => castVote(Number(id), { option_index: optionIndex }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poll', id] });
      toast({
        title: 'Vote recorded successfully',
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to record vote',
        status: 'error',
        duration: 3000,
      });
    },
  });

  const handleVote = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    voteMutation.mutate(optionIndex);
  };

  if (isLoading || !pollResult) {
    return <Box p={4}>Loading...</Box>;
  }

  const { poll, votes, total_votes } = pollResult;

  return (
    <Box maxW="600px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">
          {poll.question}
        </Text>

        {poll.options.map((option, index) => {
          const voteCount = votes[index] || 0;
          const percentage = total_votes > 0 ? (voteCount / total_votes) * 100 : 0;

          return (
            <Box key={index}>
              <Button
                w="100%"
                h="auto"
                p={4}
                onClick={() => handleVote(index)}
                isDisabled={poll.is_closed || voteMutation.isPending}
                colorScheme={selectedOption === index ? 'blue' : 'gray'}
                variant={selectedOption === index ? 'solid' : 'outline'}
              >
                <VStack w="100%" align="stretch" spacing={2}>
                  <Text>{option}</Text>
                  <Progress value={percentage} colorScheme="blue" />
                  <Text fontSize="sm">
                    {voteCount} votes ({percentage.toFixed(1)}%)
                  </Text>
                </VStack>
              </Button>
            </Box>
          );
        })}

        <Text fontSize="sm" color="gray.500">
          Total votes: {total_votes}
        </Text>

        {poll.is_closed && (
          <Text color="red.500" fontWeight="bold">
            This poll is closed
          </Text>
        )}
      </VStack>
    </Box>
  );
} 