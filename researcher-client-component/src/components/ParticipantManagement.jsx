import { useState } from 'react';

function ParticipantManagement() {
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    email: '',
    surveyId: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddParticipant = (e) => {
    e.preventDefault();
    if (newParticipant.name && newParticipant.email) {
      setParticipants(prev => [...prev, {
        ...newParticipant,
        id: Date.now(),
        status: 'Pending',
        dateAdded: new Date().toISOString()
      }]);
      setNewParticipant({ name: '', email: '', surveyId: '' });
    }
  };

  const handleDeleteParticipant = (id) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setParticipants(prev =>
      prev.map(p => p.id === id ? { ...p, status: newStatus } : p)
    );
  };

  const filteredParticipants = participants.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="participant-management">
      <h2>Manage Participants</h2>
      
      <div className="search-section">
        <input
          type="text"
          placeholder="Search participants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="add-participant-section">
        <h3>Add New Participant</h3>
        <form onSubmit={handleAddParticipant}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              value={newParticipant.name}
              onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={newParticipant.email}
              onChange={(e) => setNewParticipant(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <select
              value={newParticipant.surveyId}
              onChange={(e) => setNewParticipant(prev => ({ ...prev, surveyId: e.target.value }))}
              required
            >
              <option value="">Select Survey</option>
              {/* TODO: Add survey options from API */}
            </select>
          </div>
          <button type="submit">Add Participant</button>
        </form>
      </div>

      <div className="participants-list">
        <h3>Participants List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Survey</th>
              <th>Status</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.map(participant => (
              <tr key={participant.id}>
                <td>{participant.name}</td>
                <td>{participant.email}</td>
                <td>{participant.surveyId}</td>
                <td>
                  <select
                    value={participant.status}
                    onChange={(e) => handleStatusChange(participant.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Declined">Declined</option>
                  </select>
                </td>
                <td>{new Date(participant.dateAdded).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDeleteParticipant(participant.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ParticipantManagement; 