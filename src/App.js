/** @jsxImportSource @emotion/react */
import { css, jsx, Global } from '@emotion/react';
import emotionReset from 'emotion-reset';
import { Work } from './work5';
import { Header } from './header';
import {SketchPicker} from 'react-color'

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
      <Header />
      <Work />
      <SketchPicker />
    </div>
  );
};

export default App;