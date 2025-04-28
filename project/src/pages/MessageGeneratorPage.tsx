
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Copy } from 'lucide-react';

interface MessageEntry {
  _id: string;
  name: string;
  company: string;
  message: string;
}

const LinkedInMessageForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    job_title: '',
    company: '',
    location: '',
    summary: '',
  });

  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/personalized-message', formData);
      setGeneratedMessage(response.data.message); // Show generated message
      await fetchMessages(); // Refresh messages
      setFormData({ name: '', job_title: '', company: '', location: '', summary: '' });
    } catch (error) {
      console.error('Error generating message', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4 sm:p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* Form + Generated Message Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Form Section */}
        <div className="border p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-bold mb-4">Generate LinkedIn Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {['name', 'job_title', 'company', 'location'].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                value={(formData as never)[field]}
                onChange={handleChange}
                placeholder={field.replace('_', ' ')}
                className="w-full px-3 py-2 border rounded text-sm"
                required
              />
            ))}
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Summary"
              className="w-full px-3 py-2 border rounded text-sm"
              rows={4}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Generate Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Generated Message Section */}
        <div className="border p-6 rounded-lg shadow-md bg-white flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Generated Message</h2>

          {generatedMessage ? (
            <div className="flex-1 overflow-y-auto">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                <p className="whitespace-pre-line text-gray-800 text-sm">{generatedMessage}</p>
              </div>
              <button
                onClick={() => handleCopy(generatedMessage)}
                className="btn-secondary flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No message generated yet.</p>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="border p-6 rounded-lg shadow-md bg-white overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">All Generated Messages</h2>

        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm">No messages generated yet.</p>
        ) : (
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Company</th>
                <th className="px-4 py-2 border">Message</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className="text-center hover:bg-gray-50">
                  <td className="px-4 py-2 border">{msg.name}</td>
                  <td className="px-4 py-2 border">{msg.company}</td>
                  <td className="px-4 py-2 border text-left">{msg.message}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleCopy(msg.message)}
                      className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LinkedInMessageForm;
