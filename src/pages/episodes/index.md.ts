import type { APIRoute } from 'astro';
import { episodesMarkdown } from '../../data/markdown';

export const GET: APIRoute = () => new Response(episodesMarkdown('en'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
