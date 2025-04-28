import { useState, useEffect } from 'react';
import { Campaign } from '../types/Campaign';

type CampaignFormData = Omit<Campaign, '_id'>;
type CampaignSubmitData = Campaign | CampaignFormData;

interface CampaignFormProps {
  initialData: Campaign | null;
  onSubmit: (data: Omit<Campaign, "_id">) => void;
  onCancel: () => void;
}

export const CampaignForm = ({ initialData, onSubmit, onCancel }: CampaignFormProps) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    status: 'active',
    leads: [],
    accountIDs: [],
  });

  const [leadsInput, setLeadsInput] = useState('');
  const [accountIDsInput, setAccountIDsInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        status: initialData.status,
        leads: initialData.leads,
        accountIDs: initialData.accountIDs,
      });

      setLeadsInput(initialData.leads.join(', '));
      setAccountIDsInput(initialData.accountIDs.join(', '));
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLeadsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLeadsInput(e.target.value);
  };

  const handleAccountIDsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAccountIDsInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const processedLeads = leadsInput
      .split(',')
      .map((lead) => lead.trim())
      .filter((lead) => lead !== '');

    const processedAccountIDs = accountIDsInput
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id !== '');

    const submissionData: CampaignSubmitData = {
      ...(initialData ? { _id: initialData._id } : {}),
      ...formData,
      leads: processedLeads,
      accountIDs: processedAccountIDs,
    } as CampaignSubmitData;

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {initialData ? 'Edit Campaign' : 'Create New Campaign'}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Campaign Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border ${
                errors.description ? 'border-red-500' : ''
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <div className="mt-1">
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="leads" className="block text-sm font-medium text-gray-700">
            Leads (LinkedIn URLs, comma-separated)
          </label>
          <div className="mt-1">
            <textarea
              id="leads"
              name="leads"
              rows={3}
              value={leadsInput}
              onChange={handleLeadsChange}
              placeholder="https://linkedin.com/in/user1, https://linkedin.com/in/user2"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Enter LinkedIn profile URLs separated by commas
          </p>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="accountIDs" className="block text-sm font-medium text-gray-700">
            Account IDs (comma-separated)
          </label>
          <div className="mt-1">
            <textarea
              id="accountIDs"
              name="accountIDs"
              rows={2}
              value={accountIDsInput}
              onChange={handleAccountIDsChange}
              placeholder="acc_123, acc_456, acc_789"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Enter account IDs separated by commas
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData ? 'Update Campaign' : 'Create Campaign'}
        </button>
      </div>
    </form>
  );
};
