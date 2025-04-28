import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Campaign, CampaignStatus } from '../types/Campaign';
import { CampaignCard } from '../components/CampaignCard';
import { CampaignForm } from '../components/CampaignForm';
import { PlusCircle, MessageSquare, AlertCircle } from 'lucide-react';

const DashboardPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/campaigns');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCampaigns(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Create
  const handleCreateCampaign = async (campaignData: Omit<Campaign, '_id'>) => {
    try {
      const response = await fetch('http://localhost:5000/api/campaigns', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchCampaigns();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating campaign');
    }
  };

  // Update
  const handleUpdateCampaign = async (campaignData: Campaign) => {
    if (!campaignData._id) {
      setError('Campaign ID missing');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${campaignData._id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchCampaigns();
      setEditingCampaign(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating campaign');
    }
  };

  // Delete
  const handleDeleteCampaign = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${id}/delete`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchCampaigns();  
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting campaign');
    }
  };

  // Toggle Status
  const handleToggleStatus = async (campaign: Campaign) => {
    const newStatus: CampaignStatus = campaign.status === 'active' ? 'inactive' : 'active';
    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${campaign._id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...campaign, status: newStatus }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchCampaigns();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating status');
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div className="animate-slideIn">
            <h1 className="text-3xl font-bold text-gray-900">Campaign Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your campaigns and track performance</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 animate-slideIn">
            <Link
              to="/generate-message"
              className="btn-primary bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 w-full sm:w-auto justify-center"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Message Generator
            </Link>
            <button
              onClick={() => {
                setEditingCampaign(null);
                setShowForm(true);
              }}
              className="btn-primary w-full sm:w-auto justify-center"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              New Campaign
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md" role="alert">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {showForm ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 animate-scaleIn">
            <CampaignForm
              onSubmit={editingCampaign ? (data) => handleUpdateCampaign({ ...data, _id: editingCampaign._id }) : handleCreateCampaign}
              onCancel={() => {
                setShowForm(false);
                setEditingCampaign(null);
              }}
              initialData={editingCampaign}
            />
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : campaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
                {campaigns.map((campaign, index) => (
                  <div key={campaign._id} className="animate-scaleIn" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CampaignCard
                      campaign={campaign}
                      onEdit={() => handleEdit(campaign)}
                      onDelete={() => handleDeleteCampaign(campaign._id)}
                      onToggleStatus={() => handleToggleStatus(campaign)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center animate-scaleIn">
                <h3 className="text-gray-500 text-lg mb-2">No campaigns found</h3>
                <p className="text-gray-400 mb-4">Get started by creating your first campaign</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Create Campaign
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
