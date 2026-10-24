import type { APIRoute } from 'astro';
import { landingMarkdown } from '../data/markdown';

export const GET: APIRoute = () => new Response(landingMarkdown('en'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
