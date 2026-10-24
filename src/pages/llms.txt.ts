import type { APIRoute } from 'astro';
import { llmsMarkdown } from '../data/markdown';

export const GET: APIRoute = ({ site }) => new Response(llmsMarkdown(site!, import.meta.env.BASE_URL), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
