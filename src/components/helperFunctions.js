import {PiDotsThreeVerticalBold} from "react-icons/pi";
import {motion} from "framer-motion";
import {BiSolidEditAlt} from "react-icons/bi";
import {MdOutlineClose, MdPayments} from "react-icons/md";
import {FaSave} from "react-icons/fa";
import React from "react";
import {notification} from "antd";

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

export function filterColumns (restrictedColumns, userPermissions, columns) {
    for (const key in restrictedColumns) {
        if (restrictedColumns.hasOwnProperty(key)) {
            if (Object.keys(userPermissions).includes(key)) {
                if (userPermissions[key].view) {
                    if (userPermissions[key].edit && `${key}` !== "gradeImg") {
                        restrictedColumns[key].editTable = true;
                    }
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
    server: "https://mining-company-management-system.onrender.com/api/v1",
}