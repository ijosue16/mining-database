import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Plus, Trash2, Loader2} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {useToast} from "@/hooks/use-toast.js";
import {useUpdateEntryMutation, useCreateLotsMutation} from "@/states/apislice.js";
import FetchingPage from "@/Pages/FetchingPage.jsx";
import {message} from "antd";
import {capitalizeFirstLetter} from "@/components/helperFunctions.js";
import {Badge} from "@/components/ui/badge.jsx";

// [{entry: entryId, lotNumber: "", weightOut: "", weightIn: "", _id: null, docModel: capitalizeFirstLetter(model)}]

const LotManagementDialog = ({
                                 entryId,
                                 model,
                                 existingTotalWeightIn,
                                 initialLots = []
                             }) => {
    const [open, setOpen] = useState(false);
    const [lots, setLots] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {toast} = useToast();

    const [updateEntry, {
        isSuccess,
        isLoading,
        isError,
        error
    }] = useUpdateEntryMutation();

    const [createAndUpdateLots, {
        isSuccess: isCreateDone,
        isLoading: isCreating,
        isError: isCreateError,
        error: createError
    }] = useCreateLotsMutation();

    // Initialize lots when the dialog opens or initialLots changes
    // useEffect(() => {
    //     // Deep clone the initialLots to avoid reference issues
    //     // This ensures we're working with a completely new object that's fully extensible
    //     const lotsClone = initialLots.map(lot => ({...lot}));
    //     setLots(lotsClone);
    // }, [open, initialLots]);

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: "Success",
                description: "Lot information has been saved successfully.",
            });
        }
        if (isError) {
            toast({
                title: "Error",
                description: error.data?.message,
                variant: "destructive"
            });
        }
        if (isCreateDone) {
            toast({
                title: "Success",
                description: "Lot information has been saved successfully.",
            });
        }
        if (isCreateError) {
            toast({
                title: "Error",
                description: createError.data?.message,
                variant: "destructive"
            });
        }
    }, [isSuccess, isError, error, isCreateDone, isCreateError, createError, toast]);

    const handleLotChange = (index, field, value) => {
        // Create a new array with new object references to ensure extensibility
        const updatedLots = lots.map((lot, i) => {
            if (i === index) {
                // Create a new object with the updated field
                return {...lot, [field]: value};
            }
            return {...lot}; // Return a new object reference for other items too
        });
        setLots(updatedLots);
    };

    const addLot = () => {
        // Create a new lot with all required properties pre-defined
        const newLot = {
            entry: entryId,
            lotNumber: "",
            weightOut: "",
            weightIn: "",
            beneficiary: "",
            _id: null,
            docModel: capitalizeFirstLetter(model)
        };
        setLots([...lots, newLot]);
    };

    const removeLot = (index) => {
        if (lots.length > 1) {
            const updatedLots = [...lots];
            updatedLots.splice(index, 1);
            setLots(updatedLots);
        }
    };

    const handleSubmit = async () => {
        // Validate lots
        const hasEmptyFields = lots.some(lot => !lot.lotNumber || !lot.weightOut);

        if (hasEmptyFields) {
            toast({
                title: "Validation Error",
                description: "Please fill in all lot number and weight fields.",
                variant: "destructive"
            });
            return;
        }


        setIsSubmitting(true);

        try {
            // API call to save the lots
            // Make sure we're sending extensible objects
            const totalWeightIn = lots.reduce((previousValue, currentValue) => {
                return previousValue + parseFloat(currentValue.weightOut);
            }, 0);

            if (existingTotalWeightIn < totalWeightIn) {
                toast({
                    title: "Error",
                    description: `Total weightIn ${totalWeightIn} cannot be greater than original weightIn ${existingTotalWeightIn}`,
                    variant: "destructive"
                });
                return;
            }
            const lotsToSubmit = lots.map(lot => ({...lot}));
            // console.log('lots', lotsToSubmit);
            // console.log('lots', lotsToSubmit);
            // console.log('LOTS', lotsToSubmit, model);
            await createAndUpdateLots({body: {lots: lotsToSubmit, model}});
            // await updateEntry({ entryId, body: {output: lotsToSubmit}, model });
            setOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save lot information. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        // Deep clone initialLots to ensure extensibility
        const lotsClone = initialLots.map(lot => ({...lot}));
        setLots(lotsClone);
    };

    if (isCreating || isLoading) return <FetchingPage/>

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (isOpen) {
                // Deep clone initialLots to ensure extensibility
                const lotsClone = initialLots.map(lot => ({...lot}));
                setLots(lotsClone);
            }
        }}>
            <DialogTrigger asChild>
                <Button variant="outline">Manage Lots</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Manage Lots</DialogTitle>
                    <DialogDescription>
                        Add, update, or remove lots. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative my-4">
                    <Separator className="absolute w-full"/>
                    <span className="absolute -top-3 left-2 px-2 bg-white font-medium text-xs">
                        Lot Details
                        <Badge>Total WeightIn: {existingTotalWeightIn} Kgs</Badge>
                    </span>
                </div>

                <div className="max-h-96 overflow-y-auto pr-1">
                    <div className="space-y-4">
                        {lots.map((lot, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-md font-semibold text-slate-700 text-sm">
                                    {index + 1}
                                </div>

                                <div className="grid grid-cols-4 gap-3 flex-1">
                                    <div>
                                        <Label htmlFor={`lotNumber-${index}`} className="text-xs mb-1 block">Lot
                                            Number</Label>
                                        <Input
                                            id={`lotNumber-${index}`}
                                            type="number"
                                            value={lot.lotNumber}
                                            onChange={(e) => handleLotChange(index, "lotNumber", e.target.value)}
                                            className="w-full"
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`weightIn-${index}`} className="text-xs mb-1 block">Weight
                                            In</Label>
                                        <Input
                                            id={`weightIn-${index}`}
                                            type="number"
                                            value={lot.weightIn}
                                            onChange={(e) => handleLotChange(index, "weightIn", e.target.value)}
                                            className="w-full"
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`weightOut-${index}`} className="text-xs mb-1 block">Weight
                                            Out</Label>
                                        <Input
                                            id={`weightOut-${index}`}
                                            type="number"
                                            value={lot.weightOut}
                                            onChange={(e) => {
                                                if (lot.weightIn && parseFloat(e.target.value) > parseFloat(lot.weightIn)) {
                                                    return message.error(`Weight out cannot be greater than weight In ${lot.weightIn}`);
                                                }
                                                handleLotChange(index, "weightOut", e.target.value)
                                            }}
                                            className="w-full"
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`beneficiary-${index}`}
                                               className="text-xs mb-1 block">Beneficiary</Label>
                                        <Input
                                            id={`beneficiary-${index}`}
                                            type="text"
                                            value={lot.beneficiary}
                                            onChange={(e) => handleLotChange(index, "beneficiary", e.target.value)}
                                            className="w-full"
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </div>
                                </div>


                                {
                                    !lot._id && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => removeLot(index)}
                                            disabled={lots.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    )
                                }

                            </div>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        className="w-full border-dashed gap-2 mt-4"
                        onClick={addLot}
                    >
                        <Plus className="h-4 w-4"/>
                        Add Lot
                    </Button>
                </div>

                <DialogFooter className="flex items-center justify-between sm:justify-between mt-4">
                    <Button variant="outline" onClick={resetForm} disabled={isSubmitting || isLoading}>
                        Reset
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
                        {isSubmitting || isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LotManagementDialog;


// import React, {useEffect, useState} from "react";
// import {Input} from "@/components/ui/input";
// import {Button} from "@/components/ui/button";
// import {Card, CardContent} from "@/components/ui/card";
// import {Plus, Trash2, Loader2} from "lucide-react";
// import {Separator} from "@/components/ui/separator";
// import {Label} from "@/components/ui/label";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//     Tabs,
//     TabsContent,
//     TabsList,
//     TabsTrigger,
// } from "@/components/ui/tabs";
// import {useToast} from "@/hooks/use-toast.js";
// import {useUpdateEntryMutation, useCreateLotsMutation} from "@/states/apislice.js";
// import FetchingPage from "@/Pages/FetchingPage.jsx";
// import {message} from "antd";
// import {capitalizeFirstLetter} from "@/components/helperFunctions.js";
//
// const LotManagementDialog = ({
//                                  entryId,
//                                  model,
//                                  initialLots = []
//                              }) => {
//     const [open, setOpen] = useState(false);
//     const [activeTab, setActiveTab] = useState("cassiterite");
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const {toast} = useToast();
//
//     // For mixed type, we'll have separate arrays for cassiterite and coltan lots
//     const [cassiteriteLots, setCassiteriteLots] = useState([]);
//     const [coltanLots, setColtanLots] = useState([]);
//     // For non-mixed types, we'll use the original lots array
//     const [regularLots, setRegularLots] = useState([]);
//
//     const isMixed = model === "mixed";
//
//     const [updateEntry, {
//         isSuccess,
//         isLoading,
//         isError,
//         error
//     }] = useUpdateEntryMutation();
//
//     const [createAndUpdateLots, {
//         isSuccess: isCreateDone,
//         isLoading: isCreating,
//         isError: isCreateError,
//         error: createError
//     }] = useCreateLotsMutation();
//
//     useEffect(() => {
//         if (isSuccess || isCreateDone) {
//             toast({
//                 title: "Success",
//                 description: "Lot information has been saved successfully.",
//             });
//         }
//
//         if (isError) {
//             toast({
//                 title: "Error",
//                 description: error.data?.message,
//                 variant: "destructive"
//             });
//         }
//
//         if (isCreateError) {
//             toast({
//                 title: "Error",
//                 description: createError.data?.message,
//                 variant: "destructive"
//             });
//         }
//     }, [isSuccess, isError, error, isCreateDone, isCreateError, createError, toast]);
//
//     // Initialize lots when the dialog opens
//     useEffect(() => {
//         if (!open) return;
//
//         if (isMixed) {
//             // Filter initial lots by model type
//             const casLots = initialLots
//                 .filter(lot => lot.docModel === "Cassiterite")
//                 .map(lot => ({...lot})) || [];
//
//             const colLots = initialLots
//                 .filter(lot => lot.docModel === "Coltan")
//                 .map(lot => ({...lot})) || [];
//
//             // If no lots exist yet, create default lots
//             if (casLots.length === 0) {
//                 setCassiteriteLots([{
//                     entry: entryId,
//                     lotNumber: "",
//                     weightOut: "",
//                     weightIn: "",
//                     _id: null,
//                     docModel: "Cassiterite"
//                 }]);
//             } else {
//                 setCassiteriteLots(casLots);
//             }
//
//             if (colLots.length === 0) {
//                 setColtanLots([{
//                     entry: entryId,
//                     lotNumber: "",
//                     weightOut: "",
//                     weightIn: "",
//                     _id: null,
//                     docModel: "Coltan"
//                 }]);
//             } else {
//                 setColtanLots(colLots);
//             }
//         } else {
//             // For non-mixed types, initialize regular lots
//             if (initialLots.length > 0) {
//                 setRegularLots(initialLots.map(lot => ({...lot})));
//             } else {
//                 setRegularLots([{
//                     entry: entryId,
//                     lotNumber: "",
//                     weightOut: "",
//                     weightIn: "",
//                     _id: null,
//                     docModel: capitalizeFirstLetter(model)
//                 }]);
//             }
//         }
//     }, [open, initialLots, entryId, model, isMixed]);
//
//     const handleLotChange = (index, field, value, lotType = null) => {
//         if (isMixed) {
//             if (lotType === "cassiterite" || (lotType === null && activeTab === "cassiterite")) {
//                 const updatedLots = cassiteriteLots.map((lot, i) => {
//                     if (i === index) {
//                         return {...lot, [field]: value};
//                     }
//                     return {...lot};
//                 });
//                 setCassiteriteLots(updatedLots);
//             } else {
//                 const updatedLots = coltanLots.map((lot, i) => {
//                     if (i === index) {
//                         return {...lot, [field]: value};
//                     }
//                     return {...lot};
//                 });
//                 setColtanLots(updatedLots);
//             }
//         } else {
//             const updatedLots = regularLots.map((lot, i) => {
//                 if (i === index) {
//                     return {...lot, [field]: value};
//                 }
//                 return {...lot};
//             });
//             setRegularLots(updatedLots);
//         }
//     };
//
//     const addLot = (lotType = null) => {
//         if (isMixed) {
//             if (lotType === "cassiterite" || (lotType === null && activeTab === "cassiterite")) {
//                 const newLot = {
//                     entry: entryId,
//                     lotNumber: "",
//                     weightOut: "",
//                     weightIn: "",
//                     _id: null,
//                     docModel: "Cassiterite"
//                 };
//                 setCassiteriteLots([...cassiteriteLots, newLot]);
//             } else {
//                 const newLot = {
//                     entry: entryId,
//                     lotNumber: "",
//                     weightOut: "",
//                     weightIn: "",
//                     _id: null,
//                     docModel: "Coltan"
//                 };
//                 setColtanLots([...coltanLots, newLot]);
//             }
//         } else {
//             const newLot = {
//                 entry: entryId,
//                 lotNumber: "",
//                 weightOut: "",
//                 weightIn: "",
//                 _id: null,
//                 docModel: capitalizeFirstLetter(model)
//             };
//             setRegularLots([...regularLots, newLot]);
//         }
//     };
//
//     const removeLot = (index, lotType = null) => {
//         if (isMixed) {
//             if (lotType === "cassiterite" || (lotType === null && activeTab === "cassiterite")) {
//                 if (cassiteriteLots.length > 1) {
//                     const updatedLots = [...cassiteriteLots];
//                     updatedLots.splice(index, 1);
//                     setCassiteriteLots(updatedLots);
//                 }
//             } else {
//                 if (coltanLots.length > 1) {
//                     const updatedLots = [...coltanLots];
//                     updatedLots.splice(index, 1);
//                     setColtanLots(updatedLots);
//                 }
//             }
//         } else {
//             if (regularLots.length > 1) {
//                 const updatedLots = [...regularLots];
//                 updatedLots.splice(index, 1);
//                 setRegularLots(updatedLots);
//             }
//         }
//     };
//
//     const validateLots = (lots) => {
//         return lots.some(lot => !lot.lotNumber || !lot.weightOut);
//     };
//
//     const handleSubmit = async () => {
//         let hasEmptyFields = false;
//         let lotsToSubmit = [];
//
//         if (isMixed) {
//             // Validate both cassiterite and coltan lots
//             hasEmptyFields = validateLots(cassiteriteLots) || validateLots(coltanLots);
//
//             // Combine both types of lots for submission
//             lotsToSubmit = [...cassiteriteLots.map(lot => ({...lot})), ...coltanLots.map(lot => ({...lot}))];
//         } else {
//             // Validate regular lots
//             hasEmptyFields = validateLots(regularLots);
//             lotsToSubmit = regularLots.map(lot => ({...lot}));
//         }
//
//         if (hasEmptyFields) {
//             toast({
//                 title: "Validation Error",
//                 description: "Please fill in all lot number and weight fields.",
//                 variant: "destructive"
//             });
//             return;
//         }
//
//         setIsSubmitting(true);
//
//         try {
//             await createAndUpdateLots({body: {lots: lotsToSubmit, model}});
//             setOpen(false);
//         } catch (error) {
//             toast({
//                 title: "Error",
//                 description: "Failed to save lot information. Please try again.",
//                 variant: "destructive"
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//
//     const resetForm = () => {
//         if (isMixed) {
//             // Reset to initial state or default values
//             const casLots = initialLots
//                 .filter(lot => lot.docModel === "Cassiterite")
//                 .map(lot => ({...lot})) || [];
//
//             const colLots = initialLots
//                 .filter(lot => lot.docModel === "Coltan")
//                 .map(lot => ({...lot})) || [];
//
//             if (casLots.length === 0) {
//                 setCassiteriteLots([{
//                     entry: entryId,
//                     lotNumber: "",
//                     weightOut: "",
//                     weightIn: "",
//                     _id: null,
//                     docModel: "Cassiterite"
//                 }]);
//             } else {
//                 setCassiteriteLots(casLots);
//             }
//
//             if (colLots.length === 0) {
//                 setColtanLots([{
//                     entry: entryId,
//                     lotNumber: "",
//                     weightOut: "",
//                     weightIn: "",
//                     _id: null,
//                     docModel: "Coltan"
//                 }]);
//             } else {
//                 setColtanLots(colLots);
//             }
//         } else {
//             // Reset regular lots
//             if (initialLots.length > 0) {
//                 setRegularLots(initialLots.map(lot => ({...lot})));
//             } else {
//                 setRegularLots([{
//                     entry: entryId,
//                     lotNumber: "",
//                     weightOut: "",
//                     weightIn: "",
//                     _id: null,
//                     docModel: capitalizeFirstLetter(model)
//                 }]);
//             }
//         }
//     };
//
//     const renderLotFields = (lot, index, lotType = null) => (
//         <div key={index} className="flex items-center gap-3">
//             <div
//                 className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-md font-semibold text-slate-700 text-sm">
//                 {index + 1}
//             </div>
//
//             <div className="grid grid-cols-3 gap-3 flex-1">
//                 <div>
//                     <Label htmlFor={`lotNumber-${index}-${lotType || model}`} className="text-xs mb-1 block">
//                         Lot Number
//                     </Label>
//                     <Input
//                         id={`lotNumber-${index}-${lotType || model}`}
//                         type="number"
//                         value={lot.lotNumber}
//                         onChange={(e) => handleLotChange(index, "lotNumber", e.target.value, lotType)}
//                         className="w-full"
//                         onWheel={(e) => e.target.blur()}
//                     />
//                 </div>
//
//                 <div>
//                     <Label htmlFor={`weightIn-${index}-${lotType || model}`} className="text-xs mb-1 block">
//                         Weight In
//                     </Label>
//                     <Input
//                         id={`weightIn-${index}-${lotType || model}`}
//                         type="number"
//                         value={lot.weightIn}
//                         onChange={(e) => handleLotChange(index, "weightIn", e.target.value, lotType)}
//                         className="w-full"
//                         onWheel={(e) => e.target.blur()}
//                     />
//                 </div>
//
//                 <div>
//                     <Label htmlFor={`weightOut-${index}-${lotType || model}`} className="text-xs mb-1 block">
//                         Weight Out
//                     </Label>
//                     <Input
//                         id={`weightOut-${index}-${lotType || model}`}
//                         type="number"
//                         value={lot.weightOut}
//                         onChange={(e) => {
//                             if (lot.weightIn && parseFloat(e.target.value) > parseFloat(lot.weightIn)) {
//                                 return message.error(`Weight out cannot be greater than weight In ${lot.weightIn}`);
//                             }
//                             handleLotChange(index, "weightOut", e.target.value, lotType);
//                         }}
//                         className="w-full"
//                         onWheel={(e) => e.target.blur()}
//                     />
//                 </div>
//             </div>
//
//             {!lot._id && (
//                 <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
//                     onClick={() => removeLot(index, lotType)}
//                     disabled={(isMixed ?
//                         (lotType === "cassiterite" || activeTab === "cassiterite") ? cassiteriteLots.length === 1 : coltanLots.length === 1
//                         : regularLots.length === 1)}
//                 >
//                     <Trash2 className="h-4 w-4"/>
//                 </Button>
//             )}
//         </div>
//     );
//
//     if (isCreating || isLoading) return <FetchingPage/>;
//
//     return (
//         <Dialog open={open} onOpenChange={(isOpen) => {
//             setOpen(isOpen);
//             // Reset form when dialog opens
//             if (isOpen) {
//                 resetForm();
//             }
//         }}>
//             <DialogTrigger asChild>
//                 <Button variant="outline">Manage Lots</Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md md:max-w-lg">
//                 <DialogHeader>
//                     <DialogTitle>Manage Lots</DialogTitle>
//                     <DialogDescription>
//                         {isMixed
//                             ? "Add, update, or remove lots for both Cassiterite and Coltan minerals."
//                             : "Add, update, or remove lots. Click save when you're done."}
//                     </DialogDescription>
//                 </DialogHeader>
//
//                 {isMixed ? (
//                     <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                         <TabsList className="grid grid-cols-2 mb-4">
//                             <TabsTrigger value="cassiterite">Cassiterite</TabsTrigger>
//                             <TabsTrigger value="coltan">Coltan</TabsTrigger>
//                         </TabsList>
//
//                         <TabsContent value="cassiterite">
//                             <div className="relative my-4">
//                                 <Separator className="absolute w-full"/>
//                                 <span className="absolute -top-3 left-2 px-2 bg-white font-medium text-xs">
//                                     Cassiterite Lot Details
//                                 </span>
//                             </div>
//
//                             <div className="max-h-80 overflow-y-auto pr-1">
//                                 <div className="space-y-4">
//                                     {cassiteriteLots.map((lot, index) => renderLotFields(lot, index, "cassiterite"))}
//                                 </div>
//
//                                 <Button
//                                     variant="outline"
//                                     className="w-full border-dashed gap-2 mt-4"
//                                     onClick={() => addLot("cassiterite")}
//                                 >
//                                     <Plus className="h-4 w-4"/>
//                                     Add Cassiterite Lot
//                                 </Button>
//                             </div>
//                         </TabsContent>
//
//                         <TabsContent value="coltan">
//                             <div className="relative my-4">
//                                 <Separator className="absolute w-full"/>
//                                 <span className="absolute -top-3 left-2 px-2 bg-white font-medium text-xs">
//                   Coltan Lot Details
//                 </span>
//                             </div>
//
//                             <div className="max-h-80 overflow-y-auto pr-1">
//                                 <div className="space-y-4">
//                                     {coltanLots.map((lot, index) => renderLotFields(lot, index, "coltan"))}
//                                 </div>
//
//                                 <Button
//                                     variant="outline"
//                                     className="w-full border-dashed gap-2 mt-4"
//                                     onClick={() => addLot("coltan")}
//                                 >
//                                     <Plus className="h-4 w-4"/>
//                                     Add Coltan Lot
//                                 </Button>
//                             </div>
//                         </TabsContent>
//                     </Tabs>
//                 ) : (
//                     <>
//                         <div className="relative my-4">
//                             <Separator className="absolute w-full"/>
//                             <span className="absolute -top-3 left-2 px-2 bg-white font-medium text-xs">
//                 {capitalizeFirstLetter(model)} Lot Details
//               </span>
//                         </div>
//
//                         <div className="max-h-80 overflow-y-auto pr-1">
//                             <div className="space-y-4">
//                                 {regularLots.map((lot, index) => renderLotFields(lot, index))}
//                             </div>
//
//                             <Button
//                                 variant="outline"
//                                 className="w-full border-dashed gap-2 mt-4"
//                                 onClick={addLot}
//                             >
//                                 <Plus className="h-4 w-4"/>
//                                 Add Lot
//                             </Button>
//                         </div>
//                     </>
//                 )}
//
//                 <DialogFooter className="flex items-center justify-between sm:justify-between mt-4">
//                     <Button variant="outline" onClick={resetForm} disabled={isSubmitting || isLoading}>
//                         Reset
//                     </Button>
//                     <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
//                         {isSubmitting || isLoading ? (
//                             <>
//                                 <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving
//                             </>
//                         ) : (
//                             "Save Changes"
//                         )}
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };
//
// export default LotManagementDialog;