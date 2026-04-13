import SentimentBadge from '../ui/SentimentBadge';

export default function NewsArticles({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {articles.map((article, i) => {
        const title = article.title || article.headline || 'Untitled';
        const source = article.source || article.publisher || '';
        const sentiment = article.sentiment || null;
        const url = article.url || article.link || '#';
        const date = article.date || article.published_at || null;

        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col p-4 bg-[#111] hover:bg-[#151515] border border-[#222] rounded-lg transition-colors group"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <p className="text-[13px] text-neutral-200 group-hover:text-white transition-colors leading-snug">
                {title}
              </p>
              {sentiment && <SentimentBadge sentiment={sentiment} />}
            </div>
            <div className="flex items-center gap-3">
              {source && (
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
                  {source}
                </span>
              )}
              {source && date && <span className="w-1 h-1 rounded-full bg-[#333]" />}
              {date && (
                <span className="text-[10px] text-neutral-500 font-mono">
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
}
