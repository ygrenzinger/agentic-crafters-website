import type { APIRoute } from 'astro';
import { landingMarkdown } from '../../data/markdown';

export const GET: APIRoute = () => new Response(landingMarkdown('fr'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
