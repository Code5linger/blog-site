import { useState, useEffect } from 'react';
import articles from './article-content';
import { useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import CommentsList from '../components/CommentsList';
import axios from 'axios';
import AddCommentForm from '../components/AddCommentsForm';
import useUser from '../hooks/useUser';

const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState({
    upvotes: 69,
    comments: [],
    canUpvote: false,
  });
  const { canUpvote } = articleInfo;
  const { articleId } = useParams();
  const { user, isLoading } = useUser();

  const article = articles.find((article) => article.name === articleId);

  useEffect(() => {
    const loadArticleInfo = async () => {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      const response = await axios.get(`/api/articles/${articleId}`, {
        headers,
      });
      const newArticleInfo = response.data;
      setArticleInfo(newArticleInfo);
    };

    if (!isLoading) {
      loadArticleInfo();
    }
  }, [isLoading, user]);

  const addUpvote = async () => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const response = await axios.put(
      `/api/articles/${articleId}/upvote`,
      null,
      { headers }
    );
    const updatedArticle = response.data;
    setArticleInfo(updatedArticle);
  };

  if (!article) {
    return <NotFoundPage />;
  }

  return (
    <>
      <h1>{article.title}</h1>
      <div className="upvotes-section">
        {user ? (
          <button onClick={addUpvote}>
            {canUpvote ? 'Upvote' : 'Already Upvoted'}
          </button>
        ) : (
          <button>Log in to upvote</button>
        )}
        <p>This article has {articleInfo.upvotes} upvote(s).</p>
      </div>
      {article.content.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}

      {user ? (
        <AddCommentForm
          articleName={articleId}
          onArticleUpdated={(updatedArticle) => setArticleInfo(updatedArticle)}
        />
      ) : (
        <button>Log in to add comment</button>
      )}

      <CommentsList comments={articleInfo.comments} />
    </>
  );
};

export default ArticlePage;
