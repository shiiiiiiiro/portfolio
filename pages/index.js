import { NotionAPI } from 'notion-client';
import { NotionRenderer } from 'react-notion-x';
import 'react-notion-x/src/styles.css';

export async function getStaticProps() {
  const notion = new NotionAPI();
  const pageId = process.env.NOTION_PAGE_ID; // 環境変数から取得

  const recordMap = await notion.getPage(pageId);

  return {
    props: {
      recordMap,
    },
    revalidate: 10, // 10秒ごとに再生成
  };
}

export default function Home({ recordMap }) {
  return (
    <div>
      <h1>My Notion Portfolio 🚀</h1>
      <NotionRenderer recordMap={recordMap} fullPage={true} darkMode={false} />
    </div>
  );
}
