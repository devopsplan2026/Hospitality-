import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Activity, Calendar, User, LogOut, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userType = localStorage.getItem('userType');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!userId || !userType) {
            navigate('/patient/login');
            return;
        }
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load appointments based on user type
            if (userType === 'patient') {
                const [apptRes, docRes] = await Promise.all([
                    api.get(`/appointment/patient/${userId}`),
                    api.get('/doctor')
                ]);
                setAppointments(apptRes.data);
                setDoctors(docRes.data);
            } else if (userType === 'doctor') {
                const [apptRes, patRes] = await Promise.all([
                    api.get(`/appointment/doctor/${userId}`),
                    api.get('/patient')
                ]);
                setAppointments(apptRes.data);
                setPatients(patRes.data);
            }
        } catch (err) {
            setError('Failed to load data. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/patient/login');
    };

    const updateStatus = async (appointmentId, newStatus) => {
        try {
            await api.put(`/appointment/${appointmentId}/status`, { status: newStatus });
            loadData(); // Refresh list
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'cancelled': return <XCircle className="w-4 h-4 text-red-400" />;
            default: return <AlertCircle className="w-4 h-4 text-yellow-400" />;
        }
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    const getDoctorName = (doctorId) => {
        const doc = doctors.find(d => d.id === doctorId);
        return doc ? doc.name : `Doctor #${doctorId}`;
    };

    const getPatientName = (patientId) => {
        const pat = patients.find(p => p.id === patientId);
        return pat ? pat.name : `Patient #${patientId}`;
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white">MediCare</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-sm capitalize">{userType} Portal</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-all text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Welcome banner */}
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">
                            Welcome back{userType === 'doctor' ? ', Doctor' : ''}!
                        </h1>
                        <p className="text-slate-400">Here's an overview of your appointments.</p>
                    </div>
                    {userType === 'patient' && (
                        <button
                            onClick={() => navigate('/appointments/schedule')}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            Book New Appointment
                        </button>
                    )}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            <span className="text-slate-400 text-sm">Total</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{appointments.length}</p>
                        <p className="text-slate-500 text-xs mt-1">Appointments</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="text-slate-400 text-sm">Confirmed</span>
                        </div>
                        <p className="text-3xl font-bold text-white">
                            {appointments.filter(a => a.status?.toLowerCase() === 'confirmed').length}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">Appointments</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-5 h-5 text-yellow-400" />
                            <span className="text-slate-400 text-sm">Pending</span>
                        </div>
                        <p className="text-3xl font-bold text-white">
                            {appointments.filter(a => a.status?.toLowerCase() === 'pending').length}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">Appointments</p>
                    </div>
                </div>

                {/* Appointments list */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <h2 className="text-lg font-semibold text-white">Your Appointments</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-500">Loading appointments...</div>
                    ) : error ? (
                        <div className="p-12 text-center text-red-400">{error}</div>
                    ) : appointments.length === 0 ? (
                        <div className="p-12 text-center">
                            <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                            <p className="text-slate-500">No appointments found.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {appointments.map((apt) => (
                                <div key={apt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-800/30 transition-colors gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/20 rounded-xl flex items-center justify-center">
                                            <User className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">
                                                {userType === 'patient'
                                                    ? getDoctorName(apt.doctorId)
                                                    : getPatientName(apt.patientId)}
                                            </p>
                                            <p className="text-slate-500 text-sm">
                                                {apt.appointmentDate} at {apt.appointmentTime}
                                            </p>
                                            {apt.reason && (
                                                <p className="text-slate-600 text-xs mt-0.5">{apt.reason}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium capitalize ${getStatusClass(apt.status)}`}>
                                            {getStatusIcon(apt.status)}
                                            {apt.status || 'pending'}
                                        </div>

                                        {userType === 'doctor' && apt.status?.toLowerCase() === 'pending' && (
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => updateStatus(apt.id, 'confirmed')}
                                                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg transition-all"
                                                    title="Confirm Appointment"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(apt.id, 'cancelled')}
                                                    className="bg-red-600 hover:bg-red-500 text-white p-1.5 rounded-lg transition-all"
                                                    title="Cancel Appointment"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
