// import React from 'react';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Switch } from '@/components/ui/switch';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { DatePicker } from '@/components/ui/date-picker';
// import { format } from 'date-fns';
//
// /**
//  * Returns the appropriate form component based on the data type
//  *
//  * @param {string} type - JavaScript typeof result for the field
//  * @param {any} value - The current value to help determine more specific types
//  * @returns {React.ComponentType} - The appropriate form component
//  */
// export const getFieldComponent = (type, value) => {
//     // For null or undefined values, use text input as default
//     if (value === null || value === undefined) {
//         return props => <Input type="text" {...props} />;
//     }
//
//     switch (type) {
//         case 'boolean':
//             return props => (
//                 <Switch
//                     checked={props.value}
//                     onCheckedChange={props.onChange}
//                     disabled={props.disabled}
//                 />
//             );
//
//         case 'number':
//             return props => (
//                 <Input
//                     type="number"
//                     {...props}
//                     value={props.value}
//                     onChange={e => props.onChange(parseFloat(e.target.value) || 0)}
//                 />
//             );
//
//         case 'string': {
//             // Check if it's a long string
//             if (value && value.length > 100) {
//                 return props => (
//                     <Textarea
//                         {...props}
//                         value={props.value}
//                         onChange={e => props.onChange(e.target.value)}
//                     />
//                 );
//             }
//
//             // Check if it's a date string
//             if (value && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
//                 return props => (
//                     <DatePicker
//                         date={props.value ? new Date(props.value) : null}
//                         setDate={date => props.onChange(date ? date.toISOString() : null)}
//                         disabled={props.disabled}
//                         className={props.className}
//                     />
//                 );
//             }
//
//             // Default to text input
//             return props => (
//                 <Input
//                     type="text"
//                     {...props}
//                     value={props.value}
//                     onChange={e => props.onChange(e.target.value)}
//                 />
//             );
//         }
//
//         case 'object': {
//             // For Date objects
//             if (value instanceof Date) {
//                 return props => (
//                     <DatePicker
//                         date={props.value instanceof Date ? props.value : new Date(props.value)}
//                         setDate={date => props.onChange(date)}
//                         disabled={props.disabled}
//                         className={props.className}
//                     />
//                 );
//             }
//
//             // For arrays with defined options
//             if (Array.isArray(value) && value.length <= 10) {
//                 return props => (
//                     <Select
//                         value={String(props.value)}
//                         onValueChange={props.onChange}
//                         disabled={props.disabled}
//                     >
//                         <SelectTrigger className={props.className}>
//                             <SelectValue placeholder="Select an option" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {value.map((option, index) => (
//                                 <SelectItem key={index} value={String(option)}>
//                                     {String(option)}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 );
//             }
//
//             // For complex objects, use a textarea with JSON
//             return props => (
//                 <Textarea
//                     {...props}
//                     value={JSON.stringify(props.value, null, 2)}
//                     onChange={e => {
//                         try {
//                             props.onChange(JSON.parse(e.target.value));
//                         } catch (error) {
//                             // If not valid JSON, just store as string
//                             props.onChange(e.target.value);
//                         }
//                     }}
//                 />
//             );
//         }
//
//         default:
//             // Default fallback for any other types
//             return props => (
//                 <Input
//                     type="text"
//                     {...props}
//                     value={String(props.value)}
//                     onChange={e => props.onChange(e.target.value)}
//                 />
//             );
//     }
// };
//
// /**
//  * Format different types of values for display
//  *
//  * @param {any} value - The value to format
//  * @returns {string} - Formatted value for display
//  */
// export const formatValue = (value) => {
//     if (value === null || value === undefined) {
//         return 'N/A';
//     }
//
//     if (typeof value === 'boolean') {
//         return value ? 'Yes' : 'No';
//     }
//
//     if (typeof value === 'object') {
//         // Format Date objects
//         if (value instanceof Date) {
//             return format(value, 'PPP');
//         }
//
//         // Format arrays
//         if (Array.isArray(value)) {
//             if (value.length === 0) return '(Empty array)';
//             if (value.length <= 3) return value.map(String).join(', ');
//             return `${value.length} items`;
//         }
//
//         // Format other objects
//         return JSON.stringify(value);
//     }
//
//     return String(value);
// };



import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from 'antd';
import { format } from 'date-fns';


/**
 * Returns the appropriate form component based on the data type
 *
 * @param {string} type - JavaScript typeof result for the field
 * @param {any} value - The current value to help determine more specific types
 * @returns {React.ComponentType} - The appropriate form component
 */
export const getFieldComponent = (type, value) => {
    // For null or undefined values, use text input as default
    if (value === null || value === undefined) {
        return props => <Input type="text" {...props} />;
    }

    switch (type) {
        case 'boolean':
            return props => (
                <Switch
                    checked={props.value}
                    onCheckedChange={props.onChange}
                    disabled={props.disabled}
                />
            );

        case 'number':
            return props => (
                <Input
                    type="number"
                    {...props}
                    value={props.value}
                    onChange={e => props.onChange(parseFloat(e.target.value) || 0)}
                />
            );

        case 'string': {
            // Check if it's a long string
            if (value && value.length > 100) {
                return props => (
                    <Textarea
                        {...props}
                        value={props.value}
                        onChange={e => props.onChange(e.target.value)}
                    />
                );
            }

            // Check if it's a date string
            if (value && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                return props => (
                    <DatePicker
                        value={props.value ? new Date(props.value) : null}
                        onChange={date => props.onChange(date ? date.toISOString() : null)}
                        disabled={props.disabled}
                        className={props.className}
                    />
                );
            }

            // Default to text input
            return props => (
                <Input
                    type="text"
                    {...props}
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                />
            );
        }

        case 'object': {
            // For Date objects
            if (value instanceof Date) {
                return props => (
                    <DatePicker
                        value={props.value instanceof Date ? props.value : new Date(props.value)}
                        onChange={date => props.onChange(date)}
                        disabled={props.disabled}
                        className={props.className}
                    />
                );
            }

            // For arrays with defined options
            if (Array.isArray(value) && value.length <= 10) {
                return props => (
                    <Select
                        value={String(props.value)}
                        onValueChange={props.onChange}
                        disabled={props.disabled}
                    >
                        <SelectTrigger className={props.className}>
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                            {value.map((option, index) => (
                                <SelectItem key={index} value={String(option)}>
                                    {String(option)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            }

            // For complex objects, use a textarea with JSON
            return props => (
                <Textarea
                    {...props}
                    value={JSON.stringify(props.value, null, 2)}
                    onChange={e => {
                        try {
                            props.onChange(JSON.parse(e.target.value));
                        } catch (error) {
                            // If not valid JSON, just store as string
                            props.onChange(e.target.value);
                        }
                    }}
                />
            );
        }

        default:
            // Default fallback for any other types
            return props => (
                <Input
                    type="text"
                    {...props}
                    value={String(props.value)}
                    onChange={e => props.onChange(e.target.value)}
                />
            );
    }
};

/**
 * Format different types of values for display
 *
 * @param {any} value - The value to format
 * @returns {string} - Formatted value for display
 */
export const formatValue = (value) => {
    if (value === null || value === undefined) {
        return 'N/A';
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    if (typeof value === 'object') {
        // Format Date objects
        if (value instanceof Date) {
            return format(value, 'PPP');
        }

        // Format arrays
        if (Array.isArray(value)) {
            if (value.length === 0) return '(Empty array)';
            if (value.length <= 3) return value.map(String).join(', ');
            return `${value.length} items`;
        }

        // Format other objects
        return JSON.stringify(value);
    }

    return String(value);
};