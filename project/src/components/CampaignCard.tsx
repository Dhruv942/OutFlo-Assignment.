import { Campaign } from '../types/Campaign';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export const CampaignCard = ({ campaign, onEdit, onDelete, onToggleStatus }: CampaignCardProps) => {
  const { name, description, status, leads, accountIDs } = campaign;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{name}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        
        <div className="space-y-2 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Leads: {leads.length}</p>
            <div className="text-xs text-gray-400 line-clamp-1">
              {leads.join(', ')}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Account IDs: {accountIDs.length}</p>
            <div className="text-xs text-gray-400 line-clamp-1">
              {accountIDs.join(', ')}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
          
          <button
            onClick={onToggleStatus}
            className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${status === 'active' ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
          >
            {status === 'active' ? (
              <>
                <ToggleRight className="w-4 h-4 mr-1" />
                Active
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 mr-1" />
                Inactive
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};