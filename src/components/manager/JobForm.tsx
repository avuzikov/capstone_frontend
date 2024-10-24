import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Job } from '../../types/types';

interface JobFormProps {
  initialJob?: Partial<Job>;
  onSubmit: (formData: Partial<Job>) => Promise<void>;
  onCancel?: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ initialJob, onSubmit, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  const [formData, setFormData] = useState<Partial<Job>>({
    department: initialJob?.department || '',
    listingTitle: initialJob?.listingTitle || '',
    jobTitle: initialJob?.jobTitle || '',
    jobDescription: initialJob?.jobDescription || '',
    listingStatus: initialJob?.listingStatus || 'open',
    experienceLevel: initialJob?.experienceLevel || '',
    additionalInformation: initialJob?.additionalInformation || '',
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit({
        ...formData,
        dateListed: initialJob?.dateListed || new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit job posting');
    } finally {
      setIsLoading(false);
    }
  };

  const markdownGuide = `
## Markdown Guide
- Use **bold** for emphasis
- Use *italic* for subtle emphasis
- Use # for headings (## for h2, ### for h3)
- Use - or * for bullet points
- Use 1. 2. 3. for numbered lists
- Use > for blockquotes
- Use \`code\` for inline code
`;

  return (
    <form onSubmit={handleSubmit} className="p-medium">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="listingTitle" className="block text-sm font-medium text-gray-700">
            Listing Title *
          </label>
          <input
            type="text"
            id="listingTitle"
            name="listingTitle"
            value={formData.listingTitle}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="input-bordered w-full mt-1"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Department *
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="input-bordered w-full mt-1"
          />
        </div>

        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
            Job Title *
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="input-bordered w-full mt-1"
          />
        </div>

        <div>
          <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
            Experience Level *
          </label>
          <input
            type="text"
            id="experienceLevel"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="input-bordered w-full mt-1"
            placeholder="e.g., 5+ years, Entry Level, Senior"
          />
        </div>

        <div>
          <label htmlFor="listingStatus" className="block text-sm font-medium text-gray-700">
            Listing Status
          </label>
          <select
            id="listingStatus"
            name="listingStatus"
            value={formData.listingStatus}
            onChange={handleChange}
            disabled={isLoading}
            className="input-bordered w-full mt-1"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
              Job Description * (Markdown supported)
            </label>
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isPreview ? 'Edit' : 'Preview'}
            </button>
          </div>

          {isPreview ? (
            <div className="prose max-w-none border rounded-md p-4 bg-white min-h-[200px]">
              <ReactMarkdown>{formData.jobDescription || ''}</ReactMarkdown>
            </div>
          ) : (
            <>
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows={8}
                className="input-bordered w-full mt-1 font-mono"
              />
              <div className="mt-2 text-sm text-gray-500">
                <ReactMarkdown className="prose max-w-none">{markdownGuide}</ReactMarkdown>
              </div>
            </>
          )}
        </div>

        <div>
          <label
            htmlFor="additionalInformation"
            className="block text-sm font-medium text-gray-700"
          >
            Additional Information (Markdown supported)
          </label>
          {isPreview ? (
            <div className="prose max-w-none border rounded-md p-4 bg-white min-h-[150px]">
              <ReactMarkdown>{formData.additionalInformation || ''}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              id="additionalInformation"
              name="additionalInformation"
              value={formData.additionalInformation}
              onChange={handleChange}
              disabled={isLoading}
              rows={4}
              className="input-bordered w-full mt-1 font-mono"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isLoading} className="btn-destructive">
            Cancel
          </button>
        )}
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Submitting...' : initialJob?.id ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
