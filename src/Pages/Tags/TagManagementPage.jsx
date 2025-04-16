


// import React, {useEffect, useState} from "react";
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger
// } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Plus, Minus } from "lucide-react";
// import {useToast} from "@/hooks/use-toast.js";
// import {useParams} from "react-router-dom";
// import {  useGetListTagsQuery, useCreateAndUpdateTagsMutation, useDeleteTagMutation } from '@/states/apislice.js';
//
//
// const TagManagementPage = () => {
//     const { entryId } = useParams();
//     const { toast } = useToast();
//
//     const { data, isLoading, isSuccess } = useGetListTagsQuery(
//         {query: `entryId=${entryId}`}
//     );
//
//     const [tags, setTags] = useState([]);
//     const [createAndUpdateTags, { isSuccess: isCreateUpdateDone, isLoading: isCreateUpdating, isError: isCreateUpdateError, error: createUpdateError }] = useCreateAndUpdateTagsMutation();
//     const [deleteTag, {isSuccess: isDeleteDone, isLoading: isDeleting, isError: isDeleteError, error: deleteError}] = useDeleteTagMutation();
//
//
//     useEffect(() => {
//         if (isSuccess) {
//             const { tags } = data.data;
//             setTags(tags);
//             console.log(tags);
//         }
//     }, [isSuccess, data]);
//
//     const [state, setState] = useState({
//         initialMineTags: {
//             sheetNumber: "",
//             weight: "",
//             tagNumber: "",
//             limit: ""
//         },
//         mineTags: [{
//             sheetNumber: "",
//             weight: "",
//             tagNumber: "",
//             status: ""
//         }],
//         negociantTags: [{
//             sheetNumber: "",
//             weight: "",
//             tagNumber: "",
//             status: ""
//         }]
//     });
//
//     const [editableFields] = useState([]);
//
//     // Functions for Mine Tags
//     const handleInitialMinetagsEntry = (e) => {
//         const { name, value } = e.target;
//         setState(prev => ({
//             ...prev,
//             initialMineTags: {
//                 ...prev.initialMineTags,
//                 [name]: value
//             }
//         }));
//     };
//
//     const generateTags = () => {
//         const { sheetNumber, tagNumber, weight, limit } = state.initialMineTags;
//
//         if (!sheetNumber || !tagNumber || !weight || !limit) {
//             toast({
//                 variant: "destructive",
//                 title: "Missing information",
//                 description: "Please fill all fields to generate tags."
//             });
//             return;
//         }
//
//         const parsedTagNumber = parseInt(tagNumber, 10);
//         const parsedLimit = parseInt(limit, 10);
//
//         if (isNaN(parsedTagNumber) || isNaN(parsedLimit)) {
//             toast({
//                 variant: "destructive",
//                 title: "Invalid input",
//                 description: "Tag number and limit must be valid numbers."
//             });
//             return;
//         }
//
//         const newTags = Array.from({ length: parsedLimit }, (_, i) => ({
//             sheetNumber,
//             weight,
//             tagNumber: (parsedTagNumber + i).toString(),
//             status: "in store"
//         }));
//
//         setState(prev => ({
//             ...prev,
//             mineTags: newTags
//         }));
//
//         toast({
//             title: "Tags generated",
//             description: `${parsedLimit} tags have been generated successfully.`
//         });
//     };
//
//     const handleMinesTagEntry = (index, e) => {
//         const { name, value } = e.target;
//
//         if (name === "tagNumber" && value.toString().length > 7) {
//             toast({
//                 variant: "warning",
//                 title: "Input limit reached",
//                 description: "Tag number can't be more than seven numbers."
//             });
//             return;
//         }
//
//         if (name === "weight" && parseFloat(value) > 71) {
//             toast({
//                 variant: "warning",
//                 title: "Weight limit exceeded",
//                 description: "Tag weight can't be more than 71 kilograms."
//             });
//             return;
//         }
//
//         const updatedTags = [...state.mineTags];
//         updatedTags[index] = {
//             ...updatedTags[index],
//             [name]: value
//         };
//
//         setState(prev => ({
//             ...prev,
//             mineTags: updatedTags
//         }));
//     };
//
//     const handleAddMinesTag = () => {
//         setState(prev => ({
//             ...prev,
//             mineTags: [
//                 ...prev.mineTags,
//                 { sheetNumber: "", weight: "", tagNumber: "", status: "" }
//             ]
//         }));
//     };
//
//     const handleLRemoveMinesTag = (index) => {
//         if (state.mineTags.length <= 1) return;
//
//         const updatedTags = [...state.mineTags];
//         updatedTags.splice(index, 1);
//
//         setState(prev => ({
//             ...prev,
//             mineTags: updatedTags
//         }));
//     };
//
//     // Functions for Negociant Tags
//     const handleNegociantTagsEntry = (index, e) => {
//         const { name, value } = e.target;
//
//         const updatedTags = [...state.negociantTags];
//         updatedTags[index] = {
//             ...updatedTags[index],
//             [name]: value
//         };
//
//         setState(prev => ({
//             ...prev,
//             negociantTags: updatedTags
//         }));
//     };
//
//     const handleAddNegociantTags = () => {
//         setState(prev => ({
//             ...prev,
//             negociantTags: [
//                 ...prev.negociantTags,
//                 { sheetNumber: "", weight: "", tagNumber: "", status: "" }
//             ]
//         }));
//     };
//
//     const handleLRemoveNegociantTags = (index) => {
//         if (state.negociantTags.length <= 1) return;
//
//         const updatedTags = [...state.negociantTags];
//         updatedTags.splice(index, 1);
//
//         setState(prev => ({
//             ...prev,
//             negociantTags: updatedTags
//         }));
//     };
//
//     const decideEditable = (fieldName) => {
//         return !editableFields.includes(fieldName);
//     };
//
//     return (
//         <div className="container mx-auto p-4 space-y-6">
//             <h1 className="text-2xl font-bold">Tags Management</h1>
//
//             <div className="flex flex-col gap-4">
//                 {/* Mine Tags Generation */}
//                 <Popover>
//                     <PopoverTrigger asChild>
//                         <Button className="w-fit bg-blue-600 hover:bg-blue-700">
//                             Select nbr of tags to enter
//                         </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto">
//                         <div className="space-y-2">
//                             <h3 className="font-medium text-lg">Generate number of tags needed</h3>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div className="space-y-1">
//                                     <Label htmlFor="sheetNumber">Initial sheet number</Label>
//                                     <Input
//                                         id="sheetNumber"
//                                         name="sheetNumber"
//                                         value={state.initialMineTags.sheetNumber || ""}
//                                         onChange={handleInitialMinetagsEntry}
//                                         onWheelCapture={(e) => e.target.blur()}
//                                     />
//                                 </div>
//
//                                 <div className="space-y-1">
//                                     <Label htmlFor="weight">Initial tag weight</Label>
//                                     <Input
//                                         id="weight"
//                                         name="weight"
//                                         value={state.initialMineTags.weight || ""}
//                                         onChange={(e) => {
//                                             if (parseFloat(e.target.value) > 71) {
//                                                 toast({
//                                                     variant: "warning",
//                                                     title: "Weight limit exceeded",
//                                                     description: "Tag weight can't be more than 71 kilograms."
//                                                 });
//                                             } else {
//                                                 handleInitialMinetagsEntry(e);
//                                             }
//                                         }}
//                                         onWheelCapture={(e) => e.target.blur()}
//                                     />
//                                 </div>
//
//                                 <div className="space-y-1">
//                                     <Label htmlFor="tagNumber">Initial tag number</Label>
//                                     <Input
//                                         id="tagNumber"
//                                         name="tagNumber"
//                                         value={state.initialMineTags.tagNumber || ""}
//                                         onChange={(e) => {
//                                             if (e.target.value.toString().length > 7) {
//                                                 toast({
//                                                     variant: "warning",
//                                                     title: "Input limit reached",
//                                                     description: "Tag number can't be more than seven numbers."
//                                                 });
//                                             } else {
//                                                 handleInitialMinetagsEntry(e);
//                                             }
//                                         }}
//                                         onWheelCapture={(e) => e.target.blur()}
//                                     />
//                                 </div>
//
//                                 <div className="space-y-1">
//                                     <Label htmlFor="limit">Tags to be generated</Label>
//                                     <Input
//                                         id="limit"
//                                         name="limit"
//                                         value={state.initialMineTags.limit || ""}
//                                         onChange={handleInitialMinetagsEntry}
//                                         onWheelCapture={(e) => e.target.blur()}
//                                     />
//                                 </div>
//                             </div>
//
//                             <Button className="w-full mt-4 bg-green-500 hover:bg-green-600" onClick={generateTags}>
//                                 Confirm
//                             </Button>
//                         </div>
//                     </PopoverContent>
//                 </Popover>
//
//                 {/* Mine Tags Management */}
//                 <Card className="relative">
//                     <CardHeader className="pb-2">
//                         <CardTitle className="text-lg">Mine Tags (tickets)</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         {state.mineTags.map((tag, index) => (
//                             <Card key={index} className="relative">
//                                 <CardContent className="p-4">
//                                     <div className="flex items-center justify-between mb-4">
//                                         <p className="font-semibold">Mine Tag {index + 1}</p>
//                                         <div className="flex items-center gap-2">
//                                             {state.mineTags.length > 1 && (
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="icon"
//                                                     onClick={() => handleLRemoveMinesTag(index)}
//                                                 >
//                                                     <Minus className="h-4 w-4" />
//                                                 </Button>
//                                             )}
//                                             {index === state.mineTags.length - 1 && (
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="icon"
//                                                     onClick={handleAddMinesTag}
//                                                 >
//                                                     <Plus className="h-4 w-4" />
//                                                 </Button>
//                                             )}
//                                         </div>
//                                     </div>
//
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//                                         <div className="space-y-1">
//                                             <Label htmlFor={`mineSheet-${index}`}>Sheet number</Label>
//                                             <Input
//                                                 id={`mineSheet-${index}`}
//                                                 name="sheetNumber"
//                                                 value={tag.sheetNumber || ""}
//                                                 disabled={editableFields.length > 0 ? decideEditable("mineTags") : false}
//                                                 onChange={(e) => handleMinesTagEntry(index, e)}
//                                                 onWheelCapture={(e) => e.target.blur()}
//                                             />
//                                         </div>
//
//                                         <div className="space-y-1">
//                                             <Label htmlFor={`mineWeight-${index}`}>Tag weight</Label>
//                                             <Input
//                                                 id={`mineWeight-${index}`}
//                                                 name="weight"
//                                                 value={tag.weight || ""}
//                                                 disabled={editableFields.length > 0 ? decideEditable("mineTags") : false}
//                                                 onChange={(e) => handleMinesTagEntry(index, e)}
//                                                 onWheelCapture={(e) => e.target.blur()}
//                                             />
//                                         </div>
//
//                                         <div className="space-y-1">
//                                             <Label htmlFor={`mineTag-${index}`}>Tag number</Label>
//                                             <Input
//                                                 id={`mineTag-${index}`}
//                                                 name="tagNumber"
//                                                 value={tag.tagNumber || ""}
//                                                 disabled={editableFields.length > 0 ? decideEditable("mineTags") : false}
//                                                 onChange={(e) => handleMinesTagEntry(index, e)}
//                                                 onWheelCapture={(e) => e.target.blur()}
//                                             />
//                                         </div>
//
//                                         <div className="space-y-1">
//                                             <Label htmlFor={`mineStatus-${index}`}>Status</Label>
//                                             <Select
//                                                 name="status"
//                                                 disabled={editableFields.length > 0 ? decideEditable("mineTags") : false}
//                                                 value={tag.status || ""}
//                                                 onValueChange={(value) => handleMinesTagEntry(index, { target: { name: "status", value } })}
//                                             >
//                                                 <SelectTrigger>
//                                                     <SelectValue placeholder="Status" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     <SelectItem value="in store">In Store</SelectItem>
//                                                     <SelectItem value="out of store">Out of Store</SelectItem>
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         ))}
//                     </CardContent>
//                 </Card>
//
//                 {/* Negociant Tags Management */}
//                 <Card className="relative">
//                     <CardHeader className="pb-2">
//                         <CardTitle className="text-lg">Negociant Tags (tickets)</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         {state.negociantTags.map((tag, index) => (
//                             <Card key={index} className="relative">
//                                 <CardContent className="p-4">
//                                     <div className="flex items-center justify-between mb-4">
//                                         <p className="font-semibold">Negociant Tag {index + 1}</p>
//                                         <div className="flex items-center gap-2">
//                                             {state.negociantTags.length > 1 && (
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="icon"
//                                                     onClick={() => handleLRemoveNegociantTags(index)}
//                                                 >
//                                                     <Minus className="h-4 w-4" />
//                                                 </Button>
//                                             )}
//                                             {index === state.negociantTags.length - 1 && (
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="icon"
//                                                     onClick={handleAddNegociantTags}
//                                                 >
//                                                     <Plus className="h-4 w-4" />
//                                                 </Button>
//                                             )}
//                                         </div>
//                                     </div>
//
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//                                         <div className="space-y-1">
//                                             <Label htmlFor={`negociantSheet-${index}`}>Sheet number</Label>
//                                             <Input
//                                                 id={`negociantSheet-${index}`}
//                                                 name="sheetNumber"
//                                                 value={tag.sheetNumber || ""}
//                                                 disabled={editableFields.length > 0 ? decideEditable("negociantTags") : false}
//                                                 onChange={(e) => handleNegociantTagsEntry(index, e)}
//                                                 onWheelCapture={(e) => e.target.blur()}
//                                             />
//                                         </div>
//
//                                         <div className="space-y-1">
//                                             <Label htmlFor={`negociantWeight-${index}`}>Tag weight</Label>
//                                             <Input
//                                                 id={`negociantWeight-${index}`}
//                                                 name="weight"
//                                                 value={tag.weight || ""}
//                                                 disabled={editableFields.length > 0 ? decideEditable("negociantTags") : false}
//                                                 onChange={(e) => handleNegociantTagsEntry(index, e)}
//                                                 onWheelCapture={(e) => e.target.blur()}
//                                             />
//                                         </div>
//
//                                         <div className="space-y-1">
//                                             <Label htmlFor={`negociantTag-${index}`}>Tag number</Label>
//                                             <Input
//                                                 id={`negociantTag-${index}`}
//                                                 name="tagNumber"
//                                                 value={tag.tagNumber || ""}
//                                                 disabled={editableFields.length > 0 ? decideEditable("negociantTags") : false}
//                                                 onChange={(e) => handleNegociantTagsEntry(index, e)}
//                                                 onWheelCapture={(e) => e.target.blur()}
//                                             />
//                                         </div>
//
//                                         <div className="space-y-1">
//                                             <Label htmlFor={`negociantStatus-${index}`}>Status</Label>
//                                             <Select
//                                                 name="status"
//                                                 disabled={editableFields.length > 0 ? decideEditable("negociantTags") : false}
//                                                 value={tag.status || ""}
//                                                 onValueChange={(value) => handleNegociantTagsEntry(index, { target: { name: "status", value } })}
//                                             >
//                                                 <SelectTrigger>
//                                                     <SelectValue placeholder="Status" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     <SelectItem value="inStock">In stock</SelectItem>
//                                                     <SelectItem value="exported">Exported</SelectItem>
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         ))}
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// };
//
// export default TagManagementPage;



import React, { useEffect, useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Edit, Save, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast.js";
import { useParams } from "react-router-dom";
import {
    useGetListTagsQuery,
    useCreateAndUpdateTagsMutation,
    useDeleteTagMutation
} from '@/states/apislice.js';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TagManagementPage = () => {
    const { entryId } = useParams();
    const { toast } = useToast();

    const { data, isLoading, isSuccess, refetch } = useGetListTagsQuery(
        { query: `entryId=${entryId}` }
    );

    const [mineTags, setMineTags] = useState([]);
    const [negociantTags, setNegociantTags] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const [createAndUpdateTags, {
        isSuccess: isCreateUpdateDone,
        isLoading: isCreateUpdating,
        isError: isCreateUpdateError,
        error: createUpdateError
    }] = useCreateAndUpdateTagsMutation();



    const [deleteTag, {
        isSuccess: isDeleteDone,
        isLoading: isDeleting,
        isError: isDeleteError,
        error: deleteError
    }] = useDeleteTagMutation();

    useEffect(() => {
        if (isCreateUpdateError) {
            toast({
                title: "Success",
                description: createUpdateError.data?.message
            })
        }
        if (isCreateUpdateDone) {
            toast({
                title: "Success",
                description: "Lots updated successfully"
            })
        }
        if (isDeleteDone) {
            toast({
                title: "Success",
                description: "Lot deleted successfully"
            })
        }
        if (isDeleteError) {
            toast({
                title: "Success",
                description: deleteError.data?.message
            })
        }
    }, [createUpdateError, isCreateUpdateError, isCreateUpdateDone, deleteError, isDeleteError, isDeleteDone]);

    const [initialFormState, setInitialFormState] = useState({
        sheetNumber: "",
        weight: "",
        tagNumber: "",
        limit: ""
    });

    // Process fetched tags and group them by type
    useEffect(() => {
        if (isSuccess && data?.data?.tags) {
            const tags = data.data.tags;

            // Group tags by type
            const mineTagsList = tags.filter(tag => tag.tagType === "mine")
                .map(tag => ({
                    id: tag._id,
                    sheetNumber: tag.sheetNumber || "",
                    weight: tag.weight || "",
                    tagNumber: tag.tagNumber || "",
                    status: tag.status || "in store",
                    tagType: "mine",
                    entry: entryId
                }));

            const negociantTagsList = tags.filter(tag => tag.tagType === "negociant")
                .map(tag => ({
                    id: tag._id,
                    sheetNumber: tag.sheetNumber || "",
                    weight: tag.weight || "",
                    tagNumber: tag.tagNumber || "",
                    status: tag.status || "in store",
                    tagType: "negociant",
                    entry: entryId
                }));

            // If no tags exist, initialize with empty templates
            setMineTags(mineTagsList.length ? mineTagsList : [{
                sheetNumber: "",
                weight: "",
                tagNumber: "",
                status: "in store",
                tagType: "mine",
                entry: entryId
            }]);

            setNegociantTags(negociantTagsList.length ? negociantTagsList : [{
                sheetNumber: "",
                weight: "",
                tagNumber: "",
                status: "in store",
                tagType: "negociant",
                entry: entryId
            }]);
        }
    }, [isSuccess, data, entryId]);

    // Handle changes to initial form for tag generation
    const handleInitialFormChange = (e) => {
        const { name, value } = e.target;
        setInitialFormState(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Generate tags based on initial form values
    const generateTags = () => {
        const { sheetNumber, tagNumber, weight, limit } = initialFormState;

        if (!sheetNumber || !tagNumber || !weight || !limit) {
            toast({
                variant: "destructive",
                title: "Missing information",
                description: "Please fill all fields to generate tags."
            });
            return;
        }

        const parsedTagNumber = parseInt(tagNumber, 10);
        const parsedLimit = parseInt(limit, 10);

        if (isNaN(parsedTagNumber) || isNaN(parsedLimit)) {
            toast({
                variant: "destructive",
                title: "Invalid input",
                description: "Tag number and limit must be valid numbers."
            });
            return;
        }

        const newTags = Array.from({ length: parsedLimit }, (_, i) => ({
            sheetNumber,
            weight,
            tagNumber: (parsedTagNumber + i).toString().padStart(7, '0'),
            status: "in store",
            tagType: "mine",
            entry: entryId
        }));

        setMineTags(newTags);

        toast({
            title: "Tags generated",
            description: `${parsedLimit} tags have been generated successfully.`
        });
    };

    // Handle changes to mine tags
    const handleMineTagChange = (index, e) => {
        const { name, value } = e.target;

        if (name === "tagNumber" && value.toString().length > 7) {
            toast({
                variant: "warning",
                title: "Input limit reached",
                description: "Tag number can't be more than seven numbers."
            });
            return;
        }

        if (name === "weight" && parseFloat(value) > 71) {
            toast({
                variant: "warning",
                title: "Weight limit exceeded",
                description: "Tag weight can't be more than 71 kilograms."
            });
            return;
        }

        const updatedTags = [...mineTags];
        updatedTags[index] = {
            ...updatedTags[index],
            [name]: value
        };

        setMineTags(updatedTags);
    };

    // Handle changes to negociant tags
    const handleNegociantTagChange = (index, e) => {
        const { name, value } = e.target;

        if (name === "tagNumber" && value.toString().length > 7) {
            toast({
                variant: "warning",
                title: "Input limit reached",
                description: "Tag number can't be more than seven numbers."
            });
            return;
        }

        // if (name === "weight" && parseFloat(value) > 71) {
        //     toast({
        //         variant: "warning",
        //         title: "Weight limit exceeded",
        //         description: "Tag weight can't be more than 71 kilograms."
        //     });
        //     return;
        // }

        const updatedTags = [...negociantTags];
        updatedTags[index] = {
            ...updatedTags[index],
            [name]: value
        };

        setNegociantTags(updatedTags);
    };

    // Add a new mine tag
    const handleAddMineTag = () => {
        setMineTags([...mineTags, {
            sheetNumber: "",
            weight: "",
            tagNumber: "",
            status: "in store",
            tagType: "mine",
            entry: entryId
        }]);
    };

    // Remove a mine tag
    const handleRemoveMineTag = (index) => {
        if (mineTags.length <= 1) return;

        const updatedTags = [...mineTags];
        updatedTags.splice(index, 1);
        setMineTags(updatedTags);
    };

    // Add a new negociant tag
    const handleAddNegociantTag = () => {
        setNegociantTags([...negociantTags, {
            sheetNumber: "",
            weight: "",
            tagNumber: "",
            status: "in store",
            tagType: "negociant",
            entry: entryId
        }]);
    };

    // Remove a negociant tag
    const handleRemoveNegociantTag = (index) => {
        if (negociantTags.length <= 1) return;

        const updatedTags = [...negociantTags];
        updatedTags.splice(index, 1);
        setNegociantTags(updatedTags);
    };

    // Show delete confirmation dialog
    const confirmDelete = (tag) => {
        setTagToDelete(tag);
        setShowDeleteDialog(true);
    };

    // Handle tag deletion
    const handleDeleteTag = async () => {
        if (!tagToDelete) return;

        try {
            // console.log('tagNumber', tagToDelete);
            await deleteTag({ tagNumber: tagToDelete.tagNumber }).unwrap();
            // toast({
            //     title: "Success",
            //     description: `Tag ${tagToDelete.tagNumber} deleted successfully.`
            // });

            // Refresh tag list
            refetch();
        } catch (err) {
            // toast({
            //     variant: "destructive",
            //     title: "Error",
            //     description: `Failed to delete tag: ${err.message || "Unknown error"}`
            // });
        } finally {
            setShowDeleteDialog(false);
            setTagToDelete(null);
        }
    };

    // Save changes to all tags
    const saveChanges = async () => {
        try {
            const allTags = [...mineTags, ...negociantTags].filter(tag => tag.tagNumber !== "");

            await createAndUpdateTags({body: { tags: allTags }}).unwrap();

            // toast({
            //     title: "Success",
            //     description: "Tags saved successfully"
            // });

            setIsEditMode(false);
            refetch();

        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to save tags: ${err.message || "Unknown error"}`
            });
        }
    };

    // Toggle edit mode
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Tags Management</h1>
                {isEditMode ? (
                    <div className="flex gap-2">
                        <Button
                            onClick={saveChanges}
                            disabled={isCreateUpdating}
                            className="bg-green-500 hover:bg-green-600"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                        <Button
                            onClick={toggleEditMode}
                            variant="outline"
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <Button onClick={toggleEditMode} className="bg-blue-500 hover:bg-blue-600">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Tags
                    </Button>
                )}
            </div>

            {isLoading && <div className="text-center py-8">Loading tags...</div>}

            {!isLoading && (
                <div className="flex flex-col gap-6">
                    {/* Tag generation popover - only visible in edit mode */}
                    {isEditMode && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="w-fit bg-blue-600 hover:bg-blue-700">
                                    Generate Multiple Tags
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto">
                                <div className="space-y-2">
                                    <h3 className="font-medium text-lg">Generate number of tags needed</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="sheetNumber">Sheet number</Label>
                                            <Input
                                                id="sheetNumber"
                                                name="sheetNumber"
                                                value={initialFormState.sheetNumber}
                                                onChange={handleInitialFormChange}
                                                onWheelCapture={(e) => e.target.blur()}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="weight">Weight (kg)</Label>
                                            <Input
                                                id="weight"
                                                name="weight"
                                                value={initialFormState.weight}
                                                onChange={handleInitialFormChange}
                                                onWheelCapture={(e) => e.target.blur()}
                                                type="number"
                                                max="71"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="tagNumber">Starting tag number</Label>
                                            <Input
                                                id="tagNumber"
                                                name="tagNumber"
                                                value={initialFormState.tagNumber}
                                                onChange={handleInitialFormChange}
                                                onWheelCapture={(e) => e.target.blur()}
                                                maxLength={7}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="limit">Number of tags</Label>
                                            <Input
                                                id="limit"
                                                name="limit"
                                                value={initialFormState.limit}
                                                onChange={handleInitialFormChange}
                                                onWheelCapture={(e) => e.target.blur()}
                                                type="number"
                                            />
                                        </div>
                                    </div>

                                    <Button className="w-full mt-4 bg-green-500 hover:bg-green-600" onClick={generateTags}>
                                        Generate
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                    {/* Mine Tags Section */}
                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Mine Tags</CardTitle>
                            {isEditMode && (
                                <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600"
                                    onClick={handleAddMineTag}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add Tag
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mineTags.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">No mine tags found</div>
                            ) : (
                                mineTags.map((tag, index) => (
                                    <Card key={index} className="relative">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="font-semibold">Mine Tag {index + 1}</p>
                                                {isEditMode && (
                                                    <div className="flex items-center gap-2">
                                                        {tag.id && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-500 hover:text-red-700"
                                                                onClick={() => confirmDelete(tag)}
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {mineTags.length > 1 && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleRemoveMineTag(index)}
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="space-y-1">
                                                    <Label htmlFor={`mineSheet-${index}`}>Sheet number</Label>
                                                    <Input
                                                        id={`mineSheet-${index}`}
                                                        name="sheetNumber"
                                                        value={tag.sheetNumber}
                                                        disabled={!isEditMode}
                                                        onChange={(e) => handleMineTagChange(index, e)}
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor={`mineWeight-${index}`}>Weight (kg)</Label>
                                                    <Input
                                                        id={`mineWeight-${index}`}
                                                        name="weight"
                                                        value={tag.weight}
                                                        disabled={!isEditMode}
                                                        onChange={(e) => handleMineTagChange(index, e)}
                                                        type="number"
                                                        max="71"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor={`mineTag-${index}`}>Tag number</Label>
                                                    <Input
                                                        id={`mineTag-${index}`}
                                                        name="tagNumber"
                                                        value={tag.tagNumber}
                                                        disabled={!isEditMode || tag.id}
                                                        onChange={(e) => handleMineTagChange(index, e)}
                                                        maxLength={7}
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor={`mineStatus-${index}`}>Status</Label>
                                                    <Select
                                                        name="status"
                                                        disabled={!isEditMode}
                                                        value={tag.status}
                                                        onValueChange={(value) =>
                                                            handleMineTagChange(index, { target: { name: "status", value } })
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="in store">In Store</SelectItem>
                                                            <SelectItem value="out of store">Out of Store</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Negociant Tags Section */}
                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Negociant Tags</CardTitle>
                            {isEditMode && (
                                <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600"
                                    onClick={handleAddNegociantTag}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add Tag
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {negociantTags.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">No negociant tags found</div>
                            ) : (
                                negociantTags.map((tag, index) => (
                                    <Card key={index} className="relative">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="font-semibold">Negociant Tag {index + 1}</p>
                                                {isEditMode && (
                                                    <div className="flex items-center gap-2">
                                                        {tag.id && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-500 hover:text-red-700"
                                                                onClick={() => confirmDelete(tag)}
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {negociantTags.length > 1 && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleRemoveNegociantTag(index)}
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="space-y-1">
                                                    <Label htmlFor={`negociantSheet-${index}`}>Sheet number</Label>
                                                    <Input
                                                        id={`negociantSheet-${index}`}
                                                        name="sheetNumber"
                                                        value={tag.sheetNumber}
                                                        disabled={!isEditMode}
                                                        onChange={(e) => handleNegociantTagChange(index, e)}
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor={`negociantWeight-${index}`}>Weight (kg)</Label>
                                                    <Input
                                                        id={`negociantWeight-${index}`}
                                                        name="weight"
                                                        value={tag.weight}
                                                        disabled={!isEditMode}
                                                        onChange={(e) => handleNegociantTagChange(index, e)}
                                                        type="number"
                                                        max="71"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor={`negociantTag-${index}`}>Tag number</Label>
                                                    <Input
                                                        id={`negociantTag-${index}`}
                                                        name="tagNumber"
                                                        value={tag.tagNumber}
                                                        disabled={!isEditMode || tag.id}
                                                        onChange={(e) => handleNegociantTagChange(index, e)}
                                                        maxLength={7}
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor={`negociantStatus-${index}`}>Status</Label>
                                                    <Select
                                                        name="status"
                                                        disabled={!isEditMode}
                                                        value={tag.status}
                                                        onValueChange={(value) =>
                                                            handleNegociantTagChange(index, { target: { name: "status", value } })
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="in store">In Store</SelectItem>
                                                            <SelectItem value="out of store">Out of Store</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete tag {tagToDelete?.tagNumber}?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteTag}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default TagManagementPage;