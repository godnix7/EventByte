import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CheckCircle, XCircle, Mail, Building, Clock, Edit2, ShieldAlert, Database, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    organizerStatus: string | null;
    isActive: boolean;
    collegeName?: string | null;
    createdAt: string;
    authProvider: string;
    isBanned: boolean;
    banReason?: string | null;
}

export default function AdminUsersPage() {
    const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
    const [users, setUsers] = useState<User[]>([]);
    const [pendingOrganizers, setPendingOrganizers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', role: '', isActive: true, password: '' });
    const [submittingEdit, setSubmittingEdit] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [pendingRes, allRes] = await Promise.all([
                api.get('/admin/users/pending-organizers'),
                api.get('/admin/users/all')
            ]);
            setPendingOrganizers(pendingRes.data.organizers || []);
            setUsers(allRes.data.users || []);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to fetch user data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApproval = async (id: string, action: 'approve' | 'reject') => {
        try {
            await api.patch(`/admin/users/${id}/${action}-organizer`);
            toast.success(`Organizer ${action}d successfully`);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${action} organizer`);
        }
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            password: '' // empty means no change
        });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setSubmittingEdit(true);
        try {
            // Only send password if it was typed
            const payload: any = { ...editForm };
            if (!payload.password) delete payload.password;

            await api.put(`/admin/users/${editingUser.id}/edit`, payload);
            toast.success('User updated successfully');
            setEditingUser(null);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update user');
        } finally {
            setSubmittingEdit(false);
        }
    };

    const handleBan = async (id: string, reason: string) => {
        try {
            await api.post(`/admin/users/${id}/ban`, { reason });
            toast.success('User banned successfully');
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to ban user');
        }
    };

    const handleUnban = async (id: string) => {
        try {
            await api.post(`/admin/users/${id}/unban`);
            toast.success('User unbanned successfully');
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to unban user');
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users & Approvals</h1>
                    <p className="text-muted-foreground mt-1">Manage platform users, roles, and organizer approvals.</p>
                </div>
                <div className="flex gap-3">
                    <a href="http://localhost:4983" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium border bg-card hover:bg-muted h-10 px-4 transition-colors">
                        <Database className="w-4 h-4 text-primary" />
                        Open Drizzle Studio
                    </a>
                </div>
            </div>

            <div className="flex items-center gap-4 border-b">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'pending' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    <Clock className="w-4 h-4" />
                    Pending Approvals
                    {pendingOrganizers.length > 0 && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{pendingOrganizers.length}</span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'all' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    <Search className="w-4 h-4" />
                    All Users
                </button>
            </div>

            <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-12 text-center text-muted-foreground">Loading user data...</div>
                ) : activeTab === 'pending' ? (
                    // PENDING ORGANIZERS TAB
                    pendingOrganizers.length === 0 ? (
                        <div className="p-16 text-center flex flex-col items-center">
                            <CheckCircle className="w-12 h-12 text-green-500 mb-4 opacity-50" />
                            <h3 className="text-lg font-medium">All Caught Up!</h3>
                            <p className="text-muted-foreground mt-1">There are no pending organizer requests at this time.</p>
                        </div>
                    ) : (
                        <div className="divide-y relative overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
                                    <tr>
                                        <th className="px-6 py-4">User Details</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Context</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingOrganizers.map((org) => (
                                        <tr key={org.id} className="bg-card hover:bg-muted/10 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-foreground">{org.firstName} {org.lastName}</div>
                                                <div className="text-xs text-muted-foreground">@{org.username}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {org.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    {org.collegeName ? <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {org.collegeName}</span> : <span className="text-muted-foreground italic">No organization provided</span>}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Requested on {new Date(org.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleApproval(org.id, 'approve')} className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-green-500 text-green-600 hover:bg-green-50 h-8 px-3">
                                                        <CheckCircle className="w-4 h-4 mr-1.5" /> Approve
                                                    </button>
                                                    <button onClick={() => handleApproval(org.id, 'reject')} className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-red-500 text-red-600 hover:bg-red-50 h-8 px-3">
                                                        <XCircle className="w-4 h-4 mr-1.5" /> Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    // ALL USERS TAB
                    <div className="divide-y relative overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="bg-card hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">{u.firstName} {u.lastName}</div>
                                            <div className="text-xs text-muted-foreground">{u.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="capitalize font-medium text-foreground">{u.role.replace('_', ' ')}</span>
                                            {u.role === 'organizer' && (
                                                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${u.organizerStatus === 'approved' ? 'bg-green-100 text-green-700' : u.organizerStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                    {u.organizerStatus}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.isBanned ? (
                                                <span className="inline-flex items-center gap-1.5 text-red-600 text-xs font-bold bg-red-100 px-2.5 py-1 rounded-full"><ShieldAlert className="w-3 h-3" /> Banned</span>
                                            ) : u.isActive ? (
                                                <span className="inline-flex items-center gap-1.5 text-green-600 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-green-600"></div> Active</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs font-medium"><div className="w-2 h-2 rounded-full bg-muted-foreground/50"></div> Deactivated</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => openEditModal(u)} className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-muted h-8 w-8 text-muted-foreground hover:text-foreground">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* EDIT USER MODAL */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <div className="bg-card w-full max-w-md rounded-xl border shadow-xl flex flex-col overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between bg-muted/30">
                            <div>
                                <h3 className="text-lg font-bold">Edit User</h3>
                                <p className="text-sm text-muted-foreground">Modifying @{editingUser.username}</p>
                            </div>
                            <button onClick={() => setEditingUser(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">First Name</label>
                                    <input type="text" value={editForm.firstName} onChange={e => setEditForm({ ...editForm, firstName: e.target.value })} className="w-full text-sm border rounded-md px-3 py-2 bg-transparent focus:ring-1 outline-none" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">Last Name</label>
                                    <input type="text" value={editForm.lastName} onChange={e => setEditForm({ ...editForm, lastName: e.target.value })} className="w-full text-sm border rounded-md px-3 py-2 bg-transparent focus:ring-1 outline-none" required />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground uppercase">Email Address</label>
                                <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full text-sm border rounded-md px-3 py-2 bg-transparent focus:ring-1 outline-none" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">Role</label>
                                    <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className="w-full text-sm border rounded-md px-3 py-2 bg-transparent focus:ring-1 outline-none">
                                        <option value="participant">Participant</option>
                                        <option value="organizer">Organizer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-1 flex flex-col justify-end pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={editForm.isActive} onChange={e => setEditForm({ ...editForm, isActive: e.target.checked })} className="rounded text-primary focus:ring-1 accent-primary" />
                                        <span className="text-sm font-medium">Account Active</span>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-2 p-4 rounded-lg border border-destructive/20 bg-destructive/5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                                        <ShieldAlert className="w-4 h-4" /> Moderation
                                    </div>
                                    {editingUser.isBanned ? (
                                        <button
                                            type="button"
                                            onClick={() => { handleUnban(editingUser.id); setEditingUser(null); }}
                                            className="text-[10px] font-black uppercase text-green-600 hover:underline"
                                        >
                                            Unban User
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const reason = prompt('Enter ban reason:');
                                                if (reason) { handleBan(editingUser.id, reason); setEditingUser(null); }
                                            }}
                                            className="text-[10px] font-black uppercase text-red-600 hover:underline"
                                        >
                                            Ban User
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">Force Password Reset</label>
                                    <input
                                        type="password"
                                        placeholder="Leave blank to keep current password"
                                        value={editForm.password}
                                        onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                                        className="w-full text-sm border rounded-md px-3 py-2 bg-transparent focus:ring-1 outline-none"
                                        disabled={editingUser.authProvider === 'google'}
                                    />
                                    {editingUser.authProvider === 'google' && (
                                        <p className="text-[10px] text-muted-foreground mt-1">Cannot reset password for Google SSO users.</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t mt-4">
                                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submittingEdit} className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                                    {submittingEdit ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
