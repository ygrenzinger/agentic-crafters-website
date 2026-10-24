import type { APIRoute, GetStaticPaths } from 'astro';
import { episodes } from '../../../data/episodes';
import { episodeMarkdown } from '../../../data/markdown';

export const getStaticPaths: GetStaticPaths = () => episodes.map((episode) => ({ params: { slug: episode.slug }, props: { episode } }));
export const GET: APIRoute = ({ props }) => new Response(episodeMarkdown(props.episode, 'en'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
