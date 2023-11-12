import React, {useState, useEffect} from "react";
import dayjs from "dayjs";
import { DatePicker, message } from "antd";
import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../components/Actions components/AddComponent";
import {useAddAdvancePaymentMutation} from "../../states/apislice";

const AdvancedPaymentEntry = () => {
    const [paymentInfo, setPayementInfo] = useState({
        supplierId: '64bfeddfbb0da81a7853a114',
        companyName: '',
        beneficiary: '',
        nationalId: '',
        phoneNumber: '',
        location: {province: "", district: "", sector: "", cell: ''},
        email: '',
        paymentAmount: null,
        currency: '',
        paymentDate: '',
        contractName: ''
    });
    const [AddAdvancedPayment, {isLoading, isSuccess, isError, error}] = useAddAdvancePaymentMutation();

    const handleEntry = (e) => {
        setPayementInfo((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    const handleAddPaymentDate = (e) => {
        setPayementInfo((prevState) => ({
            ...prevState,
            paymentDate: e,
        }));
    };

    useEffect(() => {
        if (isSuccess) {
            message.success("Advanced payment added successfully");
        } else if (isError) {
            const {message: errorMessage} = error.data;
            message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);

    const handleChangeLocation = (e) => {
        const {name, value} = e.target;
        if (name.includes("location.")) {
            const addressField = name.split(".")[1];
            setPayementInfo((prevState) => ({
                ...prevState,
                location: {
                    ...prevState.location,
                    [addressField]: value
                }
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = paymentInfo;
        await AddAdvancedPayment({body});
        handleCancel();
    };

    const handleCancel = () => {
        setPayementInfo({
            supplierId: '',
            companyName: '',
            beneficiary: '',
            nationalId: '',
            phoneNumber: '',
            location: {province: '', district: '', sector: '', cell: ''},
            email: '',
            paymentAmount: null,
            currency: '',
            paymentDate: '',
            contractName: ''
        });
    };

    return (
        <ActionsPagesContainer
            title={"Advanced payment"}
            subTitle={"Add new advanced payment"}
            actionsContainer={
                <AddComponent
                    component={
                        <div className="grid grid-cols-1 gap-y-10 pb-10">
                            <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                <li className=" space-y-1">
                                    <p className="pl-1">Company name</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="companyName"
                                        id="companyName"
                                        value={paymentInfo.companyName || ""}
                                        onChange={handleEntry}

                                    />
                                </li>

                                <li className=" space-y-1">
                                    <p className="pl-1">Beneficiary</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="beneficiary"
                                        id="beneficiary"
                                        value={paymentInfo.beneficiary || ""}
                                        onChange={handleEntry}

                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">National Id</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="nationalId"
                                        id="nationalId"

                                        value={paymentInfo.nationalId || ""}
                                        onChange={handleEntry}

                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Phone number</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="phoneNumber"
                                        id="phoneNumber"

                                        value={paymentInfo.phoneNumber || ""}
                                        onChange={handleEntry}

                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Province</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="location.province"
                                        id="province"

                                        value={paymentInfo.location.province || ""}
                                        onChange={handleChangeLocation}

                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">District</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="location.district"
                                        id="district"

                                        value={paymentInfo.location.district || ""}
                                        onChange={handleChangeLocation}

                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Sector</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="location.sector"
                                        id="sector"

                                        value={paymentInfo.location.sector || ""}
                                        onChange={handleChangeLocation}

                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Cell</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="location.cell"
                                        id="cell"

                                        value={paymentInfo.location.cell || ""}
                                        onChange={handleChangeLocation}

                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Email</p>
                                    <input
                                        type="email"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="email"
                                        id="email"
                                        value={paymentInfo.email || ""}
                                        onChange={handleEntry}

                                    />
                                </li>

                                <li className=" space-y-1">
                                    <p className="pl-1">Payment amount</p>
                                    <input
                                        type="number"
                                        autoComplete="off"
                                        name="paymentAmount"
                                        id="paymentAmount"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        value={paymentInfo.paymentAmount || ''}
                                        onChange={handleEntry}
                                        onWheelCapture={(e) => {
                                            e.target.blur();
                                        }}

                                    />
                                </li>

                                <li className=" space-y-1">
                                    <p className="pl-1">Currency</p>
                                    <select
                                        name="currency"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        defaultValue={paymentInfo.currency || '' || "defaultcurrency"}
                                        onChange={handleEntry}
                                    >
                                        <option value="defaultcurrency" hidden>
                                            {paymentInfo.currency ? `${paymentInfo.currency}` : "select currency"}
                                        </option>
                                        <option value="USD">USD</option>
                                        <option value="RWF">RWF</option>
                                    </select>
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Payment date</p>
                                    <DatePicker
                                        onChange={handleAddPaymentDate}
                                        id="paymentDate"
                                        name="paymentDate"
                                        className=" focus:outline-none p-2 border rounded-md w-full"
                                        value={
                                            paymentInfo.paymentDate ? dayjs(paymentInfo.paymentDate) : null
                                        }

                                    />
                                </li>

                                <li className=" space-y-1">
                                    <p className="pl-1">Contract name</p>
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        name="contractName"
                                        id="contractName"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        value={paymentInfo.contractName || ""}
                                        onChange={handleEntry}

                                    />
                                </li>
                            </ul>
                        </div>
                    }
                    Add={handleSubmit}
                    Cancel={handleCancel}
                    isloading={isLoading}
                />
            }/>
    )

}
export default AdvancedPaymentEntry;