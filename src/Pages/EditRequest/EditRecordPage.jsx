// import React, {useEffect, useState} from 'react';
// import {useParams, useNavigate} from 'react-router-dom';
// import axios from 'axios';
// import {formatDistanceToNow} from 'date-fns';
// import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
// import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
// import {Badge} from '@/components/ui/badge';
// import {Button} from '@/components/ui/button';
// import {Input} from '@/components/ui/input';
// import {Textarea} from '@/components/ui/textarea';
// import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
// import {Checkbox} from '@/components/ui/checkbox';
// import {Label} from '@/components/ui/label';
// import {Separator} from '@/components/ui/separator';
// import {Skeleton} from '@/components/ui/skeleton';
// import {ClockIcon, AlertCircleIcon, CheckCircleIcon} from 'lucide-react';
// import {getFieldComponent} from '@/lib/form-components';
// import {useToast} from "@/hooks/use-toast.js"; // Utility to get the right component by field type
//
// const EditRecordPage = () => {
//     const {model, recordId, permissionId} = useParams();
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(true);
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState(null);
//     const [permission, setPermission] = useState(null);
//     const [record, setRecord] = useState(null);
//     const [formData, setFormData] = useState({});
//     const [countdown, setCountdown] = useState(null);
//     const {toast} = useToast();
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(`/api/edit-permissions/${model}/${recordId}/${permissionId}`);
//                 const {permission, record} = response.data.data;
//
//                 setPermission(permission);
//                 setRecord(record);
//
//                 // Initialize form data with existing values
//                 const initialData = {};
//                 permission.editableFields.forEach(field => {
//                     initialData[field.fieldname] = record[field.fieldname];
//                 });
//                 setFormData(initialData);
//
//                 // Calculate countdown if permission is active
//                 if (permission.editExpiresAt) {
//                     const expiryTime = new Date(permission.editExpiresAt).getTime();
//                     const now = new Date().getTime();
//                     setCountdown(Math.max(0, Math.floor((expiryTime - now) / 1000)));
//                 }
//
//                 setError(null);
//             } catch (err) {
//                 console.error('Error fetching edit permission:', err);
//                 setError(err.response?.data?.message || 'Failed to load edit permission');
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchData();
//     }, [model, recordId, permissionId]);
//
//     // Countdown timer
//     useEffect(() => {
//         if (countdown === null || countdown <= 0) return;
//
//         const timer = setInterval(() => {
//             setCountdown(prevCount => {
//                 if (prevCount <= 1) {
//                     clearInterval(timer);
//                     toast.error('Edit permission has expired');
//                     return 0;
//                 }
//                 return prevCount - 1;
//             });
//         }, 1000);
//
//         return () => clearInterval(timer);
//     }, [countdown]);
//
//     const handleInputChange = (fieldname, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [fieldname]: value
//         }));
//     };
//
//     const handleSubmit = async () => {
//         if (countdown <= 0) {
//             toast.error('Edit permission has expired');
//             return;
//         }
//
//         try {
//             setSubmitting(true);
//             await axios.patch(`/api/edit-permissions/${model}/${recordId}/${permissionId}`, {
//                 editedFields: formData
//             });
//             toast.success('Changes saved successfully');
//             navigate(-1);
//         } catch (err) {
//             console.error('Error submitting changes:', err);
//             toast.error(err.response?.data?.message || 'Failed to save changes');
//         } finally {
//             setSubmitting(false);
//         }
//     };
//
//     const formatTime = (seconds) => {
//         if (seconds <= 0) return 'Expired';
//
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${mins}:${secs.toString().padStart(2, '0')}`;
//     };
//
//     if (loading) {
//         return (
//             <div className="container mx-auto p-6">
//                 <Card>
//                     <CardHeader>
//                         <Skeleton className="h-8 w-3/4"/>
//                         <Skeleton className="h-4 w-1/2"/>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="space-y-4">
//                             {[1, 2, 3].map(i => (
//                                 <div key={i} className="space-y-2">
//                                     <Skeleton className="h-4 w-1/4"/>
//                                     <Skeleton className="h-10 w-full"/>
//                                 </div>
//                             ))}
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         );
//     }
//
//     if (error) {
//         return (
//             <div className="container mx-auto p-6">
//                 <Alert variant="destructive">
//                     <AlertCircleIcon className="h-4 w-4"/>
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//                 <div className="mt-4">
//                     <Button onClick={() => navigate(-1)}>Go Back</Button>
//                 </div>
//             </div>
//         );
//     }
//
//     if (!permission || !record) {
//         return null;
//     }
//
//     return (
//         <div className="container mx-auto p-6">
//             <Card>
//                 <CardHeader>
//                     <div className="flex items-center justify-between">
//                         <CardTitle>Edit {model} Record</CardTitle>
//                         {countdown !== null && (
//                             <div className="flex items-center space-x-2">
//                                 <ClockIcon className="h-4 w-4 text-yellow-500"/>
//                                 <span className={`font-mono ${countdown < 60 ? 'text-red-500' : 'text-yellow-500'}`}>
//                   Time remaining: {formatTime(countdown)}
//                 </span>
//                             </div>
//                         )}
//                     </div>
//                     <CardDescription>
//                         <div className="flex flex-wrap gap-2 items-center mt-2">
//                             <Badge variant={permission.requestStatus === 'authorized' ? 'success' : 'secondary'}>
//                                 {permission.requestStatus}
//                             </Badge>
//                             <span className="text-sm text-gray-500">
//                 Requested {formatDistanceToNow(new Date(permission.editRequestedAt), {addSuffix: true})}
//               </span>
//                             {permission.decisionAt && (
//                                 <span className="text-sm text-gray-500">
//                   Approved {formatDistanceToNow(new Date(permission.decisionAt), {addSuffix: true})}
//                 </span>
//                             )}
//                         </div>
//                     </CardDescription>
//                 </CardHeader>
//
//                 <CardContent>
//                     <div className="space-y-6">
//                         <Alert>
//                             <CheckCircleIcon className="h-4 w-4"/>
//                             <AlertTitle>Reason for Edit</AlertTitle>
//                             <AlertDescription>{permission.reason}</AlertDescription>
//                         </Alert>
//
//                         <Separator className="my-4"/>
//
//                         <div className="space-y-4">
//                             {permission.editableFields.map((field) => {
//                                 // Get the appropriate form component based on the data type
//                                 const fieldType = typeof record[field.fieldname];
//                                 const FieldComponent = getFieldComponent(fieldType, record[field.fieldname]);
//
//                                 return (
//                                     <div key={field.fieldname} className="space-y-2">
//                                         <Label htmlFor={field.fieldname}>{field.displayName || field.fieldname}</Label>
//                                         <FieldComponent
//                                             id={field.fieldname}
//                                             name={field.fieldname}
//                                             value={formData[field.fieldname]}
//                                             onChange={(value) => handleInputChange(field.fieldname, value)}
//                                             disabled={countdown <= 0 || submitting}
//                                             className="w-full"
//                                         />
//                                         <div className="text-xs text-gray-500">
//                                             Original value: {typeof record[field.fieldname] === 'object'
//                                             ? JSON.stringify(record[field.fieldname])
//                                             : String(record[field.fieldname])}
//                                         </div>
//                                     </div>
//                                 )
//                             })}
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }


import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {formatDistanceToNow} from 'date-fns';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import {Skeleton} from '@/components/ui/skeleton';
import {ClockIcon, AlertCircleIcon, CheckCircleIcon} from 'lucide-react';
import {getFieldComponent} from '@/lib/form-components.jsx';
import {useToast} from "@/hooks/use-toast.js";

const EditRecordPage = () => {
    const {model, recordId, permissionId} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [permission, setPermission] = useState(null);
    const [record, setRecord] = useState(null);
    const [formData, setFormData] = useState({});
    const [countdown, setCountdown] = useState(null);
    const {toast} = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/edit-permissions/${model}/${recordId}/${permissionId}`);
                const {permission, record} = response.data.data;

                setPermission(permission);
                setRecord(record);

                // Initialize form data with existing values
                const initialData = {};
                permission.editableFields.forEach(field => {
                    initialData[field.fieldname] = record[field.fieldname];
                });
                setFormData(initialData);

                // Calculate countdown if permission is active
                if (permission.editExpiresAt) {
                    const expiryTime = new Date(permission.editExpiresAt).getTime();
                    const now = new Date().getTime();
                    setCountdown(Math.max(0, Math.floor((expiryTime - now) / 1000)));
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching edit permission:', err);
                setError(err.response?.data?.message || 'Failed to load edit permission');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [model, recordId, permissionId]);

    // Countdown timer
    useEffect(() => {
        if (countdown === null || countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown(prevCount => {
                if (prevCount <= 1) {
                    clearInterval(timer);
                    toast.error('Edit permission has expired');
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    const handleInputChange = (fieldname, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldname]: value
        }));
    };

    const handleSubmit = async () => {
        if (countdown <= 0) {
            toast.error('Edit permission has expired');
            return;
        }

        try {
            setSubmitting(true);
            await axios.patch(`/api/edit-permissions/${model}/${recordId}/${permissionId}`, {
                editedFields: formData
            });
            toast.success('Changes saved successfully');
            navigate(-1);
        } catch (err) {
            console.error('Error submitting changes:', err);
            toast.error(err.response?.data?.message || 'Failed to save changes');
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        if (seconds <= 0) return 'Expired';

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4"/>
                        <Skeleton className="h-4 w-1/2"/>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-1/4"/>
                                    <Skeleton className="h-10 w-full"/>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertCircleIcon className="h-4 w-4"/>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="mt-4">
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </div>
        );
    }

    if (!permission || !record) {
        return null;
    }

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Edit {model} Record</CardTitle>
                        {countdown !== null && (
                            <div className="flex items-center space-x-2">
                                <ClockIcon className="h-4 w-4 text-yellow-500"/>
                                <span className={`font-mono ${countdown < 60 ? 'text-red-500' : 'text-yellow-500'}`}>
                  Time remaining: {formatTime(countdown)}
                </span>
                            </div>
                        )}
                    </div>
                    <CardDescription>
                        <div className="flex flex-wrap gap-2 items-center mt-2">
                            <Badge variant={permission.requestStatus === 'authorized' ? 'success' : 'secondary'}>
                                {permission.requestStatus}
                            </Badge>
                            <span className="text-sm text-gray-500">
                Requested {formatDistanceToNow(new Date(permission.editRequestedAt), {addSuffix: true})}
              </span>
                            {permission.decisionAt && (
                                <span className="text-sm text-gray-500">
                  Approved {formatDistanceToNow(new Date(permission.decisionAt), {addSuffix: true})}
                </span>
                            )}
                        </div>
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        <Alert>
                            <CheckCircleIcon className="h-4 w-4"/>
                            <AlertTitle>Reason for Edit</AlertTitle>
                            <AlertDescription>{permission.reason}</AlertDescription>
                        </Alert>

                        <Separator className="my-4"/>

                        <div className="space-y-4">
                            {permission.editableFields.map((field) => {
                                // Get the appropriate form component based on the data type
                                const fieldType = typeof record[field.fieldname];
                                const FieldComponent = getFieldComponent(fieldType, record[field.fieldname]);

                                return (
                                    <div key={field.fieldname} className="space-y-2">
                                        <Label htmlFor={field.fieldname}>{field.displayName || field.fieldname}</Label>
                                        <FieldComponent
                                            id={field.fieldname}
                                            name={field.fieldname}
                                            value={formData[field.fieldname]}
                                            onChange={(value) => handleInputChange(field.fieldname, value)}
                                            disabled={countdown <= 0 || submitting}
                                            className="w-full"
                                        />
                                        <div className="text-xs text-gray-500">
                                            Original value: {typeof record[field.fieldname] === 'object'
                                            ? JSON.stringify(record[field.fieldname])
                                            : String(record[field.fieldname])}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between pt-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={countdown <= 0 || submitting}
                        className={countdown <= 0 ? 'opacity-50' : ''}
                    >
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default EditRecordPage;