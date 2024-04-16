import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

html{
  width: auto;
}

body{
  max-width: 100vw;
  height: 100vh;
  background-color: #f5f5f5;
}


`