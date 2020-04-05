import { News } from './Interfaces/INews';
import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import Telegraf from 'telegraf';

dotenv.config();

export const send = async (): Promise<void> => {
  const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://newsapi.org/v2/',
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const response = await apiClient.get<News>(
    `top-headlines?country=it&category=sport&pageSize=5&apiKey=${process.env.NEWS_API}`,
  );

  const bot = new Telegraf(process.env.BOT_TOKEN);
  const articleToSend = response.data.articles.map((article) =>
    bot.telegram.sendMessage(
      process.env.CHAT_ID,
      `${article.title}: \n ${article.url}`,
    ),
  );
  await Promise.all(articleToSend);
};
