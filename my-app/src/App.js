import './App.css';
import React, { useState, useEffect } from "react";
import data from "./files.json"

let files = data;

function FolderButton({ imageSrc, folderName, currentPath, setCurrentPath }) {
  return (
    <button className="folder-button" 
      onClick={() => {
        const newPath = [...currentPath, folderName];
        setCurrentPath(newPath);
      }}
      oncontextmenu={(e) => {
        e.preventDefault();
      }}
    >
      <img src={imageSrc} alt="Folder Icon" className="folder-button-image"></img>
      {folderName}
    </button>
  );
}

function FileButton({ fileName, currentPath, filteredFiles }) {
  const filePath = ["", ...currentPath, fileName + "." + filteredFiles.find(entry => entry.name === fileName).type].join("/")
  const [showPdf, setShowPdf] = useState(false);

  useEffect(() => {
    const handleKeyPressed = (event) => {
      if(event.key === "Escape") {
        setShowPdf(false);
      }
    }
    document.addEventListener("keydown", handleKeyPressed);
  })


  return (
    <div>
      <button onClick={() => setShowPdf(true)}>
        {fileName + "." + filteredFiles.find(entry => entry.name === fileName).type}
      </button>

      {showPdf && (
        <iframe src={filePath} className="show-file"></iframe>
      )}
    </div>
  );
}

function SearchBar( { setFilteredFiles, currentPath } ) {
  return (
    <div className="searchbar">
      <img className="searchbar-image" src="/images/magnifying-glass.png" alt="search"></img>
      <textarea className="searchbar-input" placeholder="Search . . ." onChange={(e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterFiles({setFilteredFiles, searchTerm, currentPath})
      }}></textarea>
    </div>
  );
}

function Logo() {
  return (
    <div>  
      <img src="" alt="Logo"></img>
      <h>Citrus Notes</h>
    </div>
  );
}

function filterFiles( { setFilteredFiles, searchTerm, currentPath } ) {

  const filteredData = getCurrentFolderContents(currentPath)
    .filter(file => file.name.toLowerCase().includes(searchTerm))
    .sort((a, b) => a.name.localeCompare(b.name));

  setFilteredFiles(filteredData);
}

function getCurrentFolderContents(path) {
  let currentFolder = { contents: files };
  for (let folderName of path) {
    const folder = currentFolder.contents.find(
      (item) => item.name === folderName && item.type === "folder"
    );
    currentFolder = folder || {};
  }
  return currentFolder.contents || [];
};

function DirectoryHeader({ currentPath, setCurrentPath }) {
  const path = ["Drive", ...currentPath];
  if(path.length === 1) {
    return <h>Drive</h>
  }
  return (
    <div className="directory-header">
      <button onClick={() => {
          const previous = currentPath.slice(0, -1);
          setCurrentPath(previous)
        }}>Back</button>
      <CreateFolder/>
      <h value={path[path.length-1]}></h>
    </div>
  );

}

function CreateFolder() {
  return(
    <button>New Folder</button>
  );
}

function App() {
  const [filteredFiles, setFilteredFiles] = useState(files);
  const [currentPath, setCurrentPath] = useState([])

  useEffect(() => {
    const folderContents = getCurrentFolderContents(currentPath);
    setFilteredFiles(folderContents);
  }, [currentPath]);

  return (
    <div className="page">
      <div className="page-top-bar">
        <Logo/>
        <SearchBar setFilteredFiles={setFilteredFiles} currentPath={currentPath}/>
      </div>
      <div className="page-browse">
        <div className="file-directory">
          <div className="file-directory-options">
            <button className="file-directory-button">Recent</button>
            <button className="file-directory-button">Cutrus Drive</button>
          </div>
        </div>
        <div className="file-explorer">
          <DirectoryHeader
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
          />
          <div className="file-explorer-folders">
            <div className="file-explorer-folders-column">
              {filteredFiles.map((file) => {
                if(file.type === "folder") {
                  return <FolderButton 
                    imageSrc="/images/folder.png"
                    folderName={file.name} 
                    currentPath={currentPath} 
                    setCurrentPath={setCurrentPath} 
                    setFilteredFiles={setFilteredFiles}
                  />
                }
                return null
              })}
            </div>
          </div>
          <div className="file-explorer-files">
            {filteredFiles.map((file) => {
              if(file.type !== "folder") {
                return <FileButton
                  fileName={file.name}
                  currentPath={currentPath}
                  filteredFiles={filteredFiles}
                />
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
