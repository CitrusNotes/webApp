import './App.css';
import React, { useState, useEffect } from "react";
import data from "./files.json"

let files = data;

// React function for folder buttons
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

// React function for File Buttons
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

// React Function for search bar
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

// React function for Logo
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

// function 
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

// React function for directory header
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

// React function for creating a folder
function CreateFolder() {
  const onClick = () => {
    
  }
  return(
    <button onClick={onClick}>New Folder</button>
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
    // entire page div
    <div className="page">
      {/* top bar for the page which contains the app name as well as search bar for files */}
      <div className="page-top-bar">
        <title>Citrus Notes</title>
        <SearchBar setFilteredFiles={setFilteredFiles} currentPath={currentPath}/>
      </div>
      {/* main section of the page which is used for browsing directories and viewing files */}
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
  );
}

export default App;