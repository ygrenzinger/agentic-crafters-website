import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { Locale } from '../i18n/ui';

/*
 * Contenu éditorial des épisodes, rangé par dossier :
 *
 *   src/content/episodes/<slug>/article.fr.md   article de synthèse en français
 *   src/content/episodes/<slug>/article.en.md   adaptation anglaise
 *   src/content/episodes/<slug>/transcript.txt  transcript intégral
 *
 * Chaque fichier est optionnel : la page épisode masque simplement la section
 * correspondante, pour qu'un oubli dégrade la page au lieu de casser le build.
 */

interface MarkdownModule {
  Content: AstroComponentFactory;
}

const articles = import.meta.glob<MarkdownModule>('../content/episodes/*/article.*.md', { eager: true });
const rawArticles = import.meta.glob<string>('../content/episodes/*/article.*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const transcripts = import.meta.glob<string>('../content/episodes/*/transcript.txt', {
  eager: true,
  query: '?raw',
  import: 'default',
});

export function getArticle(slug: string, lang: Locale): AstroComponentFactory | undefined {
  return articles[`../content/episodes/${slug}/article.${lang}.md`]?.Content;
}

export function getArticleMarkdown(slug: string, lang: Locale): string | undefined {
  return rawArticles[`../content/episodes/${slug}/article.${lang}.md`]?.trim() || undefined;
}

export function getTranscript(slug: string): string | undefined {
  const raw = transcripts[`../content/episodes/${slug}/transcript.txt`];
  return raw?.trim() || undefined;
}
