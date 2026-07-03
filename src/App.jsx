import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

export default function App() {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({ make: '', model: '', power: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    document.title = "f1rst";
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
      <div className="max-w-6xl mx-auto p-8 font-mono">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-12 text-zinc-900 dark:text-zinc-50 text-center">
          f1rst
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 text-center">
              {editingId ? "Edit Vehicle" : "New Vehicle"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-zinc-50 dark:bg-zinc-900/50 p-6 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
              <Input
                  type="text"
                  name="make"
                  placeholder="Brand"
                  value={formData.make}
                  onChange={handleChange}
                  required
                  className="border-zinc-300 dark:border-zinc-700"
              />
              <Input
                  type="text"
                  name="model"
                  placeholder="Model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="border-zinc-300 dark:border-zinc-700"
              />
              <Input
                  type="number"
                  name="power"
                  placeholder="Cylinder count"
                  value={formData.power}
                  onChange={handleChange}
                  required
                  className="border-zinc-300 dark:border-zinc-700"
              />

              <div className="flex flex-col gap-3 mt-4">
                <Button type="submit" className="w-full font-bold uppercase tracking-wider">
                  {editingId ? "Update" : "Add"}
                </Button>
                {editingId && (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full uppercase tracking-wider border-2"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({ make: '', model: '', power: '' });
                        }}
                    >
                      Cancel
                    </Button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: Table */}
          <div className="lg:col-span-8 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 text-center">
              vehicle manager
            </h2>

            {cars.length === 0 ? (
                <div className="p-8 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-400 text-sm uppercase tracking-wider rounded-xl text-center">
                  No inventory detected.
                </div>
            ) : (
                <div className="border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded-xl overflow-hidden shadow-sm">
                  <div className="max-h-[600px] overflow-y-auto">
                    <Table>
                      <TableHeader className="bg-zinc-100 dark:bg-zinc-900 border-b-2 border-zinc-300 dark:border-zinc-700 sticky top-0 z-10">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400">Make</TableHead>
                          <TableHead className="uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400">Model</TableHead>
                          <TableHead className="uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400">Cylinders</TableHead>
                          <TableHead className="text-right uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cars.map((car) => (
                            <TableRow key={car.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                              <TableCell className="font-medium">{car.make}</TableCell>
                              <TableCell>{car.model}</TableCell>
                              <TableCell>{car.power}</TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                    onClick={() => handleEdit(car)}
                                    title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                    onClick={() => handleDelete(car.id)}
                                    title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}