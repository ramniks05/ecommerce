import { useEffect, useState } from 'react';
import { FiSearch, FiEye, FiTrash2 } from 'react-icons/fi';
import { enquiryService } from '../../services/supabaseService';

const Enquiries = () => {
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await enquiryService.getAllEnquiries({ status: statusFilter || undefined, search: search || undefined });
    setEnquiries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [statusFilter, search]);

  const handleStatusChange = async (id, status) => {
    await enquiryService.updateEnquiryStatus(id, status);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    await enquiryService.deleteEnquiry(id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Price Enquiries</h1>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, company, product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">Loading...</td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">No enquiries found</td>
                </tr>
              ) : (
                enquiries.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{new Date(e.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{e.product_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{e.name}{e.company ? ` • ${e.company}` : ''}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{e.email}{e.phone ? ` • ${e.phone}` : ''}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{e.quantity || 1}</td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={e.status}
                        onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <button
                        onClick={() => setSelected(e)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 mr-2"
                      >
                        <FiEye size={16} /> View
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-300 text-red-600 rounded hover:bg-red-50"
                      >
                        <FiTrash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">Enquiry Details</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-semibold">Product:</span> {selected.product_name}</p>
              <p><span className="font-semibold">Name:</span> {selected.name}</p>
              <p><span className="font-semibold">Email:</span> {selected.email}</p>
              {selected.phone && <p><span className="font-semibold">Phone:</span> {selected.phone}</p>}
              {selected.company && <p><span className="font-semibold">Company:</span> {selected.company}</p>}
              <p><span className="font-semibold">Quantity:</span> {selected.quantity || 1}</p>
              {selected.message && (
                <div>
                  <p className="font-semibold mb-1">Message:</p>
                  <p className="whitespace-pre-wrap border rounded p-3 bg-gray-50">{selected.message}</p>
                </div>
              )}
              <p className="text-gray-500 text-xs">Submitted: {new Date(selected.created_at).toLocaleString()}</p>
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;


