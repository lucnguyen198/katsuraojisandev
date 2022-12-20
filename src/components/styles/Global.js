import { createGlobalStyle } from 'styled-components';
import GenShinFont from 'assets/fonts/GenShinGothicHeavy/GenShinGothic-Heavy.woff';

const GlobalStyles = createGlobalStyle`
    @font-face {
        font-family: 'GenShinGothic-Heavy';
        font-style: normal;
        font-weight: normal;
        src: url(${GenShinFont}) format('woff');
    }
    * {
        box-sizing: border-box;
    }
    :root {
        font-size: 16px;
    }
    body {
        background-color: #7fcdc8;
        font-size: 1rem;
        color: #FFF;
        margin: 0;
        font-family: 'GenShinGothic-Heavy', sans-serif;
    }
    img {
        max-width: 100%;
    }
`;

export default GlobalStyles;