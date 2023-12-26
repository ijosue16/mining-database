import React, {useState} from "react";
import {Button, message, notification, Popover, Radio} from "antd";

const specialStrings = ["TINNumber", "rmaFee", "USDRate", "rmaFeeUSD", "rmaFeeRWF"];

export function toCamelCase(str) {
    if (str === "TIN Number") return "TINNumber";
    if (str === "RMA Fee") return "rmaFee";
    if (str === "USD Rate") return "USDRate";
    if (str === "RMA Fee USD") return "rmaFeeUSD";
    if (str === "RMA Fee RWF") return "rmaFeeRWF";
    return str.split(' ').map((word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    }).join('');
}



export function toInitialCase(camelCaseString) {
    if (camelCaseString === "TINNumber") return "TIN Number";
    if (camelCaseString === "rmaFee") return "RMA Fee";
    if (camelCaseString === "USDRate") return "USD Rate";
    if (camelCaseString === "rmaFeeUSD") return "RMA Fee USD";
    if (camelCaseString === "rmaFeeRWF") return "RMA Fee RWF";
    // if (specialStrings.includes(camelCaseString)) return camelCaseString;
    return camelCaseString
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, function(str) {
            return str.toUpperCase();
        });
}

export function getBase64FromServer (fileUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = fileUrl;
        img.onload = () => {
            resolve(fileUrl);
        };
    });
}

export function filterColumns (restrictedColumns, userPermissions, columns, model) {
    for (const key in restrictedColumns) {
        if (restrictedColumns.hasOwnProperty(key)) {
            if (Object.keys(userPermissions).includes(key)) {
                if (restrictedColumns[key].table) {
                    if (userPermissions[key].view) {
                        if (userPermissions[key].edit && !["gradeImg", "mineralPrice", "pricingGrade", "netPrice"].includes(`${key}`)) {
                            restrictedColumns[key].editTable = !(`${key}` === "pricePerUnit" && ["coltan", "cassiterite", "wolframite"].includes(model));
                        }
                        // if (userPermissions[key].edit && ["lithium", "beryllium"].includes(model) && `${key}` === "pricePerUnit") {
                        //     restrictedColumns[key].editTable = true;
                        // }
                        columns.push(restrictedColumns[key]);
                    }
                }
            }
        }
    }
}

export function openNotification  ({message, description, type}) {
    notification.open({
        message,
        description,
        placement: "topRight",
        type
    });
}

export const AppUrls = {
    server: "http://localhost:5001/api/v1",
}

export function decidePricingGrade (pricingGrade) {
    if (pricingGrade === "KZM") return "mineralGrade";
    if (pricingGrade === "ASIR") return "ASIR";
}

export function handleConvertToUSD (amount, USDRate) {
    return parseFloat(amount) / parseFloat(USDRate);
}

export function handleConvertToRWF (amount, USDRate) {
    return amount * USDRate;
}

export const getModelAcronym = (model) => {
    if (model.toLowerCase() === "cassiterite") return "SNO2";
    if (model.toLowerCase() === "coltan") return "TA2O5";
    if (model.toLowerCase() === "wolframite") return "WO3";
    if (model.toLowerCase() === "mixed") return "MIXED";
    if (model.toLowerCase() === "lithium") return "LITHIUM";
    if (model.toLowerCase() === "beryllium") return "BERYLLIUM";
}

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
}

export const fields = ["Weight In", "beneficiary", "number of tags", "mine tags", "negociant tags", "company name", "license number", "time", "supply date", "representative Id", "TIN Number"];
