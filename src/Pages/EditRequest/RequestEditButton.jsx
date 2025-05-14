import React, { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import EditRequestModal from './EditRequestModal';

/**
 * Button component that triggers the edit request modal
 *
 * @param {Object} props
 * @param {Object} props.record - The data record from the table
 * @param {String} props.modelName - The mongoose model name
 * @param {Array} props.columns - Array of column configurations for this table
 * @param {Function} props.onSuccess - Callback function to run after successful submission
 */
const RequestEditButton = ({ record, modelName, columns, onSuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {userData: user} = useSelector(state => state.persistedReducer?.global);

    // const { user } = useSelector(state => state.auth);

    // Only show fields that can be edited (not computed fields, IDs, etc)
    // const editableColumns = columns.filter(col => {
    //     // Skip system fields and non-editable fields
    //     const nonEditableFields = ['_id', 'id', 'createdAt', 'updatedAt', 'actions', '__v'];
    //     return !nonEditableFields.includes(col.dataIndex) && !col.nonEditable;
    // });

    const editableColumns = columns.filter(col => {
        // Skip system fields and non-editable fields
        const nonEditableFields = ['_id', 'id', 'createdAt', 'updatedAt', 'actions', '__v'];
        return !nonEditableFields.includes(col.dataIndex) && !col.nonEditable;
    });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Tooltip title="Request Edit Permission">
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={handleOpenModal}
                    className="text-blue-600 hover:text-blue-800"
                >Edit Request</Button>
            </Tooltip>

            {isModalOpen && (
                <EditRequestModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    record={record}
                    modelName={modelName}
                    columns={editableColumns}
                    username={user?.username}
                    onSuccess={onSuccess}
                />
            )}
        </>
    );
};

export default RequestEditButton;