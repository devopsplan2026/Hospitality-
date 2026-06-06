import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
    Users, 
    UserPlus, 
    Calendar, 
    Activity, 
    LogOut, 
    Search,
    ShieldCheck,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        patients: 0,
        doctors: 0,
        appointments: 0
    });
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('appointments');

    useEffect(() => {
        const userType = localStorage.getItem('userType');
        if (userType !== 'admin') {
            navigate('/admin/login');
            return;
        }
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [aptRes, docRes, patRes] = await Promise.all([
                api.get('/appointment'),
                api.get('/doctor'),
                api.get('/patient')
            ]);
            
            setAppointments(aptRes.data);
            setDoctors(docRes.data);
            setPatients(patRes.data);
            setStats({
                appointments: aptRes.data.length,
                doctors: docRes.data.length,
                patients: patRes.data.length
            });
        } catch (err) {
            console.error('Failed to load admin data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/admin/login');
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white">Admin Central</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-all text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <span className="text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-full">Total</span>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">System Patients</h3>
                        <p className="text-3xl font-bold mt-1">{stats.patients}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                                <UserPlus className="w-6 h-6 text-purple-400" />
                            </div>
                            <span className="text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-full">Total</span>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">Registered Doctors</h3>
                        <p className="text-3xl font-bold mt-1">{stats.doctors}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-indigo-400" />
                            </div>
                            <span className="text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-full">Total</span>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">All Time Appointments</h3>
                        <p className="text-3xl font-bold mt-1">{stats.appointments}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 mb-6 gap-8">
                    <button 
                        onClick={() => setActiveTab('appointments')}
                        className={`pb-4 px-2 text-sm font-medium transition-all relative ${activeTab === 'appointments' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Appointments
                        {activeTab === 'appointments' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-t-full" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('doctors')}
                        className={`pb-4 px-2 text-sm font-medium transition-all relative ${activeTab === 'doctors' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Doctors
                        {activeTab === 'doctors' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-t-full" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('patients')}
                        className={`pb-4 px-2 text-sm font-medium transition-all relative ${activeTab === 'patients' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Patients
                        {activeTab === 'patients' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-t-full" />}
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    {loading ? (
                        <div className="p-20 text-center text-slate-500">
                            <Activity className="w-10 h-10 animate-pulse mx-auto mb-4 text-indigo-500" />
                            Loading system data...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {activeTab === 'appointments' && (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-950 border-b border-slate-800">
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Doctor</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date & Time</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {appointments.map((apt) => (
                                            <tr key={apt.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-200">#{apt.patientId}</td>
                                                <td className="px-6 py-4 text-slate-400">Doctor #{apt.doctorId}</td>
                                                <td className="px-6 py-4 text-slate-400 text-sm">
                                                    {apt.appointmentDate} <span className="text-slate-600 ml-1">{apt.appointmentTime}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusClass(apt.status)}`}>
                                                        {apt.status || 'pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'doctors' && (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-950 border-b border-slate-800">
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Specialization</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {doctors.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-200">{doc.name}</td>
                                                <td className="px-6 py-4 text-slate-400">{doc.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs">
                                                        {doc.specialization}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'patients' && (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-950 border-b border-slate-800">
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {patients.map((pat) => (
                                            <tr key={pat.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-200">{pat.name}</td>
                                                <td className="px-6 py-4 text-slate-400">{pat.email}</td>
                                                <td className="px-6 py-4 text-slate-400">{pat.phone || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
