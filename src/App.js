import logo from './logo.svg';
import './App.css';
import {versionInfo} from "./components/VersionInfo";

function App() {
    console.log("versionIn")
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
          <span className="text-white">
             Build: ({versionInfo.buildNumber})
            </span>
      </header>

    </div>
  );
}

export default App;
