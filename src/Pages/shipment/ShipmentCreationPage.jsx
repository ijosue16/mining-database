// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Separator } from '@/components/ui/separator';
// import { AlertCircle, Check, ChevronDown, Plus, Trash } from 'lucide-react';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import ShipmentPreview from './ShipmentPreview';
// import {useToast} from "@/hooks/use-toast.js";
// import {useParams} from "react-router-dom";
// const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;
//
//
// const ShipmentCreationPage = () => {
//     const { toast } = useToast();
//     const { model } = useParams();
//     const [availableLots, setAvailableLots] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedLots, setSelectedLots] = useState([]);
//     const [currentEntry, setCurrentEntry] = useState(null);
//     const [entries, setEntries] = useState([]);
//     const [quantityMap, setQuantityMap] = useState({});
//
//     // Fetch available lots on component mount
//     useEffect(() => {
//         const fetchAvailableLots = async () => {
//             try {
//                 const response = await fetch(`${BASE_URL}lots/available/${model}`);
//                 const data = await response.json();
//
//                 if (data.status === 'success') {
//                     setAvailableLots(data.data.lots);
//
//                     // Group lots by entry
//                     const entriesMap = {};
//                     data.data.lots.forEach(lot => {
//                         if (!entriesMap[lot.entry._id]) {
//                             entriesMap[lot.entry._id] = {
//                                 ...lot.entry,
//                                 lots: []
//                             };
//                         }
//                         entriesMap[lot.entry._id].lots.push(lot);
//                     });
//
//                     setEntries(Object.values(entriesMap));
//                 }
//             } catch (error) {
//                 toast({
//                     title: "Error fetching lots",
//                     description: error.message,
//                     variant: "destructive"
//                 });
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchAvailableLots();
//     }, [toast]);
//
//     const handleSelectEntry = (entry) => {
//         setCurrentEntry(entry);
//     };
//
//     const handleAddLotToShipment = (lot) => {
//         // Initialize with max available quantity
//         if (!quantityMap[lot._id]) {
//             setQuantityMap(prev => ({
//                 ...prev,
//                 [lot._id]: lot.remainingWeight
//             }));
//         }
//
//         // Add lot to selected lots if not already there
//         if (!selectedLots.find(l => l._id === lot._id)) {
//             setSelectedLots(prev => [...prev, lot]);
//         }
//     };
//
//     const handleRemoveLot = (lotId) => {
//         setSelectedLots(prev => prev.filter(lot => lot._id !== lotId));
//
//         // Also remove from quantity map
//         const newQuantityMap = {...quantityMap};
//         delete newQuantityMap[lotId];
//         setQuantityMap(newQuantityMap);
//     };
//
//     const handleQuantityChange = (lotId, value) => {
//         const lot = availableLots.find(l => l._id === lotId);
//         const numValue = parseFloat(value);
//
//         // Validate that quantity is not more than available
//         if (numValue > lot.remainingWeight) {
//             toast({
//                 title: "Invalid quantity",
//                 description: `Cannot exceed available amount of ${lot.remainingWeight}kg`,
//                 variant: "destructive"
//             });
//             return;
//         }
//
//         setQuantityMap(prev => ({
//             ...prev,
//             [lotId]: numValue
//         }));
//     };
//
//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         });
//     };
//
//     if (loading) {
//         return <div className="flex items-center justify-center h-64">Loading available lots...</div>;
//     }
//
//     return (
//         <div className="container mx-auto py-6">
//             <h1 className="text-3xl font-bold mb-6">Create New Shipment</h1>
//
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Entries and Lots Selection */}
//                 <div className="lg:col-span-2">
//                     <Card className="mb-6">
//                         <CardHeader>
//                             <CardTitle>Select Entry and Lots</CardTitle>
//                             <CardDescription>
//                                 Choose an entry to view its available lots
//                             </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//                                 {entries.map(entry => (
//                                     <Card
//                                         key={entry._id}
//                                         className={`cursor-pointer hover:border-blue-500 transition-colors ${currentEntry?._id === entry._id ? 'border-2 border-blue-500' : ''}`}
//                                         onClick={() => handleSelectEntry(entry)}
//                                     >
//                                         <CardHeader className="p-4">
//                                             <CardTitle className="text-lg">{entry.model.toUpperCase()} - {entry.mineralType}</CardTitle>
//                                             <CardDescription>
//                                                 {entry.beneficiary || 'No beneficiary'} <br />
//                                                 {entry.supplyDate ? formatDate(entry.supplyDate) : 'No date'}
//                                             </CardDescription>
//                                         </CardHeader>
//                                         <CardContent className="p-4 pt-0">
//                                             <Badge>{entry.lots.length} lot(s)</Badge>
//                                         </CardContent>
//                                     </Card>
//                                 ))}
//                             </div>
//
//                             {currentEntry && (
//                                 <div>
//                                     <h3 className="text-lg font-medium mb-3">Available Lots for Selected Entry</h3>
//                                     <ScrollArea className="h-96">
//                                         <Table>
//                                             <TableHeader>
//                                                 <TableRow>
//                                                     <TableHead>Lot #</TableHead>
//                                                     <TableHead>Weight In (kg)</TableHead>
//                                                     <TableHead>Weight Out (kg)</TableHead>
//                                                     <TableHead>Grade</TableHead>
//                                                     <TableHead>Available (kg)</TableHead>
//                                                     <TableHead>Action</TableHead>
//                                                 </TableRow>
//                                             </TableHeader>
//                                             <TableBody>
//                                                 {currentEntry.lots.map(lot => (
//                                                     <TableRow key={lot._id}>
//                                                         <TableCell>{lot.lotNumber}</TableCell>
//                                                         <TableCell>{lot.weightIn}</TableCell>
//                                                         <TableCell>{lot.weightOut || '-'}</TableCell>
//                                                         <TableCell>{lot.mineralGrade || '-'}</TableCell>
//                                                         <TableCell className="font-medium">{lot.remainingWeight.toFixed(2)}</TableCell>
//                                                         <TableCell>
//                                                             <Button
//                                                                 size="sm"
//                                                                 variant="outline"
//                                                                 onClick={() => handleAddLotToShipment(lot)}
//                                                                 disabled={selectedLots.some(l => l._id === lot._id)}
//                                                             >
//                                                                 <Plus className="h-4 w-4 mr-1" /> Add
//                                                             </Button>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ))}
//                                             </TableBody>
//                                         </Table>
//                                     </ScrollArea>
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </div>
//
//                 {/* Selected Lots */}
//                 <div>
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Selected Lots for Shipment</CardTitle>
//                             <CardDescription>
//                                 {selectedLots.length} lot(s) selected
//                             </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             {selectedLots.length === 0 ? (
//                                 <div className="text-center p-4 text-gray-500">
//                                     No lots selected yet. Select lots from the left panel.
//                                 </div>
//                             ) : (
//                                 <div>
//                                     <ScrollArea className="h-64 mb-4">
//                                         {selectedLots.map(lot => (
//                                             <div key={lot._id} className="mb-4 p-3 border rounded-md">
//                                                 <div className="flex justify-between items-center mb-2">
//                                                     <div className="font-medium">
//                                                         Lot #{lot.lotNumber} ({lot.docModel})
//                                                     </div>
//                                                     <Button
//                                                         size="icon"
//                                                         variant="ghost"
//                                                         onClick={() => handleRemoveLot(lot._id)}
//                                                     >
//                                                         <Trash className="h-4 w-4 text-red-500" />
//                                                     </Button>
//                                                 </div>
//
//                                                 <div className="text-sm text-gray-500 mb-3">
//                                                     Available: {lot.remainingWeight.toFixed(2)}kg
//                                                 </div>
//
//                                                 <div className="flex items-center gap-2">
//                                                     <Label htmlFor={`quantity-${lot._id}`} className="whitespace-nowrap">
//                                                         Quantity (kg):
//                                                     </Label>
//                                                     <Input
//                                                         id={`quantity-${lot._id}`}
//                                                         type="number"
//                                                         min="0.01"
//                                                         step="0.01"
//                                                         max={lot.remainingWeight}
//                                                         value={quantityMap[lot._id] || ''}
//                                                         onChange={(e) => handleQuantityChange(lot._id, e.target.value)}
//                                                         className="max-w-36"
//                                                     />
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </ScrollArea>
//
//                                     <Separator className="my-4" />
//
//                                     <Dialog>
//                                         <DialogTrigger asChild>
//                                             <Button className="w-full">
//                                                 Preview Shipment
//                                             </Button>
//                                         </DialogTrigger>
//                                         <DialogContent className="max-w-3xl">
//                                             <DialogHeader>
//                                                 <DialogTitle>Shipment Preview</DialogTitle>
//                                                 <DialogDescription>
//                                                     Review the details before creating the shipment
//                                                 </DialogDescription>
//                                             </DialogHeader>
//
//                                             <ShipmentPreview
//                                                 selectedLots={selectedLots}
//                                                 quantityMap={quantityMap}
//                                             />
//
//                                             <DialogFooter>
//                                                 <Button type="submit" onClick={() => toast({
//                                                     title: "Feature in progress",
//                                                     description: "Shipment creation will be implemented in the next phase."
//                                                 })}>
//                                                     Create Shipment
//                                                 </Button>
//                                             </DialogFooter>
//                                         </DialogContent>
//                                     </Dialog>
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default ShipmentCreationPage;



import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Check, ChevronDown, Edit, Plus, Save, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ShipmentPreview from './ShipmentPreview';
import { useToast } from "@/hooks/use-toast.js";
import { useParams, useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;

const ShipmentManagementPage = () => {
    const { toast } = useToast();
    const { model, shipmentId } = useParams();
    const navigate = useNavigate();
    const [availableLots, setAvailableLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLots, setSelectedLots] = useState([]);
    const [currentEntry, setCurrentEntry] = useState(null);
    const [entries, setEntries] = useState([]);
    const [quantityMap, setQuantityMap] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [existingLotShipments, setExistingLotShipments] = useState([]);
    const [editingLotShipment, setEditingLotShipment] = useState(null);

    // Determine if we're editing an existing shipment or creating a new one
    useEffect(() => {
        if (shipmentId) {
            setIsEditMode(true);
            fetchExistingShipmentData();
        }
    }, [shipmentId]);

    // Fetch existing shipment data if in edit mode
    const fetchExistingShipmentData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}lot-shipments/shipment/${shipmentId}`);
            const data = await response.json();

            if (data.success) {
                const lotShipments = data.data;
                setExistingLotShipments(lotShipments);

                // Pre-populate selected lots and quantities from existing lot shipments
                const existingLots = lotShipments.map(ls => ls.lotId);
                setSelectedLots(existingLots);

                // Create quantity map from existing lot shipments
                const qMap = {};
                lotShipments.forEach(ls => {
                    qMap[ls.lotId._id] = ls.weight;
                });
                setQuantityMap(qMap);

                toast({
                    title: "Shipment loaded",
                    description: `Loaded shipment with ${lotShipments.length} lots`,
                });
            }
        } catch (error) {
            toast({
                title: "Error loading shipment",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch available lots on component mount
    useEffect(() => {
        const fetchAvailableLots = async () => {
            try {
                const response = await fetch(`${BASE_URL}lots/available/${model}`);
                const data = await response.json();

                if (data.status === 'success') {
                    setAvailableLots(data.data.lots);

                    // Group lots by entry
                    const entriesMap = {};
                    data.data.lots.forEach(lot => {
                        if (!entriesMap[lot.entry._id]) {
                            entriesMap[lot.entry._id] = {
                                ...lot.entry,
                                lots: []
                            };
                        }
                        entriesMap[lot.entry._id].lots.push(lot);
                    });

                    setEntries(Object.values(entriesMap));
                }
            } catch (error) {
                toast({
                    title: "Error fetching lots",
                    description: error.message,
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableLots();
    }, [toast, model]);

    const handleSelectEntry = (entry) => {
        setCurrentEntry(entry);
    };

    const handleAddLotToShipment = (lot) => {
        // Initialize with max available quantity
        if (!quantityMap[lot._id]) {
            setQuantityMap(prev => ({
                ...prev,
                [lot._id]: lot.remainingWeight
            }));
        }

        // Add lot to selected lots if not already there
        if (!selectedLots.find(l => l._id === lot._id)) {
            setSelectedLots(prev => [...prev, lot]);
        }
    };

    const handleRemoveLot = (lotId) => {
        setSelectedLots(prev => prev.filter(lot => lot._id !== lotId));

        // Also remove from quantity map
        const newQuantityMap = {...quantityMap};
        delete newQuantityMap[lotId];
        setQuantityMap(newQuantityMap);
    };

    const handleQuantityChange = (lotId, value) => {
        const lot = availableLots.find(l => l._id === lotId);
        const numValue = parseFloat(value);

        // Validate that quantity is not more than available
        if (numValue > lot.remainingWeight) {
            toast({
                title: "Invalid quantity",
                description: `Cannot exceed available amount of ${lot.remainingWeight}kg`,
                variant: "destructive"
            });
            return;
        }

        setQuantityMap(prev => ({
            ...prev,
            [lotId]: numValue
        }));
    };

    const findLotShipmentById = (lotId) => {
        return existingLotShipments.find(ls => ls.lotId._id === lotId);
    };

    const handleUpdateLotShipment = async (lotId) => {
        try {
            const lotShipment = findLotShipmentById(lotId);
            if (!lotShipment) {
                toast({
                    title: "Error",
                    description: "Lot shipment not found",
                    variant: "destructive"
                });
                return;
            }

            const response = await fetch(`${BASE_URL}lot-shipments/${lotShipment._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    weight: quantityMap[lotId]
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Update the existing lot shipment in state
                setExistingLotShipments(prev =>
                    prev.map(ls => ls.lotId._id === lotId ? data.data : ls)
                );

                toast({
                    title: "Success",
                    description: "Lot shipment updated successfully",
                });

                // Reset editing state
                setEditingLotShipment(null);
            } else {
                throw new Error(data.message || "Failed to update lot shipment");
            }
        } catch (error) {
            toast({
                title: "Error updating lot shipment",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    const handleDeleteLotShipment = async (lotId) => {
        try {
            const lotShipment = findLotShipmentById(lotId);
            if (!lotShipment) {
                toast({
                    title: "Error",
                    description: "Lot shipment not found",
                    variant: "destructive"
                });
                return;
            }

            const response = await fetch(`${BASE_URL}lot-shipments/${lotShipment._id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                // Remove the lot shipment from state
                setExistingLotShipments(prev =>
                    prev.filter(ls => ls.lotId._id !== lotId)
                );

                // Also remove from selected lots and quantity map
                handleRemoveLot(lotId);

                toast({
                    title: "Success",
                    description: "Lot shipment deleted successfully",
                });
            } else {
                throw new Error(data.message || "Failed to delete lot shipment");
            }
        } catch (error) {
            toast({
                title: "Error deleting lot shipment",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    const handleCreateShipment = async () => {
        try {
            // Implementation would depend on your shipment creation API
            // console.log(selectedLots);
            const lotShips = selectedLots.map(ls => {
                return {
                    shipment: shipmentId,
                    lotId: ls._id,
                    weight: quantityMap[ls._id]
                }
            })
            const response = await fetch(`${BASE_URL}lot-shipments/create-update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    entries: lotShips
                })
            })
            const data = await response.json();
            if (data.success) {
                toast({
                    title: "Success",
                    description: "Shipment updated successfully",
                });
            }
            navigate('/shipments');
        } catch (error) {
            toast({
                title: "Error creating shipment",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">
                {isEditMode ? "Edit Shipment" : "Create New Shipment"}
            </h1>

            {isEditMode && (
                <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        You are editing an existing shipment. Changes will update the shipment in the database.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Entries and Lots Selection */}
                <div className="lg:col-span-2">
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Select Entry and Lots</CardTitle>
                            <CardDescription>
                                Choose an entry to view its available lots
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                {entries.map(entry => (
                                    <Card
                                        key={entry._id}
                                        className={`cursor-pointer hover:border-blue-500 transition-colors ${currentEntry?._id === entry._id ? 'border-2 border-blue-500' : ''}`}
                                        onClick={() => handleSelectEntry(entry)}
                                    >
                                        <CardHeader className="p-4">
                                            <CardTitle className="text-lg">{entry.model.toUpperCase()} - {entry.mineralType}</CardTitle>
                                            <CardDescription>
                                                {entry.beneficiary || 'No beneficiary'} <br />
                                                {entry.supplyDate ? formatDate(entry.supplyDate) : 'No date'}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <Badge>{entry.lots.length} lot(s)</Badge>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {currentEntry && (
                                <div>
                                    <h3 className="text-lg font-medium mb-3">Available Lots for Selected Entry</h3>
                                    <ScrollArea className="h-96">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Lot #</TableHead>
                                                    <TableHead>Weight In (kg)</TableHead>
                                                    <TableHead>Weight Out (kg)</TableHead>
                                                    <TableHead>Grade</TableHead>
                                                    <TableHead>Available (kg)</TableHead>
                                                    <TableHead>Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {currentEntry.lots.map(lot => (
                                                    <TableRow key={lot._id}>
                                                        <TableCell>{lot.lotNumber}</TableCell>
                                                        <TableCell>{lot.weightIn}</TableCell>
                                                        <TableCell>{lot.weightOut || '-'}</TableCell>
                                                        <TableCell>{lot.mineralGrade || '-'}</TableCell>
                                                        <TableCell className="font-medium">{lot.remainingWeight.toFixed(2)}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleAddLotToShipment(lot)}
                                                                disabled={selectedLots.some(l => l._id === lot._id)}
                                                            >
                                                                <Plus className="h-4 w-4 mr-1" /> Add
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Selected Lots */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Selected Lots for Shipment</CardTitle>
                            <CardDescription>
                                {selectedLots.length} lot(s) selected
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {selectedLots.length === 0 ? (
                                <div className="text-center p-4 text-gray-500">
                                    No lots selected yet. Select lots from the left panel.
                                </div>
                            ) : (
                                <div>
                                    <ScrollArea className="h-64 mb-4">
                                        {selectedLots.map(lot => {
                                            const isExistingLot = isEditMode && findLotShipmentById(lot._id);
                                            const isEditing = editingLotShipment === lot._id;

                                            return (
                                                <div key={lot._id} className="mb-4 p-3 border rounded-md">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="font-medium">
                                                            Lot #{lot.lotNumber} ({lot.docModel})
                                                            {isExistingLot && (
                                                                <Badge variant="outline" className="ml-2">
                                                                    Existing
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {isEditMode && isExistingLot ? (
                                                                <>
                                                                    {isEditing ? (
                                                                        <Button
                                                                            size="icon"
                                                                            variant="outline"
                                                                            onClick={() => handleUpdateLotShipment(lot._id)}
                                                                        >
                                                                            <Save className="h-4 w-4 text-green-500" />
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            size="icon"
                                                                            variant="outline"
                                                                            onClick={() => setEditingLotShipment(lot._id)}
                                                                        >
                                                                            <Edit className="h-4 w-4 text-blue-500" />
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        onClick={() => handleDeleteLotShipment(lot._id)}
                                                                    >
                                                                        <Trash className="h-4 w-4 text-red-500" />
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() => handleRemoveLot(lot._id)}
                                                                >
                                                                    <Trash className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="text-sm text-gray-500 mb-3">
                                                        Available: {lot.remainingWeight?.toFixed(2)}kg
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Label htmlFor={`quantity-${lot._id}`} className="whitespace-nowrap">
                                                            Quantity (kg):
                                                        </Label>
                                                        <Input
                                                            id={`quantity-${lot._id}`}
                                                            type="number"
                                                            min="0.01"
                                                            step="0.01"
                                                            max={lot.remainingWeight}
                                                            value={quantityMap[lot._id] || ''}
                                                            onChange={(e) => handleQuantityChange(lot._id, e.target.value)}
                                                            className="max-w-36"
                                                            disabled={isEditMode && isExistingLot && !isEditing}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </ScrollArea>

                                    <Separator className="my-4" />

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="w-full">
                                                Preview Shipment
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl">
                                            <DialogHeader>
                                                <DialogTitle>Shipment Preview</DialogTitle>
                                                <DialogDescription>
                                                    Review the details before {isEditMode ? "updating" : "creating"} the shipment
                                                </DialogDescription>
                                            </DialogHeader>

                                            <ShipmentPreview
                                                selectedLots={selectedLots}
                                                quantityMap={quantityMap}
                                            />

                                            <DialogFooter>
                                                <Button type="submit" onClick={handleCreateShipment}>
                                                    {isEditMode ? "Update Shipment" : "Create Shipment"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ShipmentManagementPage;