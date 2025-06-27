import MainPanel from "./components/MainPanel";
import Footer from "./components/ui/elements/Footer";
import HeaderImage from "./images/header.png";

function App() {
  return (
    <div className="app p-4 flex flex-col">
      <div className="flex items-center justify-center mb-4">
        <img src={HeaderImage} alt="Drum Machine" width={300} />
      </div>
      <MainPanel />
      <Footer />
    </div>
  );
}

export default App;
