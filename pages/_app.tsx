import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'; 

import TagManager from "react-gtm-module";
import { useEffect } from 'react';


const App = ({ Component, pageProps }: AppProps) => {

  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-K9MS49R' });
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;