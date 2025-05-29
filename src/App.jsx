import MainPanel from "./components/mainPanel";
import HeaderImage from "./images/header.png";

function App() {
  return (
    <div className="app p-4">
      <div className="flex items-center justify-center mb-4">
        <img src={HeaderImage} alt="Drum Machine" width={300} />
      </div>
      <MainPanel />
    </div>
  );
}

export default App;
