import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const NotesContent = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const canvasRefs = useRef([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notesQuery = query(collection(db, 'uploads'), where('category', '==', 'notes'));
        const notesSnapshot = await getDocs(notesQuery);
        const notesList = notesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotes(notesList);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch notes: ' + err.message);
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const renderPDFPage = async (pdfURL, canvasRef, index) => {
    if (!canvasRef) return;

    try {
      const loadingTask = pdfjs.getDocument(pdfURL);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      
      const canvas = canvasRef;
      const context = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
    } catch (error) {
      console.error(`Error rendering PDF page for note ${index}:`, error);
      const canvas = canvasRef;
      const context = canvas.getContext('2d');
      context.fillStyle = 'rgba(255, 0, 0, 0.1)';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    notes.forEach((note, index) => {
      if (canvasRefs.current[index]) {
        renderPDFPage(note.fileURL, canvasRefs.current[index], index);
      }
    });
  }, [notes]);

  const handleDownload = (fileURL) => {
    window.open(fileURL, '_blank');
  };

  const handleView = (fileURL) => {
    setSelectedPdf(fileURL);
    setPageNumber(1);
    setScale(1.0);
  };

  const closeModal = () => {
    setSelectedPdf(null);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const zoomIn = () => setScale(prevScale => Math.min(2, prevScale + 0.1));
  const zoomOut = () => setScale(prevScale => Math.max(0.5, prevScale - 0.1));

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note, index) => (
          <div key={note.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 flex items-center justify-center bg-gray-700">
              <canvas 
                ref={el => canvasRefs.current[index] = el} 
                className="max-w-full max-h-full object-contain"
              ></canvas>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">{note.description}</h3>
              <div className="flex items-center justify-between text-gray-400 text-sm">
                <span>{note.fileType || 'PDF'}</span>
                <span>{note.fileSize || '99 KB'}</span>
                <button 
                  onClick={() => handleView(note.fileURL)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button 
                  onClick={() => handleDownload(note.fileURL)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <DownloadIcon />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-11/12 h-5/6 overflow-hidden flex flex-col">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">PDF Viewer</h2>
              <button onClick={closeModal} className="text-2xl">&times;</button>
            </div>
            <div className="flex justify-center mb-4">
              <button onClick={previousPage} disabled={pageNumber <= 1} className="mx-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300">Previous</button>
              <button onClick={nextPage} disabled={pageNumber >= numPages} className="mx-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300">Next</button>
              <button onClick={zoomIn} className="mx-2 px-4 py-2 bg-green-500 text-white rounded">Zoom In</button>
              <button onClick={zoomOut} className="mx-2 px-4 py-2 bg-green-500 text-white rounded">Zoom Out</button>
            </div>
            <p className="text-center mb-4">
              Page {pageNumber} of {numPages}
            </p>
            <div className="flex-grow overflow-auto">
              <Document
                file={selectedPdf}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex justify-center"
              >
                <Page pageNumber={pageNumber} scale={scale} />
              </Document>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesContent;