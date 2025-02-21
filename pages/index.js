import { NotionAPI } from 'notion-client';
import { NotionRenderer } from 'react-notion-x';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import '../styles/globals.css';

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
  return (
    <div>
      {/* ヘッダー */}
      <header className="header">
        <h1>My Notion Portfolio 🚀</h1>
      </header>

      {/* ギャラリービュー */}
      <div className="gallery">
        {Object.keys(recordMap.block).map((key) => {
          const block = recordMap.block[key].value;
          if (block.type === 'page') {
            const title = block.properties?.title?.[0]?.[0] || 'Untitled';
            const pageId = block.id.replace(/-/g, '');
            const imageUrl = `https://www.notion.so/image/${encodeURIComponent(block.format?.page_cover || '')}?table=block&id=${block.id}&cache=v2`;

            return (
              <Link href={`/page/${pageId}`} key={block.id}>
                <a className="notion-collection-card">
                  <img src={imageUrl} alt={title} />
                </a>
              </Link>
            );
          }
        })}
      </div>

      {/* フッター */}
      <footer className="footer">
        <p>&copy; 2025 My Portfolio</p>
      </footer>
    </div>
  );
}
