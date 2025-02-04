import { useState, useEffect } from 'react';

import "../styles/wikicard.css";

interface WikiArticle {
  title: string;
  pageid: number;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}

interface WikiCardProps {
  article: WikiArticle;
}

export function WikiCard({ article }: WikiCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [articleContent, setArticleContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleContent = async () => {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?` +
          `action=query&format=json&origin=*&prop=extracts&` +
          `pageids=${article.pageid}&explaintext=1&exintro=1&` +
          `exsentences=5`  // Limit to 5 sentences
        );
        const data = await response.json();
        const content = data.query.pages[article.pageid].extract;
        if (content) {
          setArticleContent(content);
        }
      } catch (error) {
        console.error('Error fetching article content:', error);
      }
    };

    fetchArticleContent();
  }, [article.pageid]);

  return (
    <div className="wikicard-main">
      {article.thumbnail && (
        <div className="wikicard-image">
          <img
            loading="lazy"
            src={article.thumbnail.source}
            alt={article.title}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)} // Ensures content loads even if the image fails
          />
          {!imageLoaded && <div />}
        </div>
      )}

      <div className="wikicard-description">
        <div>
          <a
            href={`https://en.wikipedia.org/?curid=${article.pageid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>{article.title}</h2>
          </a>
          {articleContent ? (
            <p>{articleContent}</p>
          ) : (
            <p>Loading description...</p>
          )}
        </div>
        <div>
          <a
            href={`https://en.wikipedia.org/?curid=${article.pageid}`}
            target="_blank"
            rel="noopener noreferrer"

          >
            Read more →
          </a>
        </div>
      </div>
    </div>
  )};
