/** @jsxImportSource @emotion/react */
import { css, jsx, Global } from '@emotion/react';
import emotionReset from 'emotion-reset';
import { Work } from './work4';

const globalStyles = css`
    ${emotionReset}
    *, *::after, *::before {
        box-sizing: border-box;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        font-smoothing: antialiased;
    }
`;

const App = () => {
  return (
    <div>
      <Global styles={globalStyles} />
      <Work />
    </div>
  );
};

export default App;