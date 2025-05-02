import "@styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
<script src="https://kit.fontawesome.com/cfec824b02.js" crossOrigin="anonymous"></script>
export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
