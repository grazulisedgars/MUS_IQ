import request from 'superagent';

const API_BASE_URL = 'https://opentdb.com/api.php'

export const getTriviaQuestions = async (amount, difficulty) => {
  try {
    const response = await request
      .get(API_BASE_URL)
      .query({
        amount: amount,
        category: 12,
        difficulty: difficulty,
      });

    return response.body.results;
  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    throw error;
  }
};

