import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, message } from 'antd';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCreateFeeTypeMutation } from '@/states/apislice.js';

// Validation schema
const feeTypeSchema = z.object({
    title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
    description: z.string().optional(),
    rate: z.number().positive({ message: 'Rate must be a positive number' }).optional().or(z.string().transform(val => val === '' ? undefined : Number(val))),
    model: z.enum(['cassiterite', 'coltan', 'wolframite', 'lithium', 'beryllium']).optional(),
    currency: z.enum(["USD", 'RWF'])
});

const CreateFeeTypeForm = ({ onSuccess }) => {
    const [createFeeType, { isLoading }] = useCreateFeeTypeMutation();

    const form = useForm({
        resolver: zodResolver(feeTypeSchema),
        defaultValues: {
            title: '',
            description: '',
            rate: '',
            model: '',
            currency: 'RWF'
        }
    });

    const onSubmit = async (data) => {
        try {
            // Convert rate to number if it's a string
            if (typeof data.rate === 'string' && data.rate) {
                data.rate = parseFloat(data.rate);
            }

            await createFeeType({body: data}).unwrap();
            message.success('Fee type created successfully');
            onSuccess();
            form.reset();
        } catch (error) {
            message.error('Failed to create fee type');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title*</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter fee type title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Provide a description for this fee type"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rate</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Enter rate amount"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Model*</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="cassiterite">Cassiterite</SelectItem>
                                    <SelectItem value="coltan">Coltan</SelectItem>
                                    <SelectItem value="wolframite">Wolframite</SelectItem>
                                    <SelectItem value="lithium">Lithium</SelectItem>
                                    <SelectItem value="beryllium">Beryllium</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a currency" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="RWF">RWF</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button onClick={() => onSuccess()}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Create Fee Type
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default CreateFeeTypeForm;