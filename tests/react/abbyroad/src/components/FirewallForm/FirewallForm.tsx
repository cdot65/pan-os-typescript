// src/components/FirewallForm/FirewallForm.tsx
import React, { ChangeEvent, FormEvent, useState } from 'react';

const FirewallForm = () => {
    // State for form fields
    const [panoramaURL, setPanoramaURL] = useState<string>('');
    const [useCredentials, setUseCredentials] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value, checked } = e.target;

        switch (id) {
            case 'panoramaURL':
                setPanoramaURL(value);
                break;
            case 'useCredentials':
                setUseCredentials(checked);
                break;
            case 'username':
                setUsername(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          // Make request to your new proxy API endpoint
          const response = await fetch(`/api/generateApiKey?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&panoramaURL=${encodeURIComponent(panoramaURL)}`);
          const data = await response.json();
          if (data.apiKey) {
            setGeneratedApiKey(data.apiKey); // Update the state with the API key
          } else {
            throw new Error('API key not received');
          }
        } catch (error) {
          console.error('Error generating API key:', error);
          setGeneratedApiKey(null);
        }
    };

    const [isKeyRevealed, setIsKeyRevealed] = useState(false);

    // Function to copy API key to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedApiKey ?? '');
        // Optionally, provide feedback to the user that the text has been copied
    };

    // Function to toggle key reveal
    const toggleReveal = () => {
        setIsKeyRevealed(!isKeyRevealed);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/10 p-6 rounded-lg shadow-md">
            <h2 className="text-xl text-white font-bold mb-4">API Key Generator</h2>
            <div className="mb-4">
                <label htmlFor="panoramaURL" className="block text-white text-sm font-bold mb-2">Panorama URL:</label>
                <input
                    type="text"
                    id="panoramaURL"
                    value={panoramaURL}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="useCredentials" className="block text-white text-sm font-bold mb-2">Username/Password:</label>
                <input
                    type="checkbox"
                    id="useCredentials"
                    checked={useCredentials}
                    onChange={handleChange}
                    className="leading-tight"
                />
            </div>
            {useCredentials && (
                <>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-white text-sm font-bold mb-2">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-white text-sm font-bold mb-2">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </>
            )}
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Generate API Key
            </button>
            {generatedApiKey && (
                <div className="mt-4 bg-green-200 p-4 rounded-md">
                    <h3 className="text-lg font-bold">Generated API Key:</h3>
                    <p>{isKeyRevealed ? generatedApiKey : `${generatedApiKey.substring(0, 30)}......`}</p>
                    <button type="button" onClick={toggleReveal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2">
                        {isKeyRevealed ? 'Hide' : 'Reveal All'}
                    </button>
                    <button type="button" onClick={copyToClipboard} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                        Copy to Clipboard
                    </button>
                </div>
            )}
        </form>
    );
};

export default FirewallForm;