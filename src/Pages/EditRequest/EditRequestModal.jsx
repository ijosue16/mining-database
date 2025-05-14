import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { formatValue } from '@/lib/form-components.jsx';
import {useToast} from "@/hooks/use-toast.js";

/**
 * Modal for requesting edit permissions on a record
 */
const EditRequestModal = ({ open, onClose, record, modelName, columns, username, onSuccess }) => {
    const [selectedFields, setSelectedFields] = useState([]);
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();

    const handleFieldToggle = (column) => {
        setSelectedFields(prev => {
            // If already selected, remove it
            if (prev.some(field => field.fieldname === column.dataIndex)) {
                return prev.filter(field => field.fieldname !== column.dataIndex);
            }
            // Otherwise add it
            return [...prev, {
                fieldname: column.dataIndex,
                displayName: column.title
            }];
        });
    };

    const handleSubmit = async () => {
        if (selectedFields.length === 0) {
            toast.error('Please select at least one field to edit');
            return;
        }

        if (!reason.trim()) {
            toast.error('Please provide a reason for the edit request');
            return;
        }

        setIsLoading(true);
        try {
            await axios.post('/api/edit-permissions', {
                model: modelName,
                recordId: record._id,
                editableFields: selectedFields,
                reason
            });

            toast.success('Edit request submitted successfully');
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Error submitting edit request:', error);
            toast.error(error.response?.data?.message || 'Failed to submit edit request');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Request Edit Permission</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col flex-grow overflow-hidden">
                    <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">Select fields to edit:</h3>
                        <Card className="border border-gray-200">
                            <ScrollArea className="h-64">
                                <CardContent className="pt-4">
                                    {columns.map((column) => (
                                        <div key={column.dataIndex} className="flex items-start space-x-3 py-2">
                                            <Checkbox
                                                id={`field-${column.dataIndex}`}
                                                checked={selectedFields.some(field => field.fieldname === column.dataIndex)}
                                                onCheckedChange={() => handleFieldToggle(column)}
                                            />
                                            <div className="grid gap-1.5">
                                                <Label htmlFor={`field-${column.dataIndex}`} className="font-medium">
                                                    {column.title}
                                                </Label>
                                                <div className="text-sm text-gray-500">
                                                    Current value: <span className="font-mono">{formatValue(record[column.dataIndex])}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </ScrollArea>
                        </Card>
                    </div>

                    <Separator className="my-2" />

                    <div className="mb-4">
                        <Label htmlFor="reason" className="text-sm font-medium">
                            Reason for edit request
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="Please explain why you need to edit this record"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="mt-1"
                            rows={4}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading || selectedFields.length === 0 || !reason.trim()}>
                        {isLoading ? 'Submitting...' : 'Submit Request'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditRequestModal;