import { useParams } from 'react-router-dom';
import { useEventRoles, useCreateEventRole, useUpdateEventRole, useDeleteEventRole, useEventStaff, useAddStaffMember, useRemoveStaffMember } from '@/hooks/useRoles';
import { useEvent } from '@/hooks/useEvents';
import { appConfig } from '@/config/app.config';
import { Plus, Users, Shield, Trash2, Edit2, Scale } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JudgesManager from '@/components/events/org/JudgesManager';
import { InteractiveTeamCard } from '@/components/shared/InteractiveTeamCard';

const AVAILABLE_PERMISSIONS = [
    { id: 'MANAGE_EVENT', label: 'Manage Event Details', description: 'Can edit title, description, and settings' },
    { id: 'MANAGE_ROLES', label: 'Manage Roles', description: 'Can create and edit staff roles' },
    { id: 'MANAGE_STAFF', label: 'Manage Staff', description: 'Can add or remove team members' },
    { id: 'CHECK_IN_PARTICIPANTS', label: 'Check-in Participants', description: 'Can verify tickets and check-in attendees' },
    { id: 'MANAGE_SUBMISSIONS', label: 'Manage Submissions', description: 'Can view and moderate project submissions' },
    { id: 'JUDGE_SUBMISSIONS', label: 'Judge Submissions', description: 'Can score and rank submissions' },
];

export default function ManageTeamPage() {
    const { id: eventId } = useParams<{ id: string }>();
    const { data: event } = useEvent(eventId!);
    const { data: roles, isLoading: rolesLoading } = useEventRoles(eventId!);
    const { data: staff, isLoading: staffLoading } = useEventStaff(eventId!);

    const [activeTab, setActiveTab] = useState<'staff' | 'roles' | 'judges'>('staff');
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

    // Add member state
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

    // Role modal state
    const [editingRole, setEditingRole] = useState<any>(null);

    const addStaffMutation = useAddStaffMember(eventId!);
    const removeStaffMutation = useRemoveStaffMember(eventId!);
    const createRoleMutation = useCreateEventRole(eventId!);
    const updateRoleMutation = useUpdateEventRole(eventId!);
    const deleteRoleMutation = useDeleteEventRole(eventId!);

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemberEmail) return;

        await addStaffMutation.mutateAsync({
            emailOrUsername: newMemberEmail,
            roleIds: selectedRoleIds
        });

        setNewMemberEmail('');
        setSelectedRoleIds([]);
        setIsAddMemberModalOpen(false);
    };

    const handleSaveRole = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const color = formData.get('color') as string;
        const permissions = AVAILABLE_PERMISSIONS
            .filter(p => formData.get(`permission_${p.id}`) === 'on')
            .map(p => p.id);

        const payload = { name, color, permissions };

        if (editingRole) {
            await updateRoleMutation.mutateAsync({ roleId: editingRole.id, data: payload });
        } else {
            await createRoleMutation.mutateAsync({ ...payload, order: roles?.length || 0 });
        }

        setIsRoleModalOpen(false);
        setEditingRole(null);
    };

    if (rolesLoading || staffLoading) return <div className="p-8 text-center text-muted-foreground">Loading team data...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-1">Manage Team</h1>
                    <p className="text-muted-foreground">Define roles and manage staff for <span className="font-semibold text-foreground">{event?.title}</span></p>
                </div>

                <div className="flex p-1 bg-muted rounded-xl gap-1">
                    <button
                        onClick={() => setActiveTab('staff')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'staff' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
                    >
                        <Users size={16} />
                        Staff List
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'roles' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
                    >
                        <Shield size={16} />
                        Roles
                    </button>
                    <button
                        onClick={() => setActiveTab('judges')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'judges' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
                    >
                        <Scale size={16} />
                        Judges
                    </button>
                </div>
            </div>

            {activeTab === 'judges' && (
                <div className="space-y-6">
                    <JudgesManager eventId={eventId!} />
                </div>
            )}

            {activeTab === 'staff' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-black tracking-tight">Event Force</h2>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">({staff?.length || 0}) Active Personnel</p>
                        </div>
                        <button
                            onClick={() => setIsAddMemberModalOpen(true)}
                            className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black text-white shadow-2xl transition-all hover:scale-105 active:scale-95 overflow-hidden"
                            style={{ backgroundColor: appConfig.primaryColor }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Plus size={20} className="relative z-10" />
                            <span className="relative z-10">Expand Team</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {staff?.map((member: any) => (
                            <motion.div
                                key={member.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <InteractiveTeamCard
                                    name={`${member.user.firstName} ${member.user.lastName}`}
                                    role={member.roleIds.map((rid: string) => roles?.find((r: any) => r.id === rid)?.name).join(', ') || 'Staff Member'}
                                    image={member.user.profilePhotoUrl}
                                    initials={member.user.firstName[0]}
                                    email={member.user.email}
                                    color={roles?.find((r: any) => member.roleIds.includes(r.id))?.color}
                                />
                                <div className="mt-4 flex justify-center">
                                    <button
                                        onClick={() => removeStaffMutation.mutate(member.userId)}
                                        className="text-xs font-bold text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-destructive/10"
                                    >
                                        <Trash2 size={14} />
                                        Relieve of Duty
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        {staff?.length === 0 && (
                            <div className="col-span-full py-32 rounded-[3.5rem] border-2 border-dashed border-white/5 bg-white/[0.02] flex flex-col items-center justify-center text-center">
                                <Users size={64} className="text-muted-foreground/20 mb-6" />
                                <p className="text-xl font-bold text-muted-foreground italic">Your force is empty. Start expanding.</p>
                                <button
                                    onClick={() => setIsAddMemberModalOpen(true)}
                                    className="mt-6 text-primary font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-transform"
                                >
                                    + Recruit Member
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'roles' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Event Roles</h2>
                            <p className="text-sm text-muted-foreground">Define roles with custom colors and permissions. Drag to reorder hierarchy.</p>
                        </div>
                        <button
                            onClick={() => { setEditingRole(null); setIsRoleModalOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
                            style={{ backgroundColor: appConfig.primaryColor }}
                        >
                            <Plus size={18} />
                            Create Role
                        </button>
                    </div>

                    <div className="space-y-3">
                        {roles?.map((role: any) => (
                            <div
                                key={role.id}
                                className="group flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: role.color }} />
                                    <div>
                                        <div className="font-bold flex items-center gap-2">
                                            {role.name}
                                            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-mono">
                                                {role.permissions.length} perms
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate max-w-sm">
                                            {role.permissions.join(', ') || 'No permissions'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => { setEditingRole(role); setIsRoleModalOpen(true); }}
                                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteRoleMutation.mutate(role.id)}
                                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
            }

            {/* Add Member Modal */}
            {
                isAddMemberModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card w-full max-w-md rounded-3xl border border-border shadow-2xl overflow-hidden"
                        >
                            <form onSubmit={handleAddMember}>
                                <div className="p-6 border-b">
                                    <h3 className="text-xl font-black">Add Team Member</h3>
                                    <p className="text-sm text-muted-foreground">Invite someone by email or username.</p>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1.5">Email or Username</label>
                                        <input
                                            required
                                            value={newMemberEmail}
                                            onChange={e => setNewMemberEmail(e.target.value)}
                                            placeholder="nischay@example.com"
                                            className="w-full bg-muted border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2">Initial Roles</label>
                                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
                                            {roles?.map((role: any) => (
                                                <button
                                                    key={role.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedRoleIds(prev =>
                                                            prev.includes(role.id) ? prev.filter(id => id !== role.id) : [...prev, role.id]
                                                        )
                                                    }}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedRoleIds.includes(role.id) ? 'border-primary shadow-sm bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                                >
                                                    {role.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-muted/30 flex gap-3">
                                    <button type="button" onClick={() => setIsAddMemberModalOpen(false)} className="flex-1 py-3 font-bold text-muted-foreground hover:bg-muted rounded-xl">Cancel</button>
                                    <button
                                        type="submit"
                                        disabled={addStaffMutation.isPending}
                                        className="flex-1 py-3 font-bold text-white rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50"
                                        style={{ backgroundColor: appConfig.primaryColor }}
                                    >
                                        {addStaffMutation.isPending ? 'Adding...' : 'Add Member'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )
            }

            {/* Role Modal */}
            {
                isRoleModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card w-full max-w-2xl rounded-[2.5rem] border border-border shadow-2xl overflow-hidden"
                        >
                            <form onSubmit={handleSaveRole}>
                                <div className="p-8 border-b flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-black">{editingRole ? 'Edit Role' : 'Create New Role'}</h3>
                                        <p className="text-sm text-muted-foreground">Customize styling and permissions.</p>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <label className="text-sm font-bold">Badge Color</label>
                                        <input
                                            type="color"
                                            name="color"
                                            defaultValue={editingRole?.color || '#4F46E5'}
                                            className="w-12 h-12 rounded-full border-4 border-muted cursor-pointer ring-2 ring-transparent hover:ring-primary/40 transition-all bg-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                    <div>
                                        <label className="block text-sm font-black mb-2 uppercase tracking-widest text-muted-foreground">Role Name</label>
                                        <input
                                            required
                                            name="name"
                                            defaultValue={editingRole?.name}
                                            placeholder="e.g. Lead Moderator"
                                            className="w-full text-xl font-bold bg-muted/50 border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-black mb-4 uppercase tracking-widest text-muted-foreground">Permissions</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {AVAILABLE_PERMISSIONS.map(permission => (
                                                <label
                                                    key={permission.id}
                                                    className="relative flex items-start gap-4 p-4 rounded-2xl border border-border/50 bg-muted/20 cursor-pointer hover:bg-muted/40 hover:border-primary/20 transition-all group"
                                                >
                                                    <div className="pt-0.5">
                                                        <input
                                                            type="checkbox"
                                                            name={`permission_${permission.id}`}
                                                            defaultChecked={editingRole?.permissions?.includes(permission.id)}
                                                            className="w-5 h-5 rounded-md border-muted text-primary focus:ring-primary/30 transition-all cursor-pointer"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold group-hover:text-primary transition-colors">{permission.label}</div>
                                                        <div className="text-xs text-muted-foreground leading-relaxed">{permission.description}</div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-muted/30 flex gap-4">
                                    <button type="button" onClick={() => { setIsRoleModalOpen(false); setEditingRole(null); }} className="px-8 py-4 font-bold text-muted-foreground hover:bg-muted rounded-2xl transition-all">Cancel</button>
                                    <button
                                        type="submit"
                                        disabled={createRoleMutation.isPending || updateRoleMutation.isPending}
                                        className="flex-1 py-4 font-bold text-white rounded-2xl shadow-xl hover:opacity-90 disabled:opacity-50 transition-all"
                                        style={{ backgroundColor: appConfig.primaryColor }}
                                    >
                                        {editingRole ? 'Update Role Settings' : 'Create Role'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )
            }

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}} />
        </div >
    );
}
