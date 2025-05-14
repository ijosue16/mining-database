import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table } from 'antd';
import { InfoIcon, ClockIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from 'lucide-react';
import { formatValue } from '@/lib/form-components.jsx';
import {useToast} from "@/hooks/use-toast.js";

const EditRequestDetailsModal = ({ open, onClose, editRequest, onApprove, onReject, onRefresh }) => {
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');
    const [processingAction, setProcessingAction] = useState(false);
    const {toast} = useToast();

    useEffect(() => {
        if (open && editRequest) {
            fetchRecord();
        }
    }, [open, editRequest]);

    const fetchRecord = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/${editRequest.model.toLowerCase()}/${editRequest.recordId}`);
            setRecord(data.data[editRequest.model.toLowerCase()]);
        } catch (error) {
            console.error('Error fetching record:', error);
            toast.error('Failed to fetch record details');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        setProcessingAction(true);
        try {
            await onApprove(notes);
            setNotes('');
            onClose();
        } finally {
            setProcessingAction(false);
        }
    };

    const handleReject = async () => {
        setProcessingAction(true);
        try {
            await onReject(notes);
            setNotes('');
            onClose();
        } finally {
            setProcessingAction(false);
        }
    };

    const renderStatusBadge = (status) => {
        const variants = {
            pending: { variant: 'outline', icon: <ClockIcon className="h-4 w-4" /> },
            authorized: { variant: 'success', icon: <CheckCircleIcon className="h-4 w-4" /> },
            rejected: { variant: 'destructive', icon: <XCircleIcon className="h-4 w-4" /> },
            expired: { variant: 'secondary', icon: <AlertTriangleIcon className="h-4 w-4" /> },
            fulfilled: { variant: 'default', icon: <CheckCircleIcon className="h-4 w-4" /> }
        };

        const config = variants[status] || variants.pending;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                {config.icon}
                <span className="capitalize">{status}</span>
            </Badge>
        );
    };

    const columns = [
        {
            title: 'Field',
            dataIndex: 'displayName',
            key: 'displayName',
            render: (displayName, record) => displayName || record.fieldname,
            width: '30%'
        },
        {
            title: 'Current Value',
            dataIndex: 'initialValue',
            key: 'initialValue',
            render: (value) => formatValue(value),
            width: '35%'
        },
        {
            title: 'New Value',
            dataIndex: 'newValue',
            key: 'newValue',
            render: (value, record) => {
                if (editRequest.requestStatus === 'fulfilled') {
                    return formatValue(value);
                }
                return formatValue(record.initialValue);
            },
            width: '35%'
        }
    ];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Edit Request Details</span>
                        {editRequest && renderStatusBadge(editRequest.requestStatus)}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-grow overflow-hidden flex flex-col">
                    {editRequest && (
                        <Tabs defaultValue="details" className="flex-grow overflow-hidden flex flex-col">
                            <TabsList>
                                <TabsTrigger value="details">Request Details</TabsTrigger>
                                <TabsTrigger value="fields">Fields to Edit</TabsTrigger>
                                {editRequest.requestStatus === 'fulfilled' && (
                                    <TabsTrigger value="changes">Changes History</TabsTrigger>
                                )}
                            </TabsList>

                            <ScrollArea className="flex-grow mt-4">
                                <TabsContent value="details" className="space-y-4">
                                    <Card>
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm font-medium">Requested By</div>
                                                    <div>{editRequest.username}</div>
                                                </div>

                                                <div>
                                                    <div className="text-sm font-medium">Model</div>
                                                    <div>{editRequest.model}</div>
                                                </div>

                                                <div>
                                                    <div className="text-sm font-medium">Requested At</div>
                                                    <div>{format(new Date(editRequest.editRequestedAt), 'PPpp')}</div>
                                                </div>

                                                {editRequest.decisionAt && (
                                                    <div>
                                                        <div className="text-sm font-medium">Decision At</div>
                                                        <div>{format(new Date(editRequest.decisionAt), 'PPpp')}</div>
                                                    </div>
                                                )}

                                                {editRequest.decisionBy && (
                                                    <div>
                                                        <div className="text-sm font-medium">Decision By</div>
                                                        <div>{editRequest.decisionBy}</div>
                                                    </div>
                                                )}

                                                {editRequest.editExpiresAt && (
                                                    <div>
                                                        <div className="text-sm font-medium">Expires At</div>
                                                        <div>{format(new Date(editRequest.editExpiresAt), 'PPpp')}</div>
                                                    </div>
                                                )}

                                                {editRequest.fulfilledAt && (
                                                    <div>
                                                        <div className="text-sm font-medium">Fulfilled At</div>
                                                        <div>{format(new Date(editRequest.fulfilledAt), 'PPpp')}</div>
                                                    </div>
                                                )}
                                            </div>

                                            <Separator />

                                            <div>
                                                <div className="text-sm font-medium mb-2">Reason for Edit</div>
                                                <Alert variant="info">
                                                    <InfoIcon className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {editRequest.reason}
                                                    </AlertDescription>
                                                </Alert>
                                            </div>

                                            {editRequest.notes && (
                                                <div>
                                                    <div className="text-sm font-medium mb-2">Admin Notes</div>
                                                    <Alert variant={editRequest.decision ? "success" : "destructive"}>
                                                        <AlertDescription>
                                                            {editRequest.notes}
                                                        </AlertDescription>
                                                    </Alert>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="fields">
                                    <Table
                                        columns={columns}
                                        dataSource={editRequest.editableFields}
                                        rowKey="fieldname"
                                        pagination={false}
                                        size="small"
                                        bordered
                                        loading={loading}
                                    />
                                </TabsContent>

                                {editRequest.requestStatus === 'fulfilled' && (
                                    <TabsContent value="changes">
                                        <Table
                                            columns={[
                                                {
                                                    title: 'Field',
                                                    dataIndex: 'displayName',
                                                    key: 'displayName',
                                                    render: (displayName, record) => displayName || record.fieldname,
                                                    width: '30%'
                                                },
                                                {
                                                    title: 'Original Value',
                                                    dataIndex: 'initialValue',
                                                    key: 'initialValue',
                                                    render: (value) => formatValue(value),
                                                    width: '35%'
                                                },
                                                {
                                                    title: 'Updated Value',
                                                    dataIndex: 'newValue',
                                                    key: 'newValue',
                                                    render: (value) => formatValue(value),
                                                    width: '35%'
                                                }
                                            ]}
                                            dataSource={editRequest.editableFields.filter(f =>
                                                JSON.stringify(f.initialValue) !== JSON.stringify(f.newValue)
                                            )}
                                            rowKey="fieldname"
                                            pagination={false}
                                            size="small"
                                            bordered
                                            loading={loading}
                                        />
                                    </TabsContent>
                                )}
                            </ScrollArea>
                        </Tabs>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    {editRequest && editRequest.requestStatus === 'pending' && (
                        <>
                            <div className="flex-grow">
                                <Textarea
                                    placeholder="Add notes about your decision (optional)"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="mb-4"
                                />
                            </div>

                            <Button
                                variant="outline"
                                onClick={handleReject}
                                disabled={processingAction}
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            >
                                Reject
                            </Button>

                            <Button
                                onClick={handleApprove}
                                disabled={processingAction}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Approve
                            </Button>
                        </>
                    )}

                    {(!editRequest || editRequest.requestStatus !== 'pending') && (
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    )}

                    {editRequest && editRequest.requestStatus !== 'pending' && editRequest.requestStatus !== 'expired' && (
                        <Button onClick={onRefresh}>
                            Refresh
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditRequestDetailsModal;