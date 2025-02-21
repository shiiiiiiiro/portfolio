import { NotionAPI } from 'notion-client';
import { NotionRenderer } from 'react-notion-x';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// ギャラリービュー用コンポーネント
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(m => m.Collection)
);
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then(m => m.Equation)
);
const Pdf = dynamic(() =>
  import('react-notion-x/build/third-party/pdf').then(m => m.Pdf), { ssr: false }
);
const Modal = dynamic(() =>
  import('react-notion-x/build/third-party/modal').then(m => m.Modal), { ssr: false }
);

export async function getStaticProps() {
  const notion = new NotionAPI();
  const pageId = process.env.NOTION_PAGE_ID;

  const recordMap = await notion.getPage(pageId);

  return {
    props: {
      recordMap,
    },
    revalidate: 10,
  };
}

export default function Home({ recordMap }) {
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    // タイトルを収集
    const extractedTitles = [];
    Object.values(recordMap?.block || {}).forEach((block) => {
      if (block.value?.type === 'page') {
        extractedTitles.push({
          id: block.value.id,
          title: block.value.properties?.title?.[0]?.[0] || 'Untitled',
        });
      }
    });
    setTitles(extractedTitles);
  }, [recordMap]);

  return (
    <div>
      {/* 📋 サイドバー */}
      <aside className="sidebar">
        <h2>メニュー</h2>
        <ul>
          {titles.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.title}</a>
            </li>
          ))}
        </ul>
      </aside>

      {/* 🖼️ メインコンテンツ */}
      <main className="main-content">
        <header className="header">
          <h1>My Notion Portfolio 🚀</h1>
        </header>

        <div>
          {titles.map((item) => (
            <div className="notion-collection-card" id={item.id} key={item.id}>
              <img src={`https://www.notion.so/image/${item.id}`} alt={item.title} />
              <div className="notion-collection-card-title">{item.title}</div>
            </div>
          ))}
        </div>

        <footer className="footer">
          <p>&copy; 2025 My Portfolio</p>
        </footer>
      </main>
    </div>
  );
}
