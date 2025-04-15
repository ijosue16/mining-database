import {useEffect, useState} from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {useParams} from "react-router-dom";
import {useAddShipmentMutation} from "@/states/apislice.js";

export default function ShipmentForm() {

    const { model } = useParams();

    const [formData, setFormData] = useState({
        iTSCiShipmentNumber: '',
        buyerName: '',
        shipmentNumber: '',
        shipmentMinerals: model
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [
        AddShipment,
        { isLoading: isSending, isError: isFailed, isSuccess: isSent, error: fail },
    ] = useAddShipmentMutation();

    useEffect(() => {
        setFormData(prev => ({...prev, shipmentMinerals: model}));
    }, [model]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // This would be replaced with your actual API call
            console.log('Submitting shipment data:', formData);

            const body = {...formData, model: formData.shipmentMinerals};
            await AddShipment({ body });
            // Simulate API request
            // await new Promise(resolve => setTimeout(resolve, 1000));

            setSubmitStatus({ success: true, message: 'Shipment created successfully!' });
            // Optionally reset form
            // setFormData({ iTSCiShipmentNumber: '', buyerName: '', shipmentNumber: '', shipmentMinerals: '' });
        } catch (error) {
            setSubmitStatus({
                success: false,
                message: 'Failed to create shipment. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Create New Shipment</CardTitle>
                    <CardDescription>Enter the details for the new shipment record</CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {submitStatus && (
                            <Alert variant={submitStatus.success ? "default" : "destructive"} className={submitStatus.success ? "bg-green-50 border-green-200" : ""}>
                                {submitStatus.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                <AlertTitle>{submitStatus.success ? "Success" : "Error"}</AlertTitle>
                                <AlertDescription>{submitStatus.message}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="shipmentNumber">Shipment Number *</Label>
                            <Input
                                id="shipmentNumber"
                                name="shipmentNumber"
                                value={formData.shipmentNumber}
                                onChange={handleChange}
                                placeholder="Enter shipment number"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="iTSCiShipmentNumber">iTSCi Shipment Number</Label>
                            <Input
                                id="iTSCiShipmentNumber"
                                name="iTSCiShipmentNumber"
                                value={formData.iTSCiShipmentNumber}
                                onChange={handleChange}
                                placeholder="Enter iTSCi shipment number"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="buyerName">Buyer Name</Label>
                            <Input
                                id="buyerName"
                                name="buyerName"
                                value={formData.buyerName}
                                onChange={handleChange}
                                placeholder="Enter buyer name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="shipmentMinerals">Shipment Minerals</Label>
                            <Input
                                id="shipmentMinerals"
                                name="shipmentMinerals"
                                disabled={true}
                                value={formData.shipmentMinerals}
                                onChange={handleChange}
                                placeholder="Enter minerals contained in shipment"
                            />
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting || !formData.shipmentNumber}
                        >
                            {isSubmitting ? "Creating..." : "Create Shipment"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}