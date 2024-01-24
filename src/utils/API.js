import request from 'superagent';


const API_BASE_URL = '//opentdb.com/api.php'

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

const API_BASE_URL_2 = '//api.giphy.com/v1/gifs'
export const getGiphy = async (answer) => {
  try {
    const response = await request
      .get(API_BASE_URL_2)
      .query({
        q: answer,
        limit: 1,
        rating: pg,
        lang: eng,
      });

    return response.body.results;
  } catch (error) {
    console.error('Error fetching gif:', error);
    throw error;
  }
};



