import { useEffect, useRef, useCallback, useState } from 'react'
import { WikiCard } from './components/WikiCard'
import { useWikiArticles } from './hooks/useWikiArticles'

import "./styles/app.css";

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const { articles, fetchArticles } = useWikiArticles();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false); // To prevent duplicate fetches

  // Function to fetch more articles and append them to the list
  const fetchMoreArticles = async () => {
    if (loadingMore) return; // Prevent multiple fetches at once

    setLoadingMore(true);
    fetchArticles(); // This updates `articles` in your context/hook
    setLoadingMore(false);
  };

  // Function to move to the next article
  const nextArticle = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;

      // Fetch more articles if reaching the last article
      if (nextIndex >= articles.length - 1) {
        fetchMoreArticles();
      }

      return nextIndex;
    });
  };

  // Function to move to the previous article (with wrap-around behavior)
  const prevArticle = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // Fetch initial articles when the component mounts
  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="wikitok-main">
      <div className="wikitok-toggle-about">
        <button onClick={() => setShowAbout((prev) => !prev)}>About</button>
      </div>

      {showAbout && (
        <div className="wikitok-about">
          <p>An interface for exploring random Wikipedia articles.</p>
          <p>
            Modified from &nbsp;
            <a
              href="https://github.com/IsaacGemal/wikitok"
              target="_blank"
              rel="noopener noreferrer"
            >
              Isaac Gemal's "WikiTok"
            </a>.
          </p>
          <p>
            Check out the code on
            &nbsp;
            <a href="https://github.com/<name>/new-name">
              GitHub
            </a>.
          </p>
        </div>
      )}

      <div className="carousel-container">
        <button onClick={prevArticle} disabled={articles.length === 0}>◀</button>

        <div className="carousel-content">
          {articles.length > 0 && (
            <WikiCard key={articles[currentIndex].pageid} article={articles[currentIndex]} />
          )}
        </div>

        <button onClick={nextArticle} disabled={articles.length === 0}>▶</button>

      </div>
    </div>
  )
}
// <div ref={observerTarget} />
// {loading && <span>Loading...</span>}

export default App
