import React, { useState } from 'react';
import { Table, Button, Space, message, Tooltip } from 'antd';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
    useGetAllFeeTypesQuery,
    useDeleteFeeTypeMutation
} from '@/states/apislice.js';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import CreateFeeTypeForm from './CreateFeeType';
import UpdateFeeTypeForm from './UpdateFeeType';
import FetchingPage from "@/Pages/FetchingPage.jsx";

const FeeTypesPage = () => {
    const { data: feeTypes, isLoading, isError, refetch } = useGetAllFeeTypesQuery();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedFeeType, setSelectedFeeType] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const [deleteFeeType] = useDeleteFeeTypeMutation();

    const handleDeleteFeeType = async () => {
        try {
            await deleteFeeType(selectedFeeType._id).unwrap();
            message.success('Fee type deleted successfully');
            refetch();
            setDeleteModalOpen(false);
        } catch (error) {
            message.error('Failed to delete fee type');
        }
    };

    const openDeleteModal = (feeType) => {
        setSelectedFeeType(feeType);
        setDeleteModalOpen(true);
    };

    const openUpdateModal = (feeType) => {
        setSelectedFeeType(feeType);
        setIsUpdateModalOpen(true);
    };

    const modelColorMap = {
        cassiterite: 'bg-blue-100 text-blue-800',
        coltan: 'bg-green-100 text-green-800',
        wolframite: 'bg-purple-100 text-purple-800',
        lithium: 'bg-yellow-100 text-yellow-800',
        beryllium: 'bg-red-100 text-red-800'
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <span className="font-medium">{text}</span>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => text || 'No description provided'
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
            render: (_, record) => {
                if (!record.rate) return null;
                else if (record.currency === 'USD') {
                    return `$${record.rate}`;
                } else {
                    return `RWF ${record.rate}`;
                }
            }
        },
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
            render: (model) => (
                <Badge className={modelColorMap[model] || 'bg-gray-100 text-gray-800'}>
                    {model}
                </Badge>
            )
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<Pencil size={16} />}
                            onClick={() => openUpdateModal(record)}
                            className="text-blue-600 hover:text-blue-800"
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            icon={<Trash2 size={16} />}
                            onClick={() => openDeleteModal(record)}
                            className="text-red-600 hover:text-red-800"
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    if (isLoading) return <FetchingPage/>
    if (isError) {
        return <div className="text-red-500 p-8">Error loading fee types. Please try again.</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Fee Types</h1>
                <Button
                    type="primary"
                    onClick={() => setIsCreateModalOpen(true)}
                    icon={<Plus size={16} />}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Add New Fee Type
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <Table
                    columns={columns}
                    loading={isLoading}
                    dataSource={feeTypes?.data?.feeTypes}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    className="rounded-lg overflow-hidden"
                />
            </div>

            {/* Create Fee Type Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New Fee Type</DialogTitle>
                    </DialogHeader>
                    <CreateFeeTypeForm
                        onSuccess={() => {
                            setIsCreateModalOpen(false);
                            refetch();
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Update Fee Type Modal */}
            <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Fee Type</DialogTitle>
                    </DialogHeader>
                    {selectedFeeType && (
                        <UpdateFeeTypeForm
                            feeType={selectedFeeType}
                            onSuccess={() => {
                                setIsUpdateModalOpen(false);
                                refetch();
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Confirm Deletion</DialogTitle>
                        <DialogDescription className="pt-4">
                            Are you sure you want to delete the fee type <span className="font-semibold">{selectedFeeType?.title}</span>?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
                        <h4 className="text-amber-800 font-medium mb-2">Warning:</h4>
                        <p className="text-amber-700 text-sm">
                            Deleting this fee type may affect existing transactions and reports that reference it.
                            This action cannot be undone.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            danger
                            onClick={handleDeleteFeeType}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FeeTypesPage;