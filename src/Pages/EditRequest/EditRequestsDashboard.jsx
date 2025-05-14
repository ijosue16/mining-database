import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Dropdown, Menu, Tag, Tooltip } from 'antd';
import { SearchOutlined, CheckOutlined, CloseOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import axios from 'axios';
import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditRequestDetailsModal from './EditRequestDetailsModal';
import {useToast} from "@/hooks/use-toast.js";

const statusColors = {
    pending: 'processing',
    authorized: 'success',
    rejected: 'error',
    expired: 'default',
    fulfilled: 'blue'
};

const EditRequestsDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'pending',
        model: '',
        username: ''
    });
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const {toast} = useToast();

    useEffect(() => {
        fetchRequests();
    }, [filters]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/edit-permissions', {
                params: filters
            });
            setRequests(data.data.editRequests);
        } catch (error) {
            console.error('Error fetching edit requests:', error);
            toast.error('Failed to fetch edit requests');
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async (id, decision, notes = '') => {
        try {
            await axios.patch(`/api/edit-permissions/${id}/decide`, {
                decision,
                notes
            });

            toast.success(`Request ${decision ? 'approved' : 'rejected'} successfully`);
            fetchRequests();
        } catch (error) {
            console.error('Error updating edit request:', error);
            toast.error('Failed to update edit request');
        }
    };

    const handleViewDetails = (record) => {
        setSelectedRequest(record);
        setIsDetailsModalOpen(true);
    };

    const handleTabChange = (status) => {
        setFilters(prev => ({ ...prev, status }));
    };

    const handleViewRecord = (record) => {
        // Navigate to record view (implementation depends on your routing setup)
        // Example: navigate(`/${record.model}/${record.recordId}`);
        window.open(`/${record.model.toLowerCase()}/${record.recordId}`, '_blank');
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            render: id => <span className="font-mono text-xs">{id.substring(0, 10)}...</span>,
            width: 120
        },
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
            render: model => <Tag color="blue">{model}</Tag>,
            width: 120,
            filters: [...new Set(requests.map(r => r.model))].map(model => ({
                text: model,
                value: model
            })),
            onFilter: (value, record) => record.model === value
        },
        {
            title: 'User',
            dataIndex: 'username',
            key: 'username',
            width: 120,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search username"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => record.username.toLowerCase().includes(value.toLowerCase())
        },
        {
            title: 'Request Date',
            dataIndex: 'editRequestedAt',
            key: 'editRequestedAt',
            render: date => (
                <Tooltip title={format(new Date(date), 'PPpp')}>
                    {formatDistanceToNow(new Date(date), { addSuffix: true })}
                </Tooltip>
            ),
            sorter: (a, b) => new Date(a.editRequestedAt) - new Date(b.editRequestedAt),
            width: 150
        },
        {
            title: 'Fields',
            dataIndex: 'editableFields',
            key: 'editableFields',
            render: fields => <span>{fields.length} field(s)</span>,
            width: 100
        },
        {
            title: 'Status',
            dataIndex: 'requestStatus',
            key: 'requestStatus',
            render: status => (
                <Tag color={statusColors[status] || 'default'}>
                    {status.toUpperCase()}
                </Tag>
            ),
            width: 120
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                const isPending = record.requestStatus === 'pending';

                return (
                    <Space size="small">
                        {isPending && (
                            <>
                                <Tooltip title="Approve">
                                    <Button
                                        type="text"
                                        icon={<CheckOutlined />}
                                        onClick={() => handleDecision(record._id, true)}
                                        className="text-green-600 hover:text-green-800"
                                    />
                                </Tooltip>
                                <Tooltip title="Reject">
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined />}
                                        onClick={() => handleDecision(record._id, false)}
                                        className="text-red-600 hover:text-red-800"
                                    />
                                </Tooltip>
                            </>
                        )}
                        <Tooltip title="View Details">
                            <Button
                                type="text"
                                icon={<EyeOutlined />}
                                onClick={() => handleViewDetails(record)}
                                className="text-blue-600 hover:text-blue-800"
                            />
                        </Tooltip>
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item key="view" onClick={() => handleViewRecord(record)}>
                                        View Original Record
                                    </Menu.Item>
                                    {record.requestStatus === 'fulfilled' && (
                                        <Menu.Item key="changes">
                                            View Changes History
                                        </Menu.Item>
                                    )}
                                </Menu>
                            }
                            trigger={['click']}
                        >
                            <Button type="text" icon={<MoreOutlined />} />
                        </Dropdown>
                    </Space>
                );
            },
            width: 180
        }
    ];

    return (
        <div className="container p-4 mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Permission Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pending" onValueChange={handleTabChange}>
                        <TabsList className="mb-6">
                            <TabsTrigger value="pending">
                                Pending
                                {requests.filter(r => r.requestStatus === 'pending').length > 0 && (
                                    <Badge variant="destructive" className="ml-2">
                                        {requests.filter(r => r.requestStatus === 'pending').length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="authorized">Approved</TabsTrigger>
                            <TabsTrigger value="rejected">Rejected</TabsTrigger>
                            <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
                            <TabsTrigger value="expired">Expired</TabsTrigger>
                            <TabsTrigger value="">All</TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending">
                            <Table
                                columns={columns}
                                dataSource={requests}
                                rowKey="_id"
                                loading={loading}
                                size="small"
                                pagination={{ pageSize: 10 }}
                            />
                        </TabsContent>

                        <TabsContent value="authorized">
                            <Table
                                columns={columns}
                                dataSource={requests}
                                rowKey="_id"
                                loading={loading}
                                size="small"
                                pagination={{ pageSize: 10 }}
                            />
                        </TabsContent>

                        <TabsContent value="rejected">
                            <Table
                                columns={columns}
                                dataSource={requests}
                                rowKey="_id"
                                loading={loading}
                                size="small"
                                pagination={{ pageSize: 10 }}
                            />
                        </TabsContent>

                        <TabsContent value="fulfilled">
                            <Table
                                columns={columns}
                                dataSource={requests}
                                rowKey="_id"
                                loading={loading}
                                size="small"
                                pagination={{ pageSize: 10 }}
                            />
                        </TabsContent>

                        <TabsContent value="expired">
                            <Table
                                columns={columns}
                                dataSource={requests}
                                rowKey="_id"
                                loading={loading}
                                size="small"
                                pagination={{ pageSize: 10 }}
                            />
                        </TabsContent>

                        <TabsContent value="">
                            <Table
                                columns={columns}
                                dataSource={requests}
                                rowKey="_id"
                                loading={loading}
                                size="small"
                                pagination={{ pageSize: 10 }}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {selectedRequest && (
                <EditRequestDetailsModal
                    open={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    editRequest={selectedRequest}
                    onApprove={(notes) => handleDecision(selectedRequest._id, true, notes)}
                    onReject={(notes) => handleDecision(selectedRequest._id, false, notes)}
                    onRefresh={fetchRequests}
                />
            )}
        </div>
    );
};

export default EditRequestsDashboard;