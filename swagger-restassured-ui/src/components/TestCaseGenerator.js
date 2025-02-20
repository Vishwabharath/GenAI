// src/components/GenerateCodePage.js
import React, { useState, useRef } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/mode-java';
import PushCodeModal from './PushCodeModal';

function GenerateTestCasesPage() {
  const [apiDetails, setApiDetails] = useState('');
  const [testCases, setTestCases] = useState('');
  const [testTypes, setTestTypes] = useState({
    positive: false,
    negative: false,
    edge: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle checkbox changes
  const handleTestTypeChange = (e) => {
    const { name, checked } = e.target;
    setTestTypes((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // 1. Generate Test cases
  async function handleGenerateTests() {
    if (!apiDetails.trim()) {
      alert('No user story found. Please paste your user story below...');
      return;
    }
    setIsLoading(true);
    try {
      const selectedTestTypes = Object.keys(testTypes).filter((key) => testTypes[key]);
      const requestBody = { apiDetails, testTypes: selectedTestTypes };
      const response = await fetch('http://localhost:8080/api/generateTestCases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        let errMsg = await response.text();
        alert('Generate Tests failed: ' + errMsg);
        return;
      }
      const code = await response.text();
      setTestCases(code);
    } catch (err) {
      console.error(err);
      alert('Error generating tests: ' + err);
    } finally {
      setIsLoading(false);
    }
  }


  // 2. Reset
  function handleReset() {
    setTestCases('');
    setTestTypes({
      positive: false,
      negative: false,
      edge: false,
    });
  }

  return (
    <div className="main-content">
       <h2>Testcase Generator</h2>
       <p>Paste your user story below to generate test cases</p>

      <div className="section">
        <h4>User Story Input:</h4>
        <textarea
          rows="5"
          style={{ width: '100%' }}
          value={apiDetails}
          onChange={(e) => setApiDetails(e.target.value)}
        />
        <br /><br />
        <h4>Test Type: </h4>
        <div className="test-type-container">
          <label className="test-type-label">
            <input
              type="checkbox"
              name="positive"
              checked={testTypes.positive}
              onChange={handleTestTypeChange}
            />
            Positive
          </label>
          <label className="test-type-label">
            <input
              type="checkbox"
              name="negative"
              checked={testTypes.negative}
              onChange={handleTestTypeChange}
            />
            Negative
          </label>
          <label className="test-type-label">
            <input
              type="checkbox"
              name="edge"
              checked={testTypes.edge}
              onChange={handleTestTypeChange}
            />
            Edge
          </label>
        </div>
        <br />
        <button onClick={handleGenerateTests} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      {isLoading && <div className="loading-spinner"></div>}
      <div className="section">
        <h4>Generated Test Cases:</h4>
        <div className="code-editor">
          <AceEditor
            mode="java"
            theme="textmate"
            name="javaEditor"
            width="100%"
            height="300px"
            fontSize={14}
            value={testCases}
            onChange={(newValue) => setTestCases(newValue)}
            editorProps={{ $blockScrolling: true }}
            setOptions={{ useWorker: false }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleReset} style={{ marginLeft: '10px' }}>
            Reset
          </button>
        </div>
      </div>

    </div>
  );
}

export default GenerateTestCasesPage;
