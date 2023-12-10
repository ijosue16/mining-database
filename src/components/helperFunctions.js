import React from "react";
import {message, notification} from "antd";

const specialStrings = ["TINNumber", "rmaFee", "USDRate", "rmaFeeUSD"];

export function toCamelCase(str) {
    if (specialStrings.includes(str)) return str;
    return str.split(' ').map((word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    }).join('');
}



export function toInitialCase(camelCaseString) {
    if (specialStrings.includes(camelCaseString)) return camelCaseString;
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
                if (userPermissions[key].view) {
                    if (userPermissions[key].edit && !["gradeImg", "mineralPrice"].includes(`${key}`)) {
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

export function openNotification  ({message, description, type}) {
    notification.open({
        message,
        description,
        placement: "topRight",
        type
    });
}

export const AppUrls = {
    server: "http://localhost:5001/api/v1/",
}

export function handleConvertToUSD (amount, USDRate) {
    return amount / USDRate;
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

export const fields = ["Weight In", "beneficiary", "number of tags", "mine tags", "negociant tags", "company name", "license number", "time", "supply date", "representative Id", "TINNumber"];
