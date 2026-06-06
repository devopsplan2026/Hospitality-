import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

const PatientRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        age: '',
        gender: 'M',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/patient/register', formData);
            if (response.data.success) {
                navigate('/patient/login');
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Registration failed. Email might already be taken.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 py-12">
            <div className="w-full max-w-lg bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <Activity className="text-blue-500 w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bold text-white text-center mb-8">Create Account</h2>

                    <form onSubmit={handleRegister} className="space-y-4">
                        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm">{error}</div>}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Full Name</label>
                                <input name="name" required className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded-lg" onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Email</label>
                                <input name="email" type="email" required className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded-lg" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Password</label>
                                <input name="password" type="password" required className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded-lg" onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Phone</label>
                                <input name="phone" className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded-lg" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Age</label>
                                <input name="age" type="number" className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded-lg" onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Gender</label>
                                <select name="gender" className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded-lg" onChange={handleChange}>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-400">Address</label>
                            <textarea name="address" className="w-full bg-slate-800 border border-slate-700 text-white p-2 rounded-lg h-20" onChange={handleChange}></textarea>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-70">
                            {loading ? 'Processing...' : 'Register Account'}
                        </button>

                        <p className="text-center text-slate-500 text-sm">
                            Already have an account?{' '}
                            <a href="/patient/login" className="text-blue-400 hover:text-blue-300 transition-colors">Login here</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientRegister;
