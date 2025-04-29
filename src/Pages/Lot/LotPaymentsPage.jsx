import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from '@/components/ui/dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { CalendarIcon, Plus, Trash2, FileEdit, DollarSign, ArrowDownUp, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {useToast} from "@/hooks/use-toast.js";
import {useAddPaymentMutation, useGetAllAdvancePaymentsQuery, useGetLotByIdQuery} from "@/states/apislice.js";
import {handleConvertToUSD} from "@/components/helperFunctions.js";


const PaymentModes = {
    BANK_TRANSFER: 'Bank Transfer',
    CASH: 'Cash',
    MOBILE_MONEY: 'Mobile Money',
    CHECK: 'Check',
};

const LotPaymentsPage = () => {
    const { lotId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [lotDetails, setLotDetails] = useState(null);
    const [payments, setPayments] = useState([]);
    const [availableAdvances, setAvailableAdvances] = useState([]);
    const [paymentPreview, setPaymentPreview] = useState(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedAdvances, setSelectedAdvances] = useState([]);
    const [tabView, setTabView] = useState("payments");
    const [deletePaymentId, setDeletePaymentId] = useState(null);
    const [isSettlement, setIsSettlement] = useState(false);
    const [settlementRemainingAmount, setSettlementRemainingAmount] = useState(0);
    const {toast} = useToast();

    const {
        data: lotData,
        isSuccess: isLotSuccess,
        isLoading: isLoadingLot,
        isError: isLotError,
        error: lotError
    } = useGetLotByIdQuery({id: lotId});

    const {
        data: adv,
        isLoading: isFetching,
        isError: isFail,
        error: fail,
        isSuccess: isDone,
    } = useGetAllAdvancePaymentsQuery({query: "fullyConsumed=false"});

    const [
        addPayment,
        {
            isLoading: isSending,
            isSuccess: isPaymentSuccess,
            isError: isPaymentError,
            error: paymentError,
        },
    ] = useAddPaymentMutation();

    useEffect(() => {
        if (isPaymentSuccess) {
            toast({
                title: 'Success',
                description: 'Payment successful',
            })
        } else if (isPaymentError && paymentError) {
            toast({
                title: 'Error',
                description: paymentError.message,
                variant: 'error'
            })
        }
    }, [paymentError, isPaymentSuccess, toast, isPaymentError]);

    useEffect(() => {
        if (isLotSuccess) {
            const {lot} = lotData.data;
            setLotDetails(lot);
            setPayments(lot.paymentHistory)
            if (lot.paymentHistory?.length > 0) {
                const totalPaid = lot.paymentHistory?.reduce(
                    (sum, payment) => sum + payment.grossAmount, 0
                );
                setSettlementRemainingAmount(lot.mineralPrice - totalPaid);
            }
        }
    }, [isLotSuccess, lotData]);

    useEffect(() => {
        if (isDone) {
            const {payments} = adv.data;
            setAvailableAdvances(payments);
        }
    }, [isDone, adv]);

    // New payment form state
    const [newPayment, setNewPayment] = useState({
        grossAmount: '',
        paymentDate: new Date(),
        paymentMode: '',
        location: '',
        comment: '',
    });

    // useEffect(() => {
    //     fetchData();
    // }, [lotId]);

    // const fetchData = async () => {
    //     setIsLoading(true);
    //     try {
    //         // Fetch lot details
    //         const lotResponse = await axios.get(`/api/v1/lots/${lotId}`);
    //         setLotDetails(lotResponse.data.data);
    //
    //         // Fetch payments for this lot
    //         const paymentsResponse = await axios.get(`/api/v1/payments?lotId=${lotId}`);
    //         setPayments(paymentsResponse.data.data);
    //
    //         // Calculate remaining amount for settlement calculations
    //         if (lotResponse.data.data && paymentsResponse.data.data) {
    //             const lot = lotResponse.data.data;
    //             const totalPaid = paymentsResponse.data.data.reduce(
    //                 (sum, payment) => sum + payment.grossAmount, 0
    //             );
    //             setSettlementRemainingAmount(lot.totalValue - totalPaid);
    //         }
    //
    //         // Fetch available advance payments for the supplier
    //         if (lotResponse.data.data && lotResponse.data.data.supplierId) {
    //             const advancesResponse = await axios.get(
    //                 `/api/v1/advance-payments/supplier/${lotResponse.data.data.supplierId}/available`
    //             );
    //             setAvailableAdvances(advancesResponse.data.data);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //         toast({
    //             variant: "destructive",
    //             title: "Error",
    //             description: "Failed to fetch payment data. Please try again.",
    //         });
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPayment({ ...newPayment, [name]: value });

        // Recalculate payment preview when amount changes
        if (name === 'grossAmount') {
            calculatePaymentPreview(value);
        }
    };

    const calculatePaymentPreview = async (amount) => {
        if (!amount || isNaN(amount) || amount <= 0 || !lotDetails?.supplierId) return;

        try {
            const response = await axios.post('/api/v1/payments/preview', {
                supplierId: lotDetails.supplierId,
                grossAmount: parseFloat(amount),
                specifiedAdvances: selectedAdvances.length > 0 ? selectedAdvances : undefined
            });

            setPaymentPreview(response.data.data);
        } catch (error) {
            console.error('Error calculating payment preview:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to calculate payment preview.",
            });
        }
    };

    const handleAdvanceToggle = (advanceId) => {
        // Toggle the selection of advance payments for manual application
        const isSelected = selectedAdvances.includes(advanceId);

        if (isSelected) {
            setSelectedAdvances(selectedAdvances.filter(id => id !== advanceId));
        } else {
            setSelectedAdvances([...selectedAdvances, advanceId]);
        }

        // Recalculate preview with updated selected advances
        if (newPayment.grossAmount) {
            setTimeout(() => calculatePaymentPreview(newPayment.grossAmount), 0);
        }
    };

    const handlePaymentDateChange = (date) => {
        setNewPayment({ ...newPayment, paymentDate: date });
    };

    const handlePaymentModeChange = (value) => {
        setNewPayment({ ...newPayment, paymentMode: value });
    };

    const handleCreatePayment = async () => {
        // Validate required fields
        if (!newPayment.grossAmount || isNaN(newPayment.grossAmount) || parseFloat(newPayment.grossAmount) <= 0) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please enter a valid payment amount.",
            });
            return;
        }

        if (!newPayment.paymentMode) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please select a payment mode.",
            });
            return;
        }

        try {
            // Prepare payment data
            const paymentData = {
                entryId: lotDetails.entry?._id,
                supplierId: lotDetails.entry?.supplierId?._id,
                lotId: lotId,
                grossAmount: parseFloat(newPayment.grossAmount),
                paymentDate: newPayment.paymentDate,
                paymentMode: newPayment.paymentMode,
                location: newPayment.location,
                comment: newPayment.comment,
            };

            // If specific advances were selected, add them
            if (selectedAdvances.length > 0) {
                paymentData.advances = selectedAdvances;
            }


            await addPayment({body: paymentData});
            // Create payment
            // await axios.post('/api/v1/payments', paymentData);

            // toast({
            //     title: "Success",
            //     description: "Payment created successfully.",
            // });


            // Reset form and refresh data
            setNewPayment({
                grossAmount: '',
                paymentDate: new Date(),
                paymentMode: '',
                location: '',
                comment: '',
            });
            setSelectedAdvances([]);
            setPaymentPreview(null);
            setIsAddDialogOpen(false);
            // fetchData();

        } catch (error) {
            console.error('Error creating payment:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to create payment.",
            });
        }
    };

    const handleDeletePayment = async () => {
        if (!deletePaymentId) return;

        try {
            await axios.delete(`/api/v1/payments/${deletePaymentId}`);

            toast({
                title: "Success",
                description: "Payment deleted successfully.",
            });

            setDeletePaymentId(null);
            // fetchData();
        } catch (error) {
            console.error('Error deleting payment:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete payment.",
            });
        }
    };

    const toggleSettlementMode = () => {
        setIsSettlement(!isSettlement);
        if (!isSettlement) {
            // When enabling settlement mode, set the remaining amount as default
            setNewPayment({
                ...newPayment,
                grossAmount: settlementRemainingAmount.toString()
            });
            calculatePaymentPreview(settlementRemainingAmount);
        }
    };

    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    };

    if (isLoadingLot || isSending || isFetching) {
        return (
            <div className="container mx-auto p-6">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-32 w-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!lotDetails) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Lot not found</h1>
                <Button onClick={() => navigate('/lots')}>Back to Lots</Button>
            </div>
        );
    }

    const totalPaid = payments.reduce((sum, payment) => sum + payment.grossAmount, 0);
    const totalDeductions = payments.reduce((sum, payment) => sum + (payment.advanceDeductions || 0), 0);
    const totalNetPaid = payments.reduce((sum, payment) => sum + payment.netAmount, 0);
    const totalFees = handleConvertToUSD(lotDetails.fees?.reduce((acc, curr) => acc + curr.amount, 0), lotDetails.USDRate)
    const remainingToPay = lotDetails.mineralPrice - totalFees - totalPaid;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Lot Payments</h1>
                    <p className="text-gray-500">Manage payments for lot #{lotDetails.lotNumber}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/lots')}>
                        Back to Lots
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Payment
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create New Payment</DialogTitle>
                                <DialogDescription>
                                    Add a new payment for lot #{lotDetails.lotNumber}.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-1/2">
                                        <Label htmlFor="paymentType">Payment Type</Label>
                                        <div className="flex gap-4 mt-2">
                                            <Button
                                                variant={!isSettlement ? "default" : "outline"}
                                                onClick={() => toggleSettlementMode()}
                                                className="w-full"
                                            >
                                                Regular
                                            </Button>
                                            <Button
                                                variant={isSettlement ? "default" : "outline"}
                                                onClick={() => toggleSettlementMode()}
                                                className="w-full"
                                            >
                                                Settlement
                                                <Badge variant="outline" className="ml-2">
                                                    {formatCurrency(settlementRemainingAmount)}
                                                </Badge>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="w-1/2">
                                        <Label htmlFor="grossAmount">Payment Amount</Label>
                                        <div className="flex items-center mt-2">
                                            <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                                            <Input
                                                id="grossAmount"
                                                name="grossAmount"
                                                value={newPayment.grossAmount}
                                                onChange={handleInputChange}
                                                type="number"
                                                placeholder="Enter amount"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-1/2">
                                        <Label htmlFor="paymentDate">Payment Date</Label>
                                        <div className="mt-2">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start text-left font-normal"
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {newPayment.paymentDate ? format(newPayment.paymentDate, "PPP") : "Select date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                {/*<PopoverContent className="w-auto p-0">*/}
                                                {/*    <Calendar*/}
                                                {/*        mode="single"*/}
                                                {/*        selected={newPayment.paymentDate}*/}
                                                {/*        onSelect={handlePaymentDateChange}*/}
                                                {/*        initialFocus*/}
                                                {/*    />*/}
                                                {/*</PopoverContent>*/}
                                            </Popover>
                                        </div>
                                    </div>

                                    <div className="w-1/2">
                                        <Label htmlFor="paymentMode">Payment Mode</Label>
                                        <Select onValueChange={handlePaymentModeChange}>
                                            <SelectTrigger className="w-full mt-2">
                                                <SelectValue placeholder="Select payment mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Payment Modes</SelectLabel>
                                                    {Object.entries(PaymentModes).map(([key, value]) => (
                                                        <SelectItem key={key} value={key}>
                                                            {value}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={newPayment.location}
                                        onChange={handleInputChange}
                                        placeholder="Payment location"
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="comment">Comment</Label>
                                    <Input
                                        id="comment"
                                        name="comment"
                                        value={newPayment.comment}
                                        onChange={handleInputChange}
                                        placeholder="Add optional comment"
                                        className="mt-2"
                                    />
                                </div>

                                {/* Payment Preview */}
                                {paymentPreview && (
                                    <Card className="mt-4">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">Payment Preview</CardTitle>
                                            <CardDescription>
                                                How this payment will be processed
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Gross Amount:</span>
                                                    <span className="font-medium">{formatCurrency(paymentPreview.grossAmount)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Advance Deductions:</span>
                                                    <span className="font-medium text-amber-600">
                            -{formatCurrency(paymentPreview.advanceDeductions)}
                          </span>
                                                </div>
                                                <Separator className="my-2" />
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">Net Amount:</span>
                                                    <span className="font-semibold text-green-600">
                            {formatCurrency(paymentPreview.netAmount)}
                          </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Available Advances */}
                                {availableAdvances?.length > 0 && (
                                    <Accordion type="single" collapsible className="mt-2">
                                        <AccordionItem value="advances">
                                            <AccordionTrigger>
                                                Available Advances ({availableAdvances?.length})
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                                    {availableAdvances?.map((advance) => (
                                                        <div
                                                            key={advance._id}
                                                            className={`flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer ${
                                                                selectedAdvances.includes(advance._id) ? 'bg-blue-50 border-blue-300' : ''
                                                            }`}
                                                            onClick={() => handleAdvanceToggle(advance._id)}
                                                        >
                                                            <div>
                                                                <div className="font-medium">{advance.beneficiary}</div>
                                                                <div className="text-sm text-gray-500">
                                                                    Remaining: {formatCurrency(advance.remainingAmount)}
                                                                </div>
                                                                <div className="text-xs text-gray-400">
                                                                    {format(new Date(advance.paymentDate), 'MMM d, yyyy')}
                                                                </div>
                                                            </div>
                                                            {selectedAdvances.includes(advance._id) ? (
                                                                <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                                                                    Selected
                                                                </Badge>
                                                            ) : paymentPreview?.appliedAdvances?.some(
                                                                a => a.advanceId === advance._id
                                                            ) && (
                                                                <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    Auto-Applied
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                )}
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={handleCreatePayment}>Create Payment</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Lot Information Card */}
            <Card className="mb-6">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Lot Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Lot Number</h3>
                            <p className="font-semibold">{lotDetails.lotNumber}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Beneficiary</h3>
                            <p className="font-semibold">{lotDetails.beneficiary || 'N/A'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Mineral Type</h3>
                            <p className="font-semibold">{lotDetails.docModel || 'N/A'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                            <p className="font-semibold">{lotDetails.weightOut} kg</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Mineral Price</h3>
                            <p className="font-semibold">{formatCurrency(lotDetails.mineralPrice || 0)}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Total Fees</h3>
                            <p className="font-semibold">{formatCurrency(totalFees || 0)}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Total to be paid</h3>
                            <p className={`font-semibold ${remainingToPay > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                                {formatCurrency((lotDetails.mineralPrice - totalFees) || 0 )}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Remaining</h3>
                            <p className={`font-semibold ${remainingToPay > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                                {formatCurrency(remainingToPay || 0)}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Already Paid</h3>
                            <p className="font-semibold">{formatCurrency(totalPaid)}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Status</h3>
                            <Badge
                                variant={remainingToPay <= 0 ? "success" : "outline"}
                                className={remainingToPay <= 0 ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                            >
                                {remainingToPay <= 0 ? "Fully Paid" : "Partially Paid"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Tabs */}
            <Tabs defaultValue="payments" value={tabView} onValueChange={setTabView} className="mb-6">
                <TabsList>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="summary">Payment Summary</TabsTrigger>
                    <TabsTrigger value="advances">Applied Advances</TabsTrigger>
                </TabsList>

                <TabsContent value="payments">
                    {payments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Gross Amount</TableHead>
                                    <TableHead>Advance Deductions</TableHead>
                                    <TableHead>Net Paid</TableHead>
                                    <TableHead>Payment Mode</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment._id}>
                                        <TableCell>
                                            {format(new Date(payment.paymentDate), 'MMM d, yyyy')}
                                            <div className="text-xs text-gray-500">
                                                {formatDistanceToNow(new Date(payment.paymentDate), { addSuffix: true })}
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatCurrency(payment.grossAmount)}</TableCell>
                                        <TableCell>
                                            {payment.advanceDeductions > 0 ? (
                                                <span className="text-amber-600">
                          -{formatCurrency(payment.advanceDeductions)}
                        </span>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {formatCurrency(payment.netAmount)}
                                        </TableCell>
                                        <TableCell>
                                            {PaymentModes[payment.paymentMode] || payment.paymentMode || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => navigate(`/payments/${payment._id}`)}
                                                >
                                                    <FileEdit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeletePaymentId(payment._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will delete the payment and restore any advance payments used.
                                                                This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleDeletePayment}>
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {/* Summary Row */}
                                <TableRow className="bg-slate-50">
                                    <TableCell className="font-medium">Total</TableCell>
                                    <TableCell className="font-medium">{formatCurrency(totalPaid)}</TableCell>
                                    <TableCell className="font-medium text-amber-600">
                                        {totalDeductions > 0 ? `-${formatCurrency(totalDeductions)}` : '-'}
                                    </TableCell>
                                    <TableCell className="font-medium text-green-600">
                                        {formatCurrency(totalNetPaid)}
                                    </TableCell>
                                    <TableCell colSpan={2}></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 border rounded-md">
                            <p className="text-gray-500">No payments recorded for this lot yet.</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => setIsAddDialogOpen(true)}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add First Payment
                            </Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="summary">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Summary</CardTitle>
                                <CardDescription>Overview of all payments for this lot</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total Lot Value:</span>
                                        <span className="font-semibold">{formatCurrency(lotDetails.mineralPrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Separator/>
                                    </div>
                                    <div>
                                        <h2>Fees</h2>
                                    </div>
                                    {lotDetails.fees?.length > 0 && lotDetails.fees.map((fee, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-gray-600">{index + 1}) {fee.feeType?.title}</span>
                                            <span className="font-semibold">
                                                {formatCurrency(fee.feeType?.currency === 'USD' ? fee.amount : handleConvertToUSD(fee.amount, lotDetails.USDRate))}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center">
                                        <Separator/>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total Fees deducted</span>
                                        <span
                                            className="font-semibold">-{formatCurrency(totalFees || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Separator/>
                                    </div>
                                    <div>
                                        <h2>Advances</h2>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Advance Deductions:</span>
                                        <span
                                            className="font-semibold text-amber-600">-{formatCurrency(totalDeductions)}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <Separator/>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total amounts to be paid: </span>
                                        <span
                                            className="font-semibold">{formatCurrency((lotDetails.mineralPrice - totalFees - totalDeductions) || 0)}</span>
                                    </div>


                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total Payments Made:</span>
                                        <span className="font-semibold">{formatCurrency((totalPaid - totalDeductions) || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Net Cash Paid:</span>
                                        <span
                                            className="font-semibold text-green-600">{formatCurrency(totalNetPaid || 0)}</span>
                                    </div>
                                    <Separator/>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Remaining to Pay:</span>
                                        <span className={`font-bold ${remainingToPay > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                                            {formatCurrency(remainingToPay || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Payment Progress:</span>
                                        <span className="font-semibold">
                                          {lotDetails.mineralPrice > 0
                                              ? Math.round((totalPaid / (lotDetails.mineralPrice - (totalFees || 0) - (totalDeductions || 0))) * 100)
                                              : 100}%
                                        </span>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{
                                            width: `${lotDetails.totalValue > 0
                                                ? Math.min(100, (totalPaid / lotDetails.totalValue) * 100)
                                                : 100}%`
                                        }}></div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                {remainingToPay > 0 ? (
                                    <Button
                                        onClick={() => {
                                            setIsSettlement(true);
                                            setNewPayment({
                                                ...newPayment,
                                                grossAmount: remainingToPay.toString()
                                            });
                                            calculatePaymentPreview(remainingToPay);
                                            setIsAddDialogOpen(true);
                                        }}
                                        className="w-full"
                                    >
                                        <ArrowDownUp className="mr-2 h-4 w-4" />
                                        Settle Remaining Amount
                                    </Button>
                                ) : (
                                    <Badge className="w-full justify-center py-2 bg-green-100 text-green-800 hover:bg-green-200">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Fully Paid
                                    </Badge>
                                )}
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment History</CardTitle>
                                <CardDescription>Timeline of payments for this lot</CardDescription>
                            </CardHeader>
                            <CardContent className="max-h-96 overflow-y-auto">
                                {payments.length > 0 ? (
                                    <div className="space-y-4">
                                        {payments.map((payment, index) => (
                                            <div key={payment._id} className="flex items-start gap-4">
                                                <div className="min-w-10 flex flex-col items-center">
                                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                                                        {index + 1}
                                                    </div>
                                                    {index < payments.length - 1 && (
                                                        <div className="w-0.5 h-12 bg-blue-200"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 border rounded-lg p-4">
                                                    <div className="flex justify-between mb-2">
                                                        <div className="font-medium">
                                                            {format(new Date(payment.paymentDate), 'MMM d, yyyy')}
                                                        </div>
                                                        <Badge variant="outline">
                                                            {PaymentModes[payment.paymentMode] || payment.paymentMode}
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span>Gross Amount:</span>
                                                            <span>{formatCurrency(payment.grossAmount)}</span>
                                                        </div>
                                                        {payment.advanceDeductions > 0 && (
                                                            <div className="flex justify-between text-sm">
                                                                <span>Advance Deductions:</span>
                                                                <span className="text-amber-600">-{formatCurrency(payment.advanceDeductions)}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between text-sm font-medium">
                                                            <span>Net Amount:</span>
                                                            <span className="text-green-600">{formatCurrency(payment.netAmount)}</span>
                                                        </div>
                                                    </div>
                                                    {payment.comment && (
                                                        <div className="mt-2 text-sm text-gray-500 italic">
                                                            "{payment.comment}"
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No payment history available.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="advances">
                    <Card>
                        <CardHeader>
                            <CardTitle>Applied Advances</CardTitle>
                            <CardDescription>
                                Advance payments applied to this lot
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {payments.some(p => p.appliedAdvances?.length > 0) ? (
                                <div className="space-y-6">
                                    {payments.filter(p => p.appliedAdvances?.length > 0).map((payment) => (
                                        <div key={payment._id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className="font-medium">
                                                        Payment on {format(new Date(payment.paymentDate), 'MMM d, yyyy')}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {formatCurrency(payment.grossAmount)} - {PaymentModes[payment.paymentMode] || payment.paymentMode}
                                                    </p>
                                                </div>
                                                <Badge variant="outline" className="bg-amber-50">
                                                    {payment.appliedAdvances?.length} Advances Applied
                                                </Badge>
                                            </div>

                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Advance Date</TableHead>
                                                        <TableHead>Beneficiary</TableHead>
                                                        <TableHead>Applied Amount</TableHead>
                                                        <TableHead>Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {payment.appliedAdvances?.map((appliedAdvance) => (
                                                        <TableRow key={appliedAdvance.advanceId}>
                                                            <TableCell>
                                                                {format(new Date(appliedAdvance.appliedOn), 'MMM d, yyyy')}
                                                            </TableCell>
                                                            <TableCell>{appliedAdvance.advanceId?.beneficiary}</TableCell>
                                                            <TableCell>{formatCurrency(appliedAdvance.amountApplied)}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                                                    {appliedAdvance.advanceId?.fullyConsumed ? 'Fully Applied' : 'Partially Applied'}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border rounded-md">
                                    <p className="text-gray-500">No advance payments have been applied to this lot.</p>

                                    {availableAdvances?.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm mb-2">
                                                There are {availableAdvances.length} available advances for this supplier.
                                            </p>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setTabView("payments");
                                                    setIsAddDialogOpen(true);
                                                }}
                                            >
                                                Create Payment with Advances
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Quick Actions */}
            {remainingToPay > 0 && (
                <Card className="mt-4">
                    <CardHeader className="pb-2">
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        <Button
                            onClick={() => {
                                setIsSettlement(true);
                                setNewPayment({
                                    ...newPayment,
                                    grossAmount: remainingToPay.toString()
                                });
                                calculatePaymentPreview(remainingToPay);
                                setIsAddDialogOpen(true);
                            }}
                            className="flex-1"
                        >
                            <ArrowDownUp className="mr-2 h-4 w-4" />
                            Settle Full Amount ({formatCurrency(remainingToPay)})
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsSettlement(false);
                                setNewPayment({
                                    ...newPayment,
                                    grossAmount: Math.round(remainingToPay / 2).toString()
                                });
                                calculatePaymentPreview(Math.round(remainingToPay / 2));
                                setIsAddDialogOpen(true);
                            }}
                            className="flex-1"
                        >
                            <DollarSign className="mr-2 h-4 w-4" />
                            Partial Payment
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default LotPaymentsPage;