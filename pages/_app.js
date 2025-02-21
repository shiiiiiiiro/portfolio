import '../styles/globals.css'; // グローバルCSSのインポート
import 'react-notion-x/src/styles.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
