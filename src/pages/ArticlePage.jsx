import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import articles from './article-content';
import axios from 'axios';

// import CommentsList from '../components/CommentsList';

const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] });
  const { articleId } = useParams();

  const article = articles.find((article) => article.name === articleId);

  useEffect(() => {
    const loadArticleInfo = async () => {
      const response = await axios.get(`api/articles/${articleId}`);
      // const response = await axios.get(`api/articles/learn-react`);
      const newArticleInfo = response.data;
      setArticleInfo(newArticleInfo);
      console.log(newArticleInfo);
    };

    loadArticleInfo();
  }, [articleId]);

  if (!article) {
    return <NotFoundPage />;
  }

  return (
    <>
      <h1>{article.title}</h1>
      <p>This article has {articleInfo.upvotes} upvote(s)</p>
      {article.content.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {/* <CommentsList comments={articleInfo.comments} /> */}
    </>
  );
};

export default ArticlePage;
