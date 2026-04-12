import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Users, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Member {
    id: string;
    name: string;
    role: string;
}

export default function ClubManagementPage() {
    const { id } = useParams<{ id: string }>();
    const [members, setMembers] = useState<Member[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState('');

    useEffect(() => {
        if (!id) return;
        // Fetch club members
        api
            .get(`/clubs/${id}/members`)
            .then((res) => setMembers(res.data))
            .catch((err) => toast.error(err.response?.data?.message || 'Failed to load members'));
    }, [id]);

    const updateRole = (memberId: string, role: string) => {
        api
            .patch(`/clubs/${id}/members/${memberId}`, { role })
            .then(() => {
                setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role } : m)));
                toast.success('Role updated');
            })
            .catch((err) => toast.error(err.response?.data?.message || 'Failed to update role'));
    };

    const removeMember = (memberId: string) => {
        api
            .delete(`/clubs/${id}/members/${memberId}`)
            .then(() => {
                setMembers((prev) => prev.filter((m) => m.id !== memberId));
                toast.success('Member removed');
            })
            .catch((err) => toast.error(err.response?.data?.message || 'Failed to remove member'));
    };

    const addMember = () => {
        if (!newMemberEmail) return;
        api
            .post(`/clubs/${id}/members`, { email: newMemberEmail })
            .then((res) => {
                setMembers((prev) => [...prev, res.data]);
                toast.success('Member added');
                setNewMemberEmail('');
            })
            .catch((err) => toast.error(err.response?.data?.message || 'Failed to add member'));
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6" /> Club Management
            </h1>

            {/* Member List */}
            <div className="space-y-4">
                {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
                        <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={member.role}
                                onChange={(e) => updateRole(member.id, e.target.value)}
                                className="border rounded px-2 py-1"
                            >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                                <option value="moderator">Moderator</option>
                            </select>
                            <button
                                onClick={() => removeMember(member.id)}
                                className="p-2 text-red-500 hover:bg-red-100 rounded"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Member */}
            <div className="flex gap-2 items-center">
                <input
                    type="email"
                    placeholder="Member email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                />
                <button
                    onClick={addMember}
                    className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90"
                >
                    <Plus size={16} /> Add Member
                </button>
            </div>

            <Link to="/org" className="text-primary underline mt-4 inline-block">
                ← Back to Organizer Dashboard
            </Link>
        </div>
    );
}
