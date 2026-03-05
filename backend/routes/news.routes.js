import express from 'express';
import { getNews, getTopNews } from '../controllers/news.controller.js';
const router=express.Router();
router.get('/news/:category',getNews);
router.get('/top-news',getTopNews);

export default router;