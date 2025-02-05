import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../constans';

const TemplateScreen = () => {
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [creatingTemplate, setCreatingTemplate] = useState(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const iframeRef = useRef(null);
  const selectionRef = useRef(null);
  const isIframeEditRef = useRef(false); // Add this ref

  // Fetch templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BACKEND_URL}api/mailer/templates`);
        setTemplates(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to fetch templates. Please try again.');
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);


  const handleIframeEdit = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    const newHtml = doc.body.innerHTML;

    isIframeEditRef.current = true; // Mark as iframe-originated change
    setPreviewHtml(newHtml);
    
    if (editingTemplate) {
      setEditingTemplate(prev => ({ ...prev, template: newHtml }));
    } else if (creatingTemplate) {
      setCreatingTemplate(prev => ({ ...prev, template: newHtml }));
    }
  };

  const initializeIframe = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    // Set up editable document
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 10px;
              min-height: 100vh;
            }
          </style>
        </head>
        <body contenteditable="true">
          ${previewHtml}
        </body>
      </html>
    `);
    doc.close();

    // Add event listeners
    doc.body.addEventListener('input', handleIframeEdit);
    doc.body.addEventListener('keyup', captureSelection);
    doc.body.addEventListener('mouseup', captureSelection);
  };


  // Restore selection after updates
  const restoreSelection = () => {
    const iframe = iframeRef.current;
    if (!iframe || !selectionRef.current) return;

    const doc = iframe.contentDocument;
    const selection = doc.getSelection();
    
    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  };


  useEffect(() => {
    if (!showPreview || !iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    
    if (doc && doc.body) {
      // Skip update if change is from iframe
      if (isIframeEditRef.current) {
        isIframeEditRef.current = false;
        return;
      }
      
      captureSelection();
      doc.body.innerHTML = previewHtml;
      doc.body.contentEditable = true;
      restoreSelection();
    }
  }, [previewHtml, showPreview]);



  // Add event listener when iframe loads
  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    doc.body.contentEditable = true;
    doc.body.addEventListener('input', handleIframeEdit);
    doc.body.innerHTML = previewHtml;
  };


  // Handle edit template
  const handleEditTemplate = (template) => {
    setEditingTemplate({ ...template });
    setPreviewHtml(template.template); // Set preview HTML when editing
  };

  // Handle create template
  const handleCreateTemplate = async () => {
    if (!creatingTemplate || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    const currentHtml = doc?.body?.innerHTML || previewHtml;

    try {
      const templateToCreate = {
        ...creatingTemplate,
        template: currentHtml
      };

      const response = await axios.post(
        `${BACKEND_URL}api/mailer/templates`,
        templateToCreate
      );

      setTemplates([...templates, response.data]);
      setCreatingTemplate(null);
      setShowPreview(false);
    } catch (err) {
      console.error('Error creating template:', err);
      alert(`Failed to create template: ${err.response?.data?.message || err.message}`);
    }
  };


  // Handle update template
  const handleUpdateTemplate = async () => {
    if (!editingTemplate || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    const currentHtml = doc?.body?.innerHTML || previewHtml;

    try {
      const templateToUpdate = { 
        ...editingTemplate,
        template: currentHtml 
      };

      const response = await axios.put(
        `${BACKEND_URL}api/mailer/templates/${editingTemplate._id}`,
        templateToUpdate
      );

      setTemplates(templates.map(t => 
        t._id === editingTemplate._id ? response.data : t
      ));
      setEditingTemplate(null);
      setShowPreview(false);
    } catch (err) {
      console.error('Error updating template:', err);
      alert(`Failed to update template: ${err.response?.data?.message || err.message}`);
    }
  };



  const captureSelection = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    const doc = iframe.contentDocument;
    const selection = doc.getSelection();
    
    if (selection.rangeCount > 0) {
      selectionRef.current = selection.getRangeAt(0);
    }
  };

  


  // Handle preview toggle
  const handlePreview = () => {
    setShowPreview(!showPreview);
    // Sync preview content with current template
    const htmlContent = editingTemplate ? editingTemplate.template : creatingTemplate?.template || '';
    setPreviewHtml(htmlContent);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-gray-600">Loading templates...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="relative block w-3/4 px-10 mb-5 mt-5 text-right">
        <button
          className="text-white font-raleway px-3 py-1.5 text-sm bg-green-500 mt-5 rounded inline-block"
          onClick={() => setCreatingTemplate({ name: '', subject: '', template: '' })}
        >
          Add Template
        </button>
      </div>

      <div className="relative block md:w-full justify-center px-10 mb-5 mt-5 items-center">
        <div className="table-responsive">
          {templates.length === 0 ? (
            <p className="text-center text-gray-600">No templates found</p>
          ) : (
            <table className="mt-4 w-3/4 text-left">
              <thead>
                <tr>
                  <th className="font-lato text-white bg-green-500 text-sm p-2 font-semibold">Name</th>
                  <th className="font-lato text-white bg-green-500 text-sm p-2 font-semibold">Subject</th>
                  <th className="font-lato text-white bg-green-500 text-sm p-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr key={template._id} className="hover:bg-gray-100">
                    {editingTemplate && editingTemplate._id === template._id ? (
                      <>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={editingTemplate.name}
                            onChange={(e) =>
                              setEditingTemplate({
                                ...editingTemplate,
                                name: e.target.value,
                              })
                            }
                            className="w-full border p-1"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={editingTemplate.subject}
                            onChange={(e) =>
                              setEditingTemplate({
                                ...editingTemplate,
                                subject: e.target.value,
                              })
                            }
                            className="w-full border p-1"
                          />
                        </td>
                        <td className="border p-2">
                          <button
                            onClick={handleUpdateTemplate}
                            className="bg-green-500 text-white px-2 py-1 mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTemplate(null)}
                            className="bg-gray-500 text-white px-2 py-1"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="font-lato text-gray-600 text-sm p-2">{template.name}</td>
                        <td className="font-lato text-gray-600 text-sm p-2">{template.subject}</td>
                        <td className="font-lato text-gray-600 text-sm p-2">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleEditTemplate(template)}
                              className="bg-blue-500 text-white px-2 py-1"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {(editingTemplate || creatingTemplate) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-3/4 h-4/4 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {editingTemplate ? 'Edit Template' : 'Create Template'}
                </h2>
                <button
                  onClick={handlePreview}
                  className={`${showPreview ? 'bg-gray-500' : 'bg-yellow-500'} text-white px-4 py-2 rounded`}
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="flex gap-4 h-full">
                <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
                  <label className="block mb-2 font-medium">Template Name</label>
                  <input
                    type="text"
                    value={editingTemplate ? editingTemplate.name : creatingTemplate.name}
                    onChange={(e) => {
                      if (editingTemplate) {
                        setEditingTemplate({
                          ...editingTemplate,
                          name: e.target.value,
                        });
                      } else {
                        setCreatingTemplate({
                          ...creatingTemplate,
                          name: e.target.value,
                        });
                      }
                    }}
                    className="w-full border p-2 mb-4"
                  />

                  <label className="block mb-2 font-medium">Template Subject</label>
                  <input
                    type="text"
                    value={editingTemplate ? editingTemplate.subject : creatingTemplate.subject}
                    onChange={(e) => {
                      if (editingTemplate) {
                        setEditingTemplate({
                          ...editingTemplate,
                          subject: e.target.value,
                        });
                      } else {
                        setCreatingTemplate({
                          ...creatingTemplate,
                          subject: e.target.value,
                        });
                      }
                    }}
                    className="w-full border p-2 mb-4"
                  />

                  <label className="block mb-2 font-medium">Template HTML</label>
                  <textarea
                    value={editingTemplate ? editingTemplate.template : creatingTemplate.template}
                    onChange={(e) => {
                      const newHtml = e.target.value;
                      if (editingTemplate) {
                        setEditingTemplate({
                          ...editingTemplate,
                          template: newHtml,
                        });
                      } else {
                        setCreatingTemplate({
                          ...creatingTemplate,
                          template: newHtml,
                        });
                      }
                      setPreviewHtml(newHtml); // Update preview HTML in real-time
                    }}
                    className="w-full h-64 border p-2 mb-4"
                  />
                </div>

                {showPreview && (
    <div className="w-1/2">
      <div className="border rounded bg-gray-100 p-4 h-full overflow-auto">
        <h3 className="font-bold mb-2">Preview:</h3>
        <iframe
          ref={iframeRef}
          title="template-preview"
          onLoad={initializeIframe}
          style={{ width: '100%', height: '500px', border: 'none' }}
        />
      </div>
    </div>
  )}

              </div>
            </div>

            {/* Fixed Footer */}
            <div className="border-t p-6 bg-white">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    if (editingTemplate) {
                      setEditingTemplate(null);
                    } else {
                      setCreatingTemplate(null);
                    }
                    setShowPreview(false);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editingTemplate ? 'Save Changes' : 'Create Template'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateScreen;


