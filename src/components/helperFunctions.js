import {Button, DatePicker, message, notification, Popover, Radio, Space} from "antd";
import dayjs from "dayjs";
import {IoTrashBinOutline} from "react-icons/io5";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import {motion} from "framer-motion";
import {BiSolidEditAlt} from "react-icons/bi";
import {FaFileInvoiceDollar} from "react-icons/fa";
import {MdDelete} from "react-icons/md";
import {FiEdit} from "react-icons/fi";
import LotManagement from "@/Pages/Lot/LotManagement.jsx";
import {View} from "lucide-react";
import React from "react";

const specialStrings = [
    "TINNumber",
    "rmaFee",
    "USDRate",
    "rmaFeeUSD",
    "rmaFeeRWF",
];

export function toCamelCase(str) {
    if (str === "TIN Number") return "TINNumber";
    if (str === "RMA Fee") return "rmaFee";
    if (str === "USD Rate") return "USDRate";
    if (str === "RMA Fee USD") return "rmaFeeUSD";
    if (str === "RMA Fee RWF") return "rmaFeeRWF";
    return str
        .split(" ")
        .map((word, index) => {
            if (index === 0) {
                return word.toLowerCase();
            } else {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
        })
        .join("");
}

export function toInitialCase(camelCaseString) {
    if (camelCaseString === "TINNumber") return "TIN Number";
    if (camelCaseString === "rmaFee") return "RMA Fee";
    if (camelCaseString === "USDRate") return "USD Rate";
    if (camelCaseString === "rmaFeeUSD") return "RMA Fee USD";
    if (camelCaseString === "rmaFeeRWF") return "RMA Fee RWF";
    // if (specialStrings.includes(camelCaseString)) return camelCaseString;
    return camelCaseString
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, function (str) {
            return str.toUpperCase();
        });
}

export function FormatTolabelCase(inputString) {
    // Ensure the input is a non-empty string
    if (typeof inputString !== "string" || inputString.length === 0) {
        return inputString;
    }
    if (inputString === "TINNumber") {
        return "TIN number";
    } else if (inputString === "representativePhoneNumber") {
        return "Representative phone nbr";
    } else if (inputString === "representativeId") {
        return "Representative ID number";
    } else {
        // Replace capital letters with space + lowercase letter
        const formattedString = inputString.replace(
            /[A-Z]/g,
            (match) => ` ${match.toLowerCase()}`
        );

        // Capitalize the first letter of the first word
        const finalString =
            formattedString.charAt(0).toUpperCase() + formattedString.slice(1);

        // Trim leading space if any
        return finalString.trim();
    }
}

function calculateTotalWeight(arr) {
    // Ensure the input is an array
    if (!Array.isArray(arr)) {
        throw new Error("Input must be an array");
    }

    // Use reduce to sum the weightOut values
    const totalWeight = arr.reduce((sum, entry) => {
        // Convert the weightOut value to a number before adding
        const weight = parseFloat(entry.weightOut);

        // Check if the conversion is successful and add to the sum
        if (!isNaN(weight)) {
            return sum + weight;
        } else {
            return sum;
        }
    }, 0);

    return totalWeight;
}

export function isTotalWeightGreater(data, weightIn) {
    const totalWeight = calculateTotalWeight(data);

    // Convert weightIn to a number
    const numericWeightIn = parseFloat(weightIn);

    // Check if the conversion is successful and compare totalWeight with weightIn
    if (!isNaN(numericWeightIn) && totalWeight > numericWeightIn) {
        // message.error("Weight out can't be greater than weight in")
        return true;
    } else {
        return false;
    }
}

export function getBase64FromServer(fileUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = fileUrl;
        img.onload = () => {
            resolve(fileUrl);
        };
    });
}

// export function filterColumns(
//     restrictedColumns,
//     userPermissions,
//     columns,
//     model
// ) {
//     for (const key in restrictedColumns) {
//         if (restrictedColumns.hasOwnProperty(key)) {
//             if (Object.keys(userPermissions).includes(key)) {
//                 if (restrictedColumns[key].table) {
//                     if (userPermissions[key].view) {
//                         if (
//                             userPermissions[key].edit &&
//                             ![
//                                 "gradeImg",
//                                 "mineralPrice",
//                                 "pricingGrade",
//                                 "netPrice",
//                             ].includes(`${key}`)
//                         ) {
//                             restrictedColumns[key].editTable = !(`${key}` === "pricePerUnit" && ["coltan", "cassiterite", "wolframite"].includes(model));
//                         }
//                         // if (userPermissions[key].edit && ["lithium", "beryllium"].includes(model) && `${key}` === "pricePerUnit") {
//                         //     restrictedColumns[key].editTable = true;
//                         // }
//                         columns.push(restrictedColumns[key]);
//                     }
//                 }
//             }
//         }
//     }
// }


export function filterColumns(
    restrictedColumns,
    userPermissions,
    columns,
    model
) {
    for (const key in restrictedColumns) {
        if (restrictedColumns.hasOwnProperty(key)) {
            const column = restrictedColumns[key];

            // Skip columns where model is specified but doesn't match the current model
            if (column.model && column.model !== model) {
                continue;
            }

            if (Object.keys(userPermissions).includes(key)) {
                if (column.table) {
                    if (userPermissions[key].view) {
                        if (
                            userPermissions[key].edit &&
                            ![
                                "gradeImg",
                                "mineralPrice",
                                "pricingGrade",
                                "netPrice",
                            ].includes(`${key}`)
                        ) {
                            column.editTable = !(`${key}` === "pricePerUnit" && ["coltan", "cassiterite", "wolframite"].includes(model));
                        }
                        columns.push(column);
                    }
                }
            }
        }
    }
}


export function openNotification({message, description, type}) {
    notification.open({
        message,
        description,
        placement: "topRight",
        type,
    });
}

export const AppUrls = {
    server: "http://localhost:5001/api/v1",
};

export function decidePricingGrade(pricingGrade) {
    if (pricingGrade === "SMC") return "mineralGrade";
    if (pricingGrade === "ASIR") return "ASIR";
}

export function handleConvertToUSD(amount, USDRate) {
    return parseFloat(amount) / parseFloat(USDRate);
}

export function handleConvertToRWF(amount, USDRate) {
    return amount * USDRate;
}

export const getModelAcronym = (model) => {
    if (model.toLowerCase() === "cassiterite") return "SNO2";
    if (model.toLowerCase() === "coltan") return "TA2O5";
    if (model.toLowerCase() === "wolframite") return "WO3";
    if (model.toLowerCase() === "mixed") return "MIXED";
    if (model.toLowerCase() === "lithium") return "LITHIUM";
    if (model.toLowerCase() === "beryllium") return "BERYLLIUM";
};

export const validateWeightInEntry = (index, lotDetails, e, weightIn) => {
    if (e.target.name === "weightOut") {
        if (index <= lotDetails.length) {
            const totalWeight = lotDetails.reduce((acc, lot, lotIndex) => {
                if (lot.weightOut && lotIndex !== index) {
                    return acc + parseFloat(lot.weightOut);
                }
                return acc;
            }, 0);
            const newTotal = totalWeight + parseFloat(e.target.value);
            if (newTotal > parseFloat(weightIn)) {
                message.error("Total weight out cannot be greater than weight in");
            }
        }
    }
};

export const fields = [
    "Weight In",
    "beneficiary",
    "number of tags",
    "mine tags",
    "negociant tags",
    "company name",
    "license number",
    "time",
    "supply date",
    "representative Id",
    "TIN Number",
];

export function hasPermission(permissions, action) {
    const [module, operation] = action.split(":");
    if (permissions[module] && permissions[module][operation] !== undefined) {
        return permissions[module][operation];
    }
    return false;
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



// Consolidated calculation functions for different mineral types
export const calculatePricePerUnit = (model, params) => {
    switch (model) {
        case "cassiterite":
            const { LME, grade, TC } = params;
            if (LME && grade && TC) {
                return (((LME * grade/100) - TC)/1000).toFixed(5);
            }
            break;
        case "coltan":
            const { tantal, grade: coltanGrade } = params;
            if (tantal && coltanGrade) {
                return (tantal * coltanGrade).toFixed(5);
            }
            break;
        case "wolframite":
            const { MTU, grade: wolfGrade } = params;
            if (MTU && wolfGrade) {
                return ((MTU * wolfGrade/100) * 0.1).toFixed(5);
            }
            break;
        case "lithium":
        case "beryllium":
            // For lithium and beryllium, just return the price per unit directly
            const { pricePerUnit } = params;
            if (pricePerUnit) {
                return pricePerUnit.toFixed(5);
            }
            break;
        default:
            return null;
    }
    return null;
};

export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
};
