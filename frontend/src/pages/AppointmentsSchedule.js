import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Calendar, Clock, User, FileText, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const AppointmentsSchedule = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '09:00',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const dateInputRef = useRef(null);

    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');

    useEffect(() => {
        if (!userId || userType !== 'patient') {
            navigate('/patient/login');
            return;
        }
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/doctor');
            setDoctors(res.data);
        } catch (err) {
            setError('Failed to load doctors list.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'doctorId') {
            const doctor = doctors.find((item) => String(item.id) === String(value));
            setSelectedDoctor(doctor || null);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.doctorId || !formData.appointmentDate || !formData.appointmentTime || !formData.reason.trim()) {
            setError('Please complete all fields before booking your appointment.');
            setLoading(false);
            return;
        }

        try {
            const appointmentData = {
                ...formData,
                reason: formData.reason.trim(),
                patientId: Number(userId),
                doctorId: parseInt(formData.doctorId, 10)
            };
            await api.post('/appointment', appointmentData);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to book appointment. Please check your data.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl text-center max-w-md shadow-2xl">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                    <p className="text-slate-400">Your appointment has been successfully scheduled. Redirecting you to your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-2xl mx-auto">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <Calendar className="w-7 h-7" />
                            Schedule Appointment
                        </h1>
                        <p className="text-blue-100 mt-2 opacity-80">Choose a specialist, select a future time, and share the reason for your visit.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </div>
                        )}

                        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
                            <div className="text-sm text-slate-300">
                                <p className="font-medium text-white">Fast, guided booking</p>
                                <p className="mt-1">Pick a doctor, choose a date at least one day in the future, and add a short reason so the clinic can prepare.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Select Specialist</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                                    <select
                                        name="doctorId"
                                        value={formData.doctorId}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                                        required
                                    >
                                        <option value="">Choose a Doctor</option>
                                        {doctors.map(doc => (
                                            <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialization}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Appointment Date</label>
                                <div
                                className="relative cursor-pointer"
                                onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.focus()}
                            >
                                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                                    <input
                                        ref={dateInputRef}
                                        type="date"
                                        name="appointmentDate"
                                        value={formData.appointmentDate}
                                        onChange={handleChange}
                                        min={today}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Preferred Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                                    <input
                                        type="time"
                                        name="appointmentTime"
                                        value={formData.appointmentTime}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {selectedDoctor && (
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                <p className="text-sm font-medium text-slate-300">Selected specialist</p>
                                <p className="text-white font-semibold mt-1">{selectedDoctor.name}</p>
                                <p className="text-slate-400 text-sm">{selectedDoctor.specialization}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Reason for Visit</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Briefly describe your symptoms or concern..."
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Processing...' : 'Confirm Appointment'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppointmentsSchedule;
