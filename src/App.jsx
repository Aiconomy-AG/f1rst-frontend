import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({ make: '', model: '', power: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('/cars');
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/cars/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('/cars', formData);
      }
      setFormData({ make: '', model: '', power: '' });
      fetchCars();
    } catch (error) {
      console.error("Error saving car:", error);
    }
  };

  const handleEdit = (car) => {
    setEditingId(car.id);
    setFormData({ make: car.make, model: car.model, power: car.power });
  };
  

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this car?")) {
      try {
        await axios.delete(`/cars/${id}`);
        fetchCars();
      } catch (error) {
        console.error("Error deleting car:", error);
      }
    }
  };

  return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Car Inventory</h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3>{editingId ? "Edit Car" : "Add New Car"}</h3>
          <input type="text" name="make" placeholder="Make" value={formData.make} onChange={handleChange} required />
          <input type="text" name="model" placeholder="Model" value={formData.model} onChange={handleChange} required />
          <input type="number" name="power" placeholder="Cylinder count" value={formData.power} onChange={handleChange} required />
          <button type="submit">{editingId ? "Update Car" : "Add Car"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ make: '', model: '', power: '' }); }}>Cancel</button>}
        </form>

        <h3>Current Inventory</h3>
        {cars.length === 0 ? <p>No cars found in the database.</p> : (
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
              <thead>
              <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Cylinders</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {cars.map((car) => (
                  <tr key={car.id}>
                    <td>{car.make}</td>
                    <td>{car.model}</td>
                    <td>{car.power}</td>
                    <td>
                      <button onClick={() => handleEdit(car)} style={{ marginRight: '5px' }}>Edit</button>
                      <button onClick={() => handleDelete(car.id)}>Delete</button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </div>
  );
}