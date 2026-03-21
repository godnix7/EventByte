import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Settings2, X } from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';

interface Field {
    id?: string;
    label: string;
    fieldType: string;
    isRequired: boolean;
    placeholder?: string;
    options?: string[];
    order: number;
}

interface Step4Props {
    eventId: string;
    initialData?: Field[];
    onSave: (fields: Field[]) => Promise<void>;
    isPending?: boolean;
}

const FIELD_TYPES = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Dropdown (Single)' },
    { value: 'multiselect', label: 'Dropdown (Multi)' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'file', label: 'File Upload' },
];

export const Step4FormBuilder: React.FC<Step4Props> = ({ initialData = [], onSave, isPending }) => {
    const [fields, setFields] = useState<Field[]>(initialData);
    const [editingFieldId, setEditingFieldId] = useState<number | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        if (initialData && initialData.length > 0 && fields.length === 0) {
            setFields(initialData);
        }
    }, [initialData]);

    const addField = () => {
        const newField: Field = {
            label: 'New Field',
            fieldType: 'text',
            isRequired: false,
            order: fields.length,
        };
        setFields([...fields, newField]);
        setEditingFieldId(fields.length);
    };

    const removeField = (index: number) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields.map((f, i) => ({ ...f, order: i })));
        setEditingFieldId(null);
    };

    const updateField = (index: number, updates: Partial<Field>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        setFields(newFields);
    };

    const addOption = (index: number) => {
        const field = fields[index];
        const options = field.options || [];
        updateField(index, { options: [...options, `Option ${options.length + 1}`] });
    };

    const removeOption = (fieldIndex: number, optionIndex: number) => {
        const field = fields[fieldIndex];
        const options = (field.options || []).filter((_, i) => i !== optionIndex);
        updateField(fieldIndex, { options });
    };

    const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
        const field = fields[fieldIndex];
        const options = [...(field.options || [])];
        options[optionIndex] = value;
        updateField(fieldIndex, { options });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        console.log('Step 4 Saving fields:', fields);

        const invalidFields = fields.filter(f => !f.label || !f.fieldType);
        if (invalidFields.length > 0) {
            setErrors(['All fields must have a label and a type.']);
            return;
        }

        try {
            const mappedFields = fields.map(f => ({
                id: f.id,
                label: f.label,
                fieldType: f.fieldType,
                isRequired: f.isRequired,
                placeholder: f.placeholder || '',
                options: f.options || [],
                order: f.order,
            }));

            await onSave(mappedFields);
        } catch (err: any) {
            console.error('Step 4 Save Error:', err);
            setErrors([err.response?.data?.message || 'Failed to save registration fields']);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Custom Registration Form</h2>
                    <p className="text-sm text-muted-foreground">Ask participants for specific information (e.g. T-shirt size, Dietary reqs).</p>
                </div>
                <button
                    type="button"
                    onClick={addField}
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                    <Plus size={18} />
                    Add Field
                </button>
            </div>

            <AnimatePresence>
                {errors.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive"
                    >
                        <strong>Validation Errors:</strong>
                        <ul className="list-disc list-inside mt-1">
                            {errors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {fields.length === 0 ? (
                    <div className="border-2 border-dashed rounded-2xl p-12 text-center space-y-4">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                            <Settings2 size={24} />
                        </div>
                        <div>
                            <p className="font-medium text-muted-foreground">No custom fields yet</p>
                            <p className="text-xs text-muted-foreground">Standard fields like Name and Email are always included.</p>
                        </div>
                        <button disabled={isPending} onClick={addField} className="text-sm text-primary font-semibold hover:underline disabled:opacity-50">Add your first field</button>
                    </div>
                ) : (
                    <Reorder.Group axis="y" values={fields} onReorder={setFields} className="space-y-3">
                        {fields.map((field, index) => (
                            <Reorder.Item
                                key={index}
                                value={field}
                                className={`group border rounded-xl bg-card overflow-hidden transition-all ${editingFieldId === index ? 'ring-2 ring-primary shadow-lg' : 'hover:border-primary/50'}`}
                            >
                                <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setEditingFieldId(editingFieldId === index ? null : index)}>
                                    <div className="cursor-grab active:cursor-grabbing text-muted-foreground group-hover:text-foreground">
                                        <GripVertical size={18} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium truncate">{field.label || 'Unnamed Field'}</span>
                                            {field.isRequired && <span className="text-destructive">*</span>}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground capitalize">
                                                {FIELD_TYPES.find(t => t.value === field.fieldType)?.label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            disabled={isPending}
                                            onClick={(e) => { e.stopPropagation(); removeField(index); }}
                                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {editingFieldId === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="px-4 pb-6 pt-2 border-t bg-muted/10 space-y-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Field Label</label>
                                                <input
                                                    value={field.label}
                                                    disabled={isPending}
                                                    onChange={(e) => updateField(index, { label: e.target.value })}
                                                    className="w-full p-2 border rounded-lg bg-background outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Field Type</label>
                                                <select
                                                    value={field.fieldType}
                                                    disabled={isPending}
                                                    onChange={(e) => updateField(index, { fieldType: e.target.value })}
                                                    className="w-full p-2 border rounded-lg bg-background outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                                >
                                                    {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Placeholder</label>
                                                <input
                                                    value={field.placeholder || ''}
                                                    disabled={isPending}
                                                    onChange={(e) => updateField(index, { placeholder: e.target.value })}
                                                    className="w-full p-2 border rounded-lg bg-background outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 pt-6">
                                                <input
                                                    type="checkbox"
                                                    checked={field.isRequired}
                                                    disabled={isPending}
                                                    onChange={(e) => updateField(index, { isRequired: e.target.checked })}
                                                    className="w-4 h-4 accent-primary disabled:opacity-50"
                                                />
                                                <span className="text-sm font-medium">Is Required?</span>
                                            </div>
                                        </div>

                                        {['select', 'multiselect', 'radio'].includes(field.fieldType) && (
                                            <div className="space-y-3 pt-2">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Options</label>
                                                <div className="space-y-2">
                                                    {(field.options || []).map((opt, optIndex) => (
                                                        <div key={optIndex} className="flex items-center gap-2">
                                                            <input
                                                                value={opt}
                                                                onChange={(e) => updateOption(index, optIndex, e.target.value)}
                                                                className="flex-1 p-2 border rounded-lg bg-background text-sm outline-none"
                                                            />
                                                            <button type="button" onClick={() => removeOption(index, optIndex)} className="text-muted-foreground hover:text-destructive"><X size={16} /></button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => addOption(index)}
                                                        disabled={isPending}
                                                        className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline disabled:opacity-50"
                                                    >
                                                        <Plus size={14} /> Add Option
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                )}
            </div>

            <form id="wizard-step-form" onSubmit={handleSave}>
                <button type="submit" disabled={isPending} style={{ display: 'none' }} />
            </form>
        </div>
    );
};
