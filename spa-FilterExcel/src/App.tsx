import { GlobalStyle } from "./GlobalStyled";
import Header from "./components/Header/Header";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <GlobalStyle/>
      <Header />
      <Home />
    </>
  );
}

export default App;
