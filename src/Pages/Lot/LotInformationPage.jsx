import React, {useState, useEffect} from 'react';
// import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import {Separator} from '@/components/ui/separator';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Switch} from "@/components/ui/switch"
import {useForm} from 'react-hook-form';
import {Calculator, Truck, Tag, FileText, PlusCircle, Save, Trash2, TriangleAlert} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {useToast} from "@/hooks/use-toast.js";
import {
    useCreateFeeMutation,
    useCreateLotsMutation, useDeleteFeeMutation, useDeleteGradeImgMutation,
    useGetAllFeeTypesQuery,
    useGetFeesByLotQuery,
    useGetLotByIdQuery,
    useUpdateLotMutation
} from "@/states/apislice.js";
import {Image, message, Modal, Tooltip} from "antd";
import FetchingPage from "@/Pages/FetchingPage.jsx";
import {getBase64FromServer, handleConvertToUSD} from "@/components/helperFunctions.js";
import {IoClose} from "react-icons/io5";
import {useSelector} from "react-redux";

const LotInformationPage = () => {
    const {permissions: userPermissions} = useSelector(state => state.persistedReducer?.global);
    const {toast} = useToast();
    const {lotId} = useParams();
    const [lot, setLot] = useState(null);
    const [entry, setEntry] = useState(null);
    const [feeTypes, setFeeTypes] = useState([]);
    const [fees, setFees] = useState([]);
    const [isAddingFee, setIsAddingFee] = useState(false);
    const [selectedFeeType, setSelectedFeeType] = useState(null);
    const [newFeeAmount, setNewFeeAmount] = useState('');
    const [customRate, setCustomRate] = useState('');
    const [calculationParams, setCalculationParams] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const {
        data: lotData,
        isSuccess: isLotSuccess,
        isLoading: isLoadingLot,
        isError: isLotError,
        error: lotError
    } = useGetLotByIdQuery({id: lotId});
    const {data: feeTypesData, isSuccess: isFeeTypesSuccess, isLoading: isLoadingFeeTypes} = useGetAllFeeTypesQuery();
    const [updateLot, {
        isSuccess: isUpdateSuccess,
        isLoading: isUpdating,
        isError: isUpdateError,
        error: updateError
    }] = useCreateLotsMutation();
    const [createFee, {
        isSuccess: isCreateSuccess,
        isLoading: isCreatingFee,
        isError: isCreateFeeError,
        error: createError
    }] = useCreateFeeMutation();
    const [deleteFee, {
        isSuccess: isDeleteSuccess,
        isLoading: isDeleting,
        isError: isDeleteError,
        error: deleteError
    }] = useDeleteFeeMutation();
    const [
        deleteGradeImg,
        {
            isSuccess: isImageDeleteSuccess,
            isError: isImageDeleteError,
            error: imageDeleteError,
        },
    ] = useDeleteGradeImgMutation();
    const [addGradeImg, {isSuccess: isUpdateLotSuccess, isLoading: isUpdatingLot}] = useUpdateLotMutation();

    // Form for editing lot details
    const form = useForm({
        defaultValues: {
            weightOut: '',
            mineralGrade: '',
            ASIR: '',
            londonMetalExchange: '',
            treatmentCharges: '',
            tantal: '',
            metricTonUnit: '',
            pricePerUnit: '',
            comment: '',
            USDRate: '',
            pricingGrade: '',
            niobium: '',
            iron: '',
            nonSellAgreement: false,
            documentFile: null,
        }
    });

    const handleUploadGradeImage = async ({file, lotId}) => {
        const formData = new FormData();
        formData.append(lotId, file);
        await addGradeImg({lotId, body: formData});
        // await updateEntry({entryId, body: formData, model: "coltan"});
    };

    useEffect(() => {
        if (isLotSuccess) {
            const {lot} = lotData.data;
            setLot(lot);
            setEntry(lot.entry);
            setFees(lot.fees);
        }
        if (isFeeTypesSuccess) {
            const {feeTypes} = feeTypesData.data;
            setFeeTypes(feeTypes);
        }
    }, [isLotSuccess, lotData, isFeeTypesSuccess, feeTypesData]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setLoading(true);
    //             // Fetch lot data with populated entry
    //             const lotResponse = await axios.get(`/api/lots/${lotId}`);
    //             setLot(lotResponse.data);
    //
    //             // Fetch associated entry
    //             if (lotResponse.data.entry) {
    //                 const entryResponse = await axios.get(`/api/entries/${lotResponse.data.entry}`);
    //                 setEntry(entryResponse.data);
    //             }
    //
    //             // Fetch available fee types
    //             const feeTypesResponse = await axios.get('/api/feeTypes');
    //             setFeeTypes(feeTypesResponse.data);
    //
    //             // Fetch existing fees for this lot
    //             const feesResponse = await axios.get(`/api/fees?lot=${lotId}`);
    //             setFees(feesResponse.data);
    //
    //             setLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             toast({
    //                 title: "Error",
    //                 description: "Failed to load lot information",
    //                 variant: "destructive"
    //             });
    //             setLoading(false);
    //         }
    //     };
    //
    //     fetchData();
    // }, [lotId]);

    useEffect(() => {
        // Populate form when lot data is loaded
        if (lot) {
            form.reset({
                weightOut: lot.weightOut || '',
                mineralGrade: lot.mineralGrade || '',
                ASIR: lot.ASIR || '',
                londonMetalExchange: lot.londonMetalExchange || '',
                treatmentCharges: lot.treatmentCharges || '',
                tantal: lot.tantal || '',
                metricTonUnit: lot.metricTonUnit || '',
                pricePerUnit: lot.pricePerUnit || '',
                comment: lot.comment || '',
                USDRate: lot.USDRate || '',
                pricingGrade: lot.pricingGrade || '',
                nonSellAgreement: lot.nonSellAgreement?.decision || false
            });

            // Set calculation parameters based on mineral type
            const modelName = lot.docModel.toLowerCase();
            const params = {};

            switch (modelName) {
                case 'cassiterite':
                    params.LME = lot.londonMetalExchange;
                    params.grade = lot.pricingGrade === "ASIR" ? lot.ASIR : lot.mineralGrade;
                    params.TC = lot.treatmentCharges;
                    break;
                case 'coltan':
                    params.tantal = lot.tantal;
                    params.grade = lot.pricingGrade === "ASIR" ? lot.ASIR : lot.mineralGrade;
                    break;
                case 'wolframite':
                    params.MTU = lot.metricTonUnit;
                    params.grade = lot.pricingGrade === "ASIR" ? lot.ASIR : lot.mineralGrade;
                    break;
                case 'lithium':
                case 'beryllium':
                    params.pricePerUnit = lot.pricePerUnit;
                    break;
            }

            setCalculationParams(params);
        }
    }, [lot, form]);

    useEffect(() => {
        if (isUpdateSuccess || isUpdateLotSuccess) {
            toast({
                title: "Success",
                description: "Update successfully",
            })
        } else if (isUpdateError || updateError) {
            toast({
                title: "Error",
                description: updateError.data?.message,
                variant: "destructive"
            })
        }
        if (isCreateSuccess) {
            toast({
                title: "Success",
                description: "Fee added successfully",
            })
        } else if (isCreateFeeError && createError) {
            toast({
                title: "Error",
                description: createError.data?.message,
                variant: "destructive"
            })
        }
        if (isImageDeleteSuccess) {
            toast({
                title: "Success",
                description: "Image removed successfully",
            })
        } else if (isImageDeleteError && imageDeleteError) {
            toast({
                title: "Error",
                description: imageDeleteError.data?.message,
                variant: "destructive"
            })
        }
    }, [isUpdateSuccess, isUpdateLotSuccess, isUpdateError, updateError, toast, isCreateSuccess, isCreateFeeError, createError, isImageDeleteSuccess, isImageDeleteError, imageDeleteError]);


    useEffect(() => {
        if (isDeleteSuccess) {
            toast({
                title: 'Success',
                description: "Delete fee removed successfully"
            })
        } else if (isDeleteError && deleteError) {
            toast({
                title: "Error",
                description: deleteError.data?.message,
                variant: "destructive"
            })
        }

    }, [isDeleteSuccess, isDeleteError, deleteError, toast]);

    const handleAddFee = async () => {
        try {
            if (!selectedFeeType) {
                toast({
                    title: "Error",
                    description: "Please select a fee type",
                    variant: "destructive"
                });
                return;
            }

            // Find the selected fee type object
            const feeType = feeTypes.find(ft => ft._id === selectedFeeType);

            let amount = 0;

            // Calculate amount based on fee type rate if available, otherwise use custom input
            if (feeType.rate) {
                amount = feeType.rate * lot.weightOut;
            } else if (newFeeAmount) {
                amount = parseFloat(newFeeAmount);
            } else if (customRate) {
                amount = parseFloat(customRate) * lot.weightOut;
            } else {
                toast({
                    title: "Error",
                    description: "Please provide an amount or rate",
                    variant: "destructive"
                });
                return;
            }


            // Create the new fee
            const body = {
                lot: lotId,
                amount,
                feeType: selectedFeeType,
                status: 'not paid'
            };

            await createFee({body});
            // console.log(newFee);

            // const response = await axios.post('/api/fees', newFee);

            // Update local fees state
            // setFees([...fees, response.data]);
            setFees([...fees]);

            // Reset form fields
            setSelectedFeeType(null);
            setNewFeeAmount('');
            setCustomRate('');
            setIsAddingFee(false);

            toast({
                title: "Success",
                description: "Fee added successfully",
            });
        } catch (error) {
            console.error('Error adding fee:', error);
            toast({
                title: "Error",
                description: "Failed to add fee",
                variant: "destructive"
            });
        }
    };


    const handleDeleteFee = async (id) => {
        try {

            // await axios.delete(`/api/fees/${feeId}`);

            await deleteFee({id});
            // Update local fees state
            setFees(fees.filter(fee => fee._id !== id));

            toast({
                title: "Success",
                description: "Fee deleted successfully",
            });
        } catch (error) {
            console.error('Error deleting fee:', error);
            toast({
                title: "Error",
                description: "Failed to delete fee",
                variant: "destructive"
            });
        }
    };

    const handleUpdateLot = async (data) => {
        try {
            // const response = await axios.patch(`/api/lots/${lotId}`, data);
            // setLot(response.data);
            if (data.documentFile) {
                await handleUploadGradeImage({file: data.documentFile, lotId});
            }
            const body = {
                lots: [{...data, documentFile: null, _id: lotId, nonSellAgreement: {decision: data.nonSellAgreement}}],
                model: lot.docModel?.toLowerCase()
            };
            await updateLot({body, lotId});
            toast({
                title: "Success",
                description: "Lot updated successfully",
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating lot:', error);
            toast({
                title: "Error",
                description: "Failed to update lot",
                variant: "destructive"
            });
        }
    };

    const calculatePricePerUnit = () => {
        const modelName = lot?.docModel.toLowerCase();
        const grade = form.getValues('ASIR') || form.getValues('mineralGrade');

        let params = {};
        let price = null;

        switch (modelName) {
            case 'cassiterite':
                const LME = parseFloat(form.getValues('londonMetalExchange'));
                const TC = parseFloat(form.getValues('treatmentCharges'));
                if (LME && grade && TC) {
                    price = (((LME * grade / 100) - TC) / 1000);
                }
                break;
            case 'coltan':
                const tantal = parseFloat(form.getValues('tantal'));
                if (tantal && grade) {
                    price = (tantal * grade);
                }
                break;
            case 'wolframite':
                const MTU = parseFloat(form.getValues('metricTonUnit'));
                if (MTU && grade) {
                    price = ((MTU * grade / 100) * 0.1);
                }
                break;
            case 'lithium':
            case 'beryllium':
                price = parseFloat(form.getValues('pricePerUnit'));
                break;
        }

        if (price !== null) {
            form.setValue('pricePerUnit', price.toFixed(2));
        }
    };

    const calculateMineralPrice = () => {
        const pricePerUnit = parseFloat(form.getValues('pricePerUnit')) || lot.pricePerUnit;
        const weightOut = parseFloat(form.getValues('weightOut')) || lot.weightOut;

        if (pricePerUnit && weightOut) {
            return (pricePerUnit * weightOut).toFixed(2);
        }
        return '0.00';
    };

    const getTotalFees = () => {
        return fees.reduce((total, fee) => {
            // console.log(handleConvertToUSD(fee.amount, form.getValues('USDRate') || lot.USDRate))
            if (fee.feeType?.currency === 'RWF') {
                return total + handleConvertToUSD(fee.amount, form.getValues('USDRate') || lot.USDRate);
            } else return total + fee.amount;
        }, 0).toFixed(2);
    };


    const getNetAmount = () => {
        const mineralPrice = parseFloat(calculateMineralPrice());
        const totalFees = parseFloat(getTotalFees());

        return (mineralPrice - totalFees).toFixed(2);
    };

    if (isLoadingLot || isLoadingFeeTypes || isUpdating || isUpdatingLot || isCreatingFee || isDeleting) return <FetchingPage/>

    if (!lot) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Lot not found</h2>
                    <p className="mt-2">The requested lot information could not be found.</p>
                </div>
            </div>
        );
    }


    const removeFile = async (lotId) => {
        // const body = {lotId};
        // console.log('lotId', lotId);
        await deleteGradeImg({lotId});
    };


    const renderCalculationFields = () => {
        const modelName = lot.docModel.toLowerCase();

        const commonFields = (
            <>
                {userPermissions.weightOut?.view && (
                    <FormField
                        control={form.control}
                        name="weightOut"
                        disabled={true}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Weight Out (Kg)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                )}

                {userPermissions.mineralGrade?.edit && (
                    <FormField
                        control={form.control}
                        name="mineralGrade"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Mineral Grade (%)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                )}


                {userPermissions.ASIR?.edit && (
                    <FormField
                        control={form.control}
                        name="ASIR"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>ASIR Grade</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                )}


                {userPermissions.USDRate?.edit && (
                    <FormField
                        control={form.control}
                        name="USDRate"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>USD Rate (RWF)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                )}


                {userPermissions.pricingGrade?.edit && (
                    <FormField
                        control={form.control}
                        name="pricingGrade"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Pricing Grade</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a pricing grade"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="SMC">SMC</SelectItem>
                                        <SelectItem value="ASIR">ASIR</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                )}


                {userPermissions.nonSellAgreement?.edit && (
                    <FormField
                        control={form.control}
                        name="nonSellAgreement"
                        render={({field}) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Is this lot non sell agreement?</FormLabel>
                                    <FormDescription>
                                        Mark this mineral lot as non sell agreement
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                )}


                {userPermissions.gradeImg?.view && userPermissions.gradeImg?.edit ? (
                    <div className="flex items-center">
                        {lot.gradeImg?.filePath !== null && (
                            <>
                                <Image loading="lazy" width={64} height={64} src={lot.gradeImg.filePath}/>
                                {userPermissions.gradeImg?.edit && (
                                    <IoClose
                                        title="Delete"
                                        className="text-lg"
                                        onClick={() => removeFile(lot._id)}
                                    />
                                )}
                            </>
                        )}
                    </div>
                ) : (

                    <FormField
                        control={form.control}
                        name="documentFile"
                        render={({field: {value, onChange, ...fieldProps}}) => (
                            <FormItem>
                                <FormLabel>Grade Image</FormLabel>
                                <FormControl>
                                    <div className="grid w-full gap-2">
                                        <Input
                                            id="documentUpload"
                                            type="file"
                                            className="cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                onChange(file);
                                            }}
                                            accept="image/*"
                                            {...fieldProps}
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Upload mineral analysis report or export documentation (JPG, PNG)
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                )}

                {userPermissions.sampleIdentification?.edit && (
                    <FormField
                        control={form.control}
                        name="sampleIdentification"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Sample Identification</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                )}

            </>
        );

        let specificFields = null;

        switch (modelName) {
            case 'cassiterite':
                specificFields = (
                    <>
                        {userPermissions.londonMetalExchange?.edit && (
                            <FormField
                                control={form.control}
                                name="londonMetalExchange"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>London Metal Exchange Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}


                        {userPermissions.treatmentCharges?.edit && (
                            <FormField
                                control={form.control}
                                name="treatmentCharges"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Treatment Charges</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}

                    </>
                );
                break;

            case 'coltan':
                specificFields = (
                    <>
                        {userPermissions.tantal?.edit && (
                            <FormField
                                control={form.control}
                                name="tantal"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Tantal Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}

                        {userPermissions.niobium?.edit && (
                            <FormField
                                control={form.control}
                                name="niobium"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Niobium</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}

                        {userPermissions.iron?.edit && (
                            <FormField
                                control={form.control}
                                name="iron"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Iron</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}

                    </>
                );
                break;

            case 'wolframite':
                specificFields = (
                    <>
                        {userPermissions.metricTonUnit?.edit && (
                            <FormField
                                control={form.control}
                                name="metricTonUnit"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Metric Ton Unit (MTU) Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}
                    </>
                );
                break;

            case 'lithium':
            case 'beryllium':
                specificFields = null; // These use direct price per unit input
                break;
        }


        return (
            <>
                {commonFields}
                {specificFields}

                <FormField
                    control={form.control}
                    name="pricePerUnit"
                    disabled={userPermissions.pricePerUnit?.edit}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Price Per Unit</FormLabel>
                            <div className="flex space-x-2">
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={calculatePricePerUnit}
                                >
                                    <Calculator className="h-4 w-4"/>
                                </Button>
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="comment"
                    disabled={userPermissions.comment?.edit}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Comment</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </>
        );
    };

    return (
        <div className={`container mx-auto py-6 max-w-7xl`}>
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Lot Information {lot.nonSellAgreement?.decision === true ?
                        <span className="text-3xl text-red-800 flex items-center gap-3">
                                This lot is marked as non sell agreement <TriangleAlert size={30}/>
                            </span> : ''}
                    </h1>
                    <p className="text-muted-foreground">
                        Manage lot details, pricing, and fees
                    </p>
                </div>
                <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "Cancel Editing" : "Edit Lot Details"}
                </Button>
            </div>

            {/* Main Content - Split into two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Working area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Lot and Entry Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Lot #{lot.lotNumber}</CardTitle>
                                    <CardTitle>Beneficiary: {lot.beneficiary}</CardTitle>
                                    <CardDescription>
                                        {entry ? `From Entry dated ${new Date(entry.supplyDate).toLocaleDateString()}` : 'No entry information'}
                                    </CardDescription>
                                </div>
                                <Badge variant={lot.pricePerUnit ? "default" : "outline"}>
                                    {lot.docModel}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="details">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="supplier">Supplier & Entry</TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {userPermissions.weightIn?.view && (
                                            <div>
                                                <Label>Weight In</Label>
                                                <div className="text-lg font-medium">{lot.weightIn} kg</div>
                                            </div>
                                        )}

                                        {userPermissions.weightOut?.view && (
                                            <div>
                                                <Label>Weight Out</Label>
                                                <div className="text-lg font-medium">{lot.weightOut || 'Not set'} kg
                                                </div>
                                            </div>
                                        )}

                                        {userPermissions.mineralGrade?.view && (
                                            <div>
                                                <Label>Mineral Grade</Label>
                                                <div className="text-lg font-medium">{lot.mineralGrade || 'Not set'}%
                                                </div>
                                            </div>
                                        )}

                                        {userPermissions.ASIR?.view && (
                                            <div>
                                                <Label>ASIR Grade</Label>
                                                <div className="text-lg font-medium">{lot.ASIR || 'Not set'}</div>
                                            </div>
                                        )}

                                        {userPermissions.pricingGrade?.view && (
                                            <div>
                                                <Label>Pricing Grade</Label>
                                                <div
                                                    className="text-lg font-medium">{lot.pricingGrade || 'Not set'}</div>
                                            </div>
                                        )}

                                        {userPermissions.pricePerUnit?.view && (
                                            <div>
                                                <Label>Price Per Unit</Label>
                                                <div className="text-lg font-medium">${lot.pricePerUnit || '0.00'}</div>
                                            </div>
                                        )}

                                        {userPermissions.mineralPrice?.view && (
                                            <div>
                                                <Label>Mineral Price</Label>
                                                <div className="text-lg font-medium">${lot.mineralPrice || '0.00'}</div>
                                            </div>
                                        )}

                                        {userPermissions.weightIn?.view && lot.USDRate && (
                                            <div>
                                                <Label>USD Rate</Label>
                                                <div className="text-lg font-medium">{lot.USDRate || '0'} RWF</div>
                                            </div>
                                        )}

                                        {userPermissions.beneficiary?.view && (
                                            <div>
                                                <Label>Beneficiary</Label>
                                                <div className="text-lg font-medium">{lot.beneficiary}</div>
                                            </div>
                                        )}

                                        {lot.comment && (
                                            <div className="md:col-span-2">
                                                <Label>Comment</Label>
                                                <div className="text-muted-foreground">{lot.comment}</div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="supplier" className="space-y-4">
                                    {entry ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Entry ID</Label>
                                                <div className="text-lg font-medium">{entry._id}</div>
                                            </div>
                                            <div>
                                                <Label>Mineral Type</Label>
                                                <div
                                                    className="text-lg font-medium capitalize">{entry.mineralType}</div>
                                            </div>
                                            <div>
                                                <Label>Supply Date</Label>
                                                <div
                                                    className="text-lg font-medium">{new Date(entry.supplyDate).toLocaleDateString()}</div>
                                            </div>
                                            <div>
                                                <Label>Total Weight</Label>
                                                <div className="text-lg font-medium">{entry.weightIn} kg</div>
                                            </div>
                                            <div>
                                                <Label>Number of Tags</Label>
                                                <div
                                                    className="text-lg font-medium">{entry.numberOfTags || 'Not set'}</div>
                                            </div>
                                            <div>
                                                <Label>Entry Beneficiary</Label>
                                                <div
                                                    className="text-lg font-medium">{entry.beneficiary || 'Not set'}</div>
                                            </div>
                                            {entry.comment && (
                                                <div className="md:col-span-2">
                                                    <Label>Entry Comment</Label>
                                                    <div className="text-muted-foreground">{entry.comment}</div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <p>No entry information available</p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Price Calculation Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calculator className="mr-2 h-5 w-5"/>
                                Price Calculation
                            </CardTitle>
                            <CardDescription>
                                Update lot details and calculate pricing
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleUpdateLot)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderCalculationFields()}
                                        </div>

                                        <div className="flex justify-end mt-4 space-x-2">
                                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit">
                                                <Save className="mr-2 h-4 w-4"/>
                                                Save Changes
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-muted-foreground">
                                        Click &quot;Edit Lot Details&quot; to update pricing information
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Fees Management Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="flex items-center">
                                        <FileText className="mr-2 h-5 w-5"/>
                                        Fees
                                    </CardTitle>
                                    <CardDescription>
                                        Manage additional fees for this lot
                                    </CardDescription>
                                </div>
                                <Button onClick={() => setIsAddingFee(true)}>
                                    <PlusCircle className="mr-2 h-4 w-4"/>
                                    Add Fee
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {fees.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fee Type</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fees.map((fee) => (
                                            <TableRow key={fee._id}>
                                                <TableCell>{fee.feeType?.title || 'Custom Fee'}</TableCell>
                                                <TableCell>
                                                    {fee.feeType?.currency === 'USD' ? (
                                                        <span className="font-medium">
                                                        -${fee.amount.toFixed(2)}
                                                    </span>
                                                    ) : (
                                                        <div>
                                                        <span className="font-medium">
                                                            -RWF {fee.amount.toFixed(2)} &gt;
                                                        </span>
                                                            <span className="font-medium">
                                                            ${handleConvertToUSD(fee.amount, form.getValues('USDRate') || lot.USDRate)?.toFixed(2) || null}
                                                        </span>
                                                        </div>
                                                    )}
                                                    {/*${fee.amount.toFixed(2)}*/}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={fee.status === 'paid' ? 'success' : 'outline'}>
                                                        {fee.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteFee(fee._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4"/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-muted-foreground">No fees added yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Summary Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle>Price Summary</CardTitle>
                            <CardDescription>
                                Final calculation of all fees and prices
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Weight Out</span>
                                    <span className="font-medium">{lot.weightOut || '0'} kg</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Price Per Unit</span>
                                    <span
                                        className="font-medium">${form.getValues('pricePerUnit') || lot.pricePerUnit || '0.00'}</span>
                                </div>

                                <Separator className="my-2"/>

                                <div className="flex justify-between text-lg">
                                    <span>Mineral Price</span>
                                    <span className="font-bold">
                                        ${isEditing ? calculateMineralPrice() : (lot.mineralPrice || '0.00')}
                                    </span>
                                </div>

                                <Separator className="my-2"/>

                                <div className="space-y-1">
                                    <span className="text-muted-foreground">Fees:</span>

                                    {fees.length > 0 ? (
                                        fees.map((fee) => (
                                            <div key={fee._id} className="flex justify-between pl-4">
                                                <span>{fee.feeType?.title || 'Custom Fee'}</span>
                                                {fee.feeType?.currency === 'USD' ? (
                                                    <span className="font-medium text-red-500">
                                                        -${fee.amount.toFixed(2)}
                                                    </span>
                                                ) : (
                                                    <div>
                                                        <span className="font-medium text-red-500">
                                                            -RWF {fee.amount.toFixed(2)} &gt;
                                                        </span>
                                                        <span className="font-medium text-red-500">
                                                            ${handleConvertToUSD(fee.amount, form.getValues('USDRate') || lot.USDRate)?.toFixed(2) || null}
                                                        </span>
                                                    </div>
                                                )}

                                            </div>
                                        ))
                                    ) : (
                                        <div className="pl-4 text-muted-foreground">No fees</div>
                                    )}

                                    <div className="flex justify-between pt-2">
                                        <span>Total Fees</span>
                                        <span className="font-medium text-red-500">-${getTotalFees()}</span>
                                    </div>
                                </div>

                                <Separator className="my-2"/>

                                <div className="flex justify-between text-lg pt-2">
                                    <span>Net Amount</span>
                                    <span className="font-bold text-green-600">${getNetAmount()}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-4">
                            <div className="w-full">
                                <Label>Payment Status</Label>
                                <Select defaultValue="not-paid">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="partially-paid">Partially Paid</SelectItem>
                                        <SelectItem value="not-paid">Not Paid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button className="w-full" onClick={() => {
                                navigate(`/lots/payments/${lotId}`);
                            }}>
                                Process Payment
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Tag className="mr-2 h-5 w-5"/>
                                Lot Metadata
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created On</span>
                                    <span>{new Date(lot.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Last Updated</span>
                                    <span>{new Date(lot.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Lot ID</span>
                                    <span className="text-xs">{lot._id}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Add Fee Dialog */}
            <Dialog open={isAddingFee} onOpenChange={setIsAddingFee}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Fee</DialogTitle>
                        <DialogDescription>
                            Select a fee type and specify amount details
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="feeType">Fee Type</Label>
                            <Select
                                value={selectedFeeType}
                                onValueChange={setSelectedFeeType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select fee type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {feeTypes.map(feeType => (
                                        <SelectItem key={feeType._id} value={feeType._id}>
                                            {feeType.title} {lot.fees?.some(f => f.feeType?._id === feeType._id) &&
                                            <Badge>Already Added</Badge>}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedFeeType && (
                            <>
                                {/* Show this if the selected fee type has a rate */}
                                {feeTypes.find(ft => ft._id === selectedFeeType)?.rate ? (
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Label>Fee Rate</Label>
                                            <span className="text-muted-foreground">
                        {feeTypes.find(ft => ft._id === selectedFeeType)?.rate} per kg
                      </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <Label>Weight Out</Label>
                                            <span className="text-muted-foreground">
                        {lot.weightOut} kg
                      </span>
                                        </div>

                                        <div className="flex justify-between font-medium">
                                            <Label>Calculated Amount</Label>
                                            <span>
                        ${(feeTypes.find(ft => ft._id === selectedFeeType)?.rate * lot.weightOut).toFixed(2)}
                      </span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="feeAmount">Fee Amount</Label>
                                            <Input
                                                id="feeAmount"
                                                type="number"
                                                step="0.01"
                                                placeholder="Enter exact amount"
                                                value={newFeeAmount}
                                                onChange={(e) => setNewFeeAmount(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="customRate">Or specify rate per kg</Label>
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    id="customRate"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Rate per kg"
                                                    value={customRate}
                                                    onChange={(e) => setCustomRate(e.target.value)}
                                                />
                                                <span className="whitespace-nowrap">
                                                    × {lot.weightOut} kg = {customRate ? (parseFloat(customRate) * lot.weightOut).toFixed(2) : '0.00'}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingFee(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddFee}>
                            Add Fee
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/*<Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>*/}
            {/*    <DialogContent className="sm:max-w-md">*/}
            {/*        <DialogHeader>*/}
            {/*            <DialogTitle className="text-red-600">Confirm Deletion</DialogTitle>*/}
            {/*            <DialogDescription className="pt-4">*/}
            {/*                Are you sure you want to delete the fee*/}
            {/*                /!*<span className="font-semibold">{}</span>?*!/*/}
            {/*            </DialogDescription>*/}
            {/*        </DialogHeader>*/}
            {/*        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">*/}
            {/*            <h4 className="text-amber-800 font-medium mb-2">Warning:</h4>*/}
            {/*            <p className="text-amber-700 text-sm">*/}
            {/*                Deleting this fee may affect existing transactions and reports that reference it.*/}
            {/*                This action cannot be undone.*/}
            {/*            </p>*/}
            {/*        </div>*/}
            {/*        <DialogFooter>*/}
            {/*            <Button onClick={() => setDeleteModalOpen(false)}>*/}
            {/*                Cancel*/}
            {/*            </Button>*/}
            {/*            <Button*/}
            {/*                type="primary"*/}
            {/*                danger*/}
            {/*                onClick={handleDeleteFee(feeId)}*/}
            {/*                className="bg-red-600 hover:bg-red-700"*/}
            {/*            >*/}
            {/*                Delete*/}
            {/*            </Button>*/}
            {/*        </DialogFooter>*/}
            {/*    </DialogContent>*/}
            {/*</Dialog>*/}
        </div>
    );
};

export default LotInformationPage;