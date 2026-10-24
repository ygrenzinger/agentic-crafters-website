import { episodes, formatDuration, type Episode } from './episodes';
import { getArticleMarkdown, getTranscript } from './episodeContent';
import { ui, episodePath, type Locale } from '../i18n/ui';

const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

export function landingMarkdown(locale: Locale): string {
  const t = ui[locale];
  return `# ${t.metaTitle}\n\n${t.metaDescription}\n\n## ${t.approachTitleLine1}${t.approachTitleLine2}${t.approachTitleEm}\n\n${t.approachP1}\n\n${t.approachP2}\n\n## ${t.topicsTitleLines.join(' ')}\n\n${t.topics.map((topic) => `### ${topic.titleLines.join(' ')}\n\n${topic.body}`).join('\n\n')}\n\n## ${t.hostsTitleLines.join(' ')}\n\n### Arthur Magne — ${t.arthurRole}\n\n${t.arthurBio}\n\n### Yannick Grenzinger — ${t.yannickRole}\n\n${t.yannickBio}\n\n## ${t.episodesTitle}\n\n${episodes.map((episode) => `- [${episode.title}](${episodePath(locale, episode.slug)})`).join('\n')}\n`;
}

export function episodesMarkdown(locale: Locale): string {
  const t = ui[locale];
  return `# ${t.episodesTitle}\n\n${t.episodesIntro}\n\n${episodes.map((episode) => episodeListEntry(episode, locale)).join('\n\n')}\n`;
}

function episodeListEntry(episode: Episode, locale: Locale): string {
  const date = new Intl.DateTimeFormat(ui[locale].htmlLang, { dateStyle: 'long' }).format(new Date(episode.publishedAt));
  const summary = episode.summary?.[locale];
  return `## [${episode.title}](${episodePath(locale, episode.slug)})\n\n${date} · ${formatDuration(episode.durationSeconds)}${summary ? `\n\n${summary}` : ''}`;
}

export function episodeMarkdown(episode: Episode, locale: Locale): string {
  const t = ui[locale];
  const summary = episode.summary?.[locale];
  const article = getArticleMarkdown(episode.slug, locale);
  const transcript = getTranscript(episode.slug);
  const guest = episode.guest ? `\n\n**${t.episodeGuest}:** ${episode.guest.name}, ${episode.guest.role[locale]}` : '';
  const parts = [
    `# ${episode.title}`,
    `${t.episodePublished} ${new Intl.DateTimeFormat(t.htmlLang, { dateStyle: 'long' }).format(new Date(episode.publishedAt))} · ${t.episodeDuration} ${formatDuration(episode.durationSeconds)}${guest}`,
    summary,
    article ? `## ${t.episodeArticleTitle}\n\n${article}` : undefined,
    `## ${locale === 'fr' ? 'Écouter et regarder' : 'Listen and watch'}\n\n[YouTube](${`https://www.youtube.com/watch?v=${episode.youtubeId}`})${episode.spotifyUrl ? ` · [Spotify](${episode.spotifyUrl})` : ''}${episode.applePodcastsUrl ? ` · [Apple Podcasts](${episode.applePodcastsUrl})` : ''}`,
    transcript ? `## ${t.episodeTranscriptTitle} (français)\n\n${transcript}` : undefined,
  ].filter(Boolean);
  return `${parts.join('\n\n')}\n`;
}

export function llmsMarkdown(site: URL, base: string): string {
  const root = new URL(base.endsWith('/') ? base : `${base}/`, site);
  const link = (path: string) => new URL(path.replace(/^\//, ''), root).href;
  const section = (locale: Locale) => {
    const prefix = locale === 'fr' ? 'fr/' : '';
    return [`- [${locale.toUpperCase()} home](${link(`${prefix}index.md`)})`, `- [${ui[locale].episodesTitle}](${link(`${prefix}episodes/index.md`)})`, ...episodes.map((episode) => `- [${clean(episode.title)}](${link(`${prefix}episodes/${encodeURIComponent(episode.slug)}/index.md`)})`)].join('\n');
  };
  return `# Agentic Crafters\n\n${ui.en.metaDescription}\n\n## English\n\n${section('en')}\n\n## Français\n\n${section('fr')}\n`;
}
