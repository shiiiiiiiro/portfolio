import { NotionAPI } from 'notion-client';
import { useState } from 'react';


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
          const block = recordMap.block[key]?.value;
          if (block?.type === 'page') {
            const title = block?.properties?.title?.[0]?.[0] || 'Untitled';
            const pageCover = block?.format?.page_cover;
            const imageUrl = pageCover
              ? `https://www.notion.so/image/${encodeURIComponent(pageCover)}?table=block&id=${block.id}&cache=v2`
              : '/default-thumbnail.png'; // サムネがない場合のデフォルト

            return (
              <div
                key={block.id}
                className="notion-collection-card"
                onClick={() => setModalImage(imageUrl)}
              >
                <img src={imageUrl} alt={title} />
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

      {/* モーダルとギャラリー用スタイル */}
      <style jsx>{`
        .gallery {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
        }

        .notion-collection-card {
          width: 200px;
          height: 200px;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }

        .notion-collection-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

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
        }
      `}</style>
    </div>
  );
}
