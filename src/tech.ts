import { News } from './Interfaces/INews';
import axios, { AxiosError, AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import Telegraf from 'telegraf';
import queryString from 'query-string';

dotenv.config();

export const send = async (): Promise<void> => {
  const apiClient = axios.create({
    baseURL: 'http://newsapi.org/v2/',
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const successHandler = <T>(response: T): T => response;
  const errorHandler = <T>(error: T): void => {
    throw error;
  };
  apiClient.interceptors.response.use(
    (response: AxiosResponse<News>) => successHandler(response),
    (error: AxiosError) => errorHandler(error.response),
  );
  try {
    const response = await apiClient.get<News>(
      `top-headlines?  ${queryString.stringify(
        {
          sources: 'techcrunch',
          pageSize: 5,
          apiKey: process.env.NEWS_API,
        },
        { sort: false },
      )}`,
    );

    const bot = new Telegraf(process.env.BOT_TOKEN);
    const articleToSend = response.data.articles.map((article) =>
      bot.telegram.sendMessage(
        process.env.CHAT_ID,
        `${article.title}: \n ${article.url}`,
      ),
    );
    await Promise.all(articleToSend);
  } catch (e) {
    console.log(e);
  }
};
