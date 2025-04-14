import React, { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Download, Eye, Tag, Clock, Calendar, Info, FileText, Package, Truck, CreditCard } from "lucide-react";
import { format } from "date-fns";
import {useGetEntryQuery} from "@/states/apislice.js";
import FetchingPage from "@/Pages/FetchingPage.jsx";

const EntryDetailsPage = () => {
    const { entryId, model } = useParams();
    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();


    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error: entryError
    } = useGetEntryQuery(
        { entryId, model },
        {
            skip: entryId === undefined,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
        }
    );

    useEffect(() => {
        if (isSuccess) {
            const { data: info } = data;
            const { entry } = info;
            setEntry(entry);
            // setLotInfo(entr.output);
        }
    }, [isSuccess, data]);

    // useEffect(() => {
    //     const fetchEntryDetails = async () => {
    //         try {
    //             setLoading(true);
    //             // Replace with your actual API endpoint
    //             const response = await fetch(`/api/entries/${id}`);
    //             if (!response.ok) {
    //                 throw new Error("Failed to fetch entry details");
    //             }
    //             const data = await response.json();
    //             setEntry(data);
    //             setLoading(false);
    //         } catch (err) {
    //             setError(err.message);
    //             setLoading(false);
    //         }
    //     };
    //
    //     fetchEntryDetails();
    // }, [id]);

    if (isLoading) return <FetchingPage/>;
    if (isError) return <div className="text-red-500 p-4">Error: {entryError.data?.message}</div>;
    if (!entry) return <div className="p-4">No entry found</div>;

    // Determine mineral type specific fields and display logic
    const getMineralTypeSpecificFields = (lot) => {
        switch(entry.mineralType?.toLowerCase()) {
            case 'coltan':
                return (
                    <>
                        <TableRow>
                            <TableCell className="font-medium">Tantal</TableCell>
                            <TableCell>{lot.tantal || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Niobium</TableCell>
                            <TableCell>{lot.niobium || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Iron</TableCell>
                            <TableCell>{lot.iron || "N/A"}</TableCell>
                        </TableRow>
                    </>
                );
            case 'cassiterite':
                return (
                    <>
                        <TableRow>
                            <TableCell className="font-medium">London Metal Exchange</TableCell>
                            <TableCell>{lot.londonMetalExchange || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Treatment Charges</TableCell>
                            <TableCell>{lot.treatmentCharges || "N/A"}</TableCell>
                        </TableRow>
                    </>
                );
            case 'wolframite':
                return (
                    <TableRow>
                        <TableCell className="font-medium">Metric Ton Unit</TableCell>
                        <TableCell>{lot.metricTonUnit || "N/A"}</TableCell>
                    </TableRow>
                );
            case 'lithium':
            case 'beryllium':
                return (
                    <TableRow>
                        <TableCell className="font-medium">RMA Fee Decision</TableCell>
                        <TableCell>
                            <Badge variant={lot.rmaFeeDecision === "exempted" ? "outline" : "default"}>
                                {lot.rmaFeeDecision || "N/A"}
                            </Badge>
                        </TableCell>
                    </TableRow>
                );
            default:
                return null;
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "PPP");
        } catch (err) {
            return dateString;
        }
    };

    return (
        <div className="container mx-auto py-6 max-w-6xl">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold">Entry Details</h1>
            </div>

            <Card className="mb-8">
                <CardHeader className="bg-slate-50">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-xl">
                                {entry.supplierId?.companyName}{" "}
                                <Badge className="ml-2">{entry.mineralType || "Unknown Type"}</Badge>
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Entry #{entryId.substring(0, 8)}
                            </CardDescription>
                        </div>
                        {/*<div className="flex space-x-2">*/}
                        {/*    <Button variant="outline" size="sm">*/}
                        {/*        <Download className="h-4 w-4 mr-2" />*/}
                        {/*        Export*/}
                        {/*    </Button>*/}
                        {/*</div>*/}
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Info className="h-4 w-4 mr-2" /> Company Information
                            </h3>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Company Name</TableCell>
                                        <TableCell>{entry.supplierId?.companyName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">License Number</TableCell>
                                        <TableCell>{entry.supplierId?.licenseNumber || "N/A"}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">TIN Number</TableCell>
                                        <TableCell>{entry.supplierId?.TINNumber || "N/A"}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Company Representative</TableCell>
                                        <TableCell>{entry.supplierId?.companyRepresentative || "N/A"}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Phone Number</TableCell>
                                        <TableCell>{entry.supplierId?.representativePhoneNumber || "N/A"}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Beneficiary</TableCell>
                                        <TableCell>{entry.beneficiary || entry.supplierId?.companyRepresentative || "N/A"}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <FileText className="h-4 w-4 mr-2" /> Supply Details
                            </h3>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Supply Date</TableCell>
                                        <TableCell>{formatDate(entry.supplyDate)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Supply Time</TableCell>
                                        <TableCell>{entry.time || "N/A"}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Weight In</TableCell>
                                        <TableCell>{entry.weightIn ? `${entry.weightIn} kg` : "N/A"}</TableCell>
                                    </TableRow>
                                    {(entry.mineralType?.toLowerCase() !== 'lithium' && entry.mineralType?.toLowerCase() !== 'beryllium') && (
                                        <>
                                            <TableRow>
                                                <TableCell className="font-medium">Number of Tags</TableCell>
                                                <TableCell>{entry.numberOfTags || "N/A"}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Mine Tags</TableCell>
                                                <TableCell>
                                                    {entry.mineTags && entry.mineTags.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {entry.mineTags.map((tag, idx) => (
                                                                <Badge key={idx} variant="outline" className="flex items-center">
                                                                    <Tag className="h-3 w-3 mr-1" />
                                                                    {typeof tag === 'object' ? tag.tagNumber : ""}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    ) : "N/A"}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Negociant Tags</TableCell>
                                                <TableCell>
                                                    {entry.negociantTags && entry.negociantTags.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {entry.negociantTags.map((tag, idx) => (
                                                                <Badge key={idx} variant="outline" className="flex items-center">
                                                                    <Tag className="h-3 w-3 mr-1" />
                                                                    {typeof tag === 'object' ? tag._id : tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    ) : "N/A"}
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {entry.comment && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Comment</h3>
                            <div className="bg-slate-50 p-4 rounded-md">
                                {entry.comment}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Tabs defaultValue="lots" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="lots">Output Lots</TabsTrigger>
                    <TabsTrigger value="shipments">Shipment History</TabsTrigger>
                    <TabsTrigger value="payments">Payment History</TabsTrigger>
                </TabsList>

                <TabsContent value="lots" className="space-y-6">
                    {entry.output && entry.output.length > 0 ? (
                        entry.output.map((lot, index) => (
                            <Card key={index} className="overflow-hidden">
                                <CardHeader className="bg-slate-50 pb-3">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">
                                            Lot #{lot.lotNumber}{" "}
                                            <Badge variant="outline" className="ml-2">
                                                {lot.weightOut} kg
                                            </Badge>
                                        </CardTitle>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-sm font-semibold mb-3 flex items-center text-gray-500">
                                                <Package className="h-4 w-4 mr-1" /> Lot Information
                                            </h4>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Weight Out</TableCell>
                                                        <TableCell>{lot.weightOut} kg</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Mineral Grade</TableCell>
                                                        <TableCell>{lot.mineralGrade || "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Mineral Price</TableCell>
                                                        <TableCell>{lot.mineralPrice ? `$${lot.mineralPrice}` : "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">ASIR</TableCell>
                                                        <TableCell>{lot.ASIR || "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Pricing Grade</TableCell>
                                                        <TableCell>{lot.pricingGrade || "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Sample Identification</TableCell>
                                                        <TableCell>{lot.sampleIdentification || "N/A"}</TableCell>
                                                    </TableRow>

                                                    {/* Mineral type specific fields */}
                                                    {getMineralTypeSpecificFields(lot)}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-semibold mb-3 flex items-center text-gray-500">
                                                <CreditCard className="h-4 w-4 mr-1" /> Financial Information
                                            </h4>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className="font-medium">RMA Fee (RWF)</TableCell>
                                                        <TableCell>{lot.rmaFeeRWF || "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">USD Rate</TableCell>
                                                        <TableCell>{lot.USDRate || "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">RMA Fee Decision</TableCell>
                                                        <TableCell>
                                                            <Badge variant={lot.rmaFeeDecision === "pending" ? "outline" : "default"}>
                                                                {lot.rmaFeeDecision}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Price Per Unit</TableCell>
                                                        <TableCell>{lot.pricePerUnit ? `$${lot.pricePerUnit}` : "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Non Sell Agreement</TableCell>
                                                        <TableCell>
                                                            {lot.nonSellAgreement?.weight ? (
                                                                <div>
                                                                    <div>{lot.nonSellAgreement.weight} kg</div>
                                                                    <div className="text-xs text-gray-500">
                                                                        Date: {formatDate(lot.nonSellAgreement.date)}
                                                                    </div>
                                                                </div>
                                                            ) : "N/A"}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>

                                    {lot.comment && (
                                        <div className="mt-6">
                                            <h4 className="text-sm font-semibold mb-2">Lot Comment</h4>
                                            <div className="bg-slate-50 p-3 rounded-md text-sm">
                                                {lot.comment}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No output lots found for this entry.
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="shipments">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Shipment History</CardTitle>
                            <CardDescription>
                                Record of all shipments related to this entry
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {entry.output && entry.output.some(lot => lot.shipmentHistory && lot.shipmentHistory.length > 0) ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Lot #</TableHead>
                                            <TableHead>Shipment #</TableHead>
                                            <TableHead>Weight</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {entry.output.flatMap((lot, lotIndex) =>
                                            (lot.shipmentHistory || []).map((shipment, shipIndex) => (
                                                <TableRow key={`${lotIndex}-${shipIndex}`}>
                                                    <TableCell>{lot.lotNumber}</TableCell>
                                                    <TableCell>{shipment.shipmentNumber}</TableCell>
                                                    <TableCell>{shipment.weight} kg</TableCell>
                                                    <TableCell>{formatDate(shipment.date)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No shipment history found.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payments">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Payment History</CardTitle>
                            <CardDescription>
                                Record of all payments related to this entry
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {entry.output && entry.output.some(lot => lot.paymentHistory && lot.paymentHistory.length > 0) ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Lot #</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Currency</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Payment Mode</TableHead>
                                            <TableHead>Beneficiary</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {entry.output.flatMap((lot, lotIndex) =>
                                            (lot.paymentHistory || []).map((payment, paymentIndex) => (
                                                <TableRow key={`${lotIndex}-${paymentIndex}`}>
                                                    <TableCell>{lot.lotNumber}</TableCell>
                                                    <TableCell>{payment.paymentAmount}</TableCell>
                                                    <TableCell>{payment.currency || "USD"}</TableCell>
                                                    <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                                                    <TableCell>{payment.paymentMode}</TableCell>
                                                    <TableCell>{payment.beneficiary}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No payment history found.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default EntryDetailsPage;