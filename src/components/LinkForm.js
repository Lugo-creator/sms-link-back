import { useState } from 'react';
import axios from 'axios';


function LinkForm() {
  const [code, setCode] = useState('');
  const [staffName, setStaffName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!code) return setError('Code is required');

    try {
      const res = await axios.post('http://localhost:3001/api/generate', {
        code,
        staffName,
      });

      setGeneratedLink(res.data.link);
      setError('');
    } catch (err) {
      setError('Failed to generate link');
    }
  };

  return (
    <div className="container">
      <h1>SMS Link Generator</h1>

      <input
        type="text"
        placeholder="Enter Code (e.g., ABC123)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <input
        type="text"
        placeholder="Staff Name (optional)"
        value={staffName}
        onChange={(e) => setStaffName(e.target.value)}
      />

      <button onClick={handleGenerate}>Generate Link</button>

      {error && <p className="error">{error}</p>}

      {generatedLink && (
        <div>
          <p>Generated SMS Link:</p>
          <a href={generatedLink}>{generatedLink}</a>
        </div>
      )}
    </div>
  );
}

export default LinkForm;
