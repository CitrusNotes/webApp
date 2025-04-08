import './../styling/App.css';
import React, { useState, useEffect } from "react";
import data from "./../files.json";
import { Navigate, useNavigate } from 'react-router-dom';


let files = data;

function FolderButton({ imageSrc, folderName, currentPath, setCurrentPath }) {
  return (
    <button className="folder-button"
      onClick={() => {
        const newPath = [...currentPath, folderName];
        setCurrentPath(newPath);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <img src={imageSrc} alt="Folder Icon" className="folder-button-image" />
      {folderName}
    </button>
  );
}

function FileButton({ fileName, currentPath, filteredFiles }) {
  const filePath = ["", ...currentPath, fileName + "." + filteredFiles.find(entry => entry.name === fileName).type].join("/");
  const [showPdf, setShowPdf] = useState(false);

  useEffect(() => {
    const handleKeyPressed = (event) => {
      if (event.key === "Escape") {
        setShowPdf(false);
      }
    };
    document.addEventListener("keydown", handleKeyPressed);
  });

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

function SearchBar({ setFilteredFiles, currentPath }) {
  return (
    <div className="searchbar">
      <textarea
        className="searchbar-input"
        placeholder="Search files..."
        onChange={(e) => {
          const searchTerm = e.target.value.toLowerCase();
          filterFiles({ setFilteredFiles, searchTerm, currentPath });
        }}
      />
      <svg
        className="searchbar-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="logo-container">
      <img src="/imageLogo.png" alt="Logo" className="logo" />
      <h1 className="logo-title">Citrus Notes</h1>
    </div>
  );
}

function filterFiles({ setFilteredFiles, searchTerm, currentPath }) {
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
}

function DirectoryHeader({ currentPath, setCurrentPath }) {
  const path = ["Drive", ...currentPath];
  if (path.length === 1) {
    return <h1>Drive</h1>;
  }
  return (
    <div className="directory-header">
      <button onClick={() => {
        const previous = currentPath.slice(0, -1);
        setCurrentPath(previous);
      }}>Back</button>
      <CreateFolder />
      <h1>{path[path.length - 1]}</h1>
    </div>
  );
}

function CreateFolder() {
  return (
    <button>New Folder</button>
  );
}

function FileBrowser() {
    const navigate = useNavigate();
    const [filteredFiles, setFilteredFiles] = useState(files);
    const [currentPath, setCurrentPath] = useState([]);
  
    useEffect(() => {
      const folderContents = getCurrentFolderContents(currentPath);
      setFilteredFiles(folderContents);
    }, [currentPath]);
  
    // Show Home Page after successful login
    return (
      <div className="page">
        {/* Button to log out */}
        <button onClick={() => navigate('/')}>Logout</button>

        <div className="page-top-bar">
          <Logo />
          <SearchBar setFilteredFiles={setFilteredFiles} currentPath={currentPath} />
        </div>
        <div className="page-browse">
          <div className="file-directory">
            <div className="file-directory-options">
              <button className="file-directory-button">Recent</button>
              <button className="file-directory-button">Citrus Drive</button>
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
                  if (file.type === "folder") {
                    return <FolderButton
                      key={file.name}
                      imageSrc="/images/folder.png"
                      folderName={file.name}
                      currentPath={currentPath}
                      setCurrentPath={setCurrentPath}
                      setFilteredFiles={setFilteredFiles}
                    />
                  }
                  return null;
                })}
              </div>
            </div>
            <div className="file-explorer-files">
              {filteredFiles.map((file) => {
                if (file.type !== "folder") {
                  return <FileButton
                    key={file.name}
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

export default FileBrowser;