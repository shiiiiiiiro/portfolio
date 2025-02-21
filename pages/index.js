import { NotionAPI } from 'notion-client';
import { NotionRenderer } from 'react-notion-x';
import dynamic from 'next/dynamic';
import 'react-notion-x/src/styles.css';

// ギャラリーやメディア用のコンポーネントを読み込み
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
      <h1>My Notion Portfolio 🚀</h1>
      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={false}
        components={{
          Collection,
          Equation,
          Pdf,
          Modal
        }}
      />
    </div>
  );
}
