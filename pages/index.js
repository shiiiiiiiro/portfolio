import { NotionAPI } from 'notion-client';
import { NotionRenderer } from 'react-notion-x';
import dynamic from 'next/dynamic';
import { useState } from 'react';
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
  const [modalImage, setModalImage] = useState(null);

  return (
    <div>
      {/* ヘッダー */}
      <header className="header">
        <h1>My Notion Portfolio 🚀</h1>
      </header>

      {/* ギャラリー */}
      <div className="gallery">
        {Object.keys(recordMap.block).map((key) => {
          const block = recordMap.block[key].value;
          if (block.type === 'page') {
            const imageUrl = `https://www.notion.so/image/${encodeURIComponent(block.format?.page_cover || '')}?table=block&id=${block.id}&cache=v2`;

            return (
              <div
                key={block.id}
                className="notion-collection-card"
                onClick={() => setModalImage(imageUrl)}
              >
                <img src={imageUrl} alt="Thumbnail" />
              </div>
            );
          }
        })}
      </div>

      {/* モーダル表示 */}
      {modalImage && (
        <div className="modal" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Full View" />
        </div>
      )}

      <footer className="footer">
        <p>&copy; 2025 My Portfolio</p>
      </footer>

      {/* モーダル用スタイル */}
      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal img {
          max-width: 90%;
          max-height: 90%;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
        }

        .modal:hover {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
