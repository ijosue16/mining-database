import React, {useEffect, useState} from "react";
import { useAddContractMutation } from "../states/apislice";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";

const AddContract = () => {
    // const { buyerId } = useParams();
    const [contractInfo, setContractInfo] = useState(
        {
            name: "",
            buyerName: "",
            minerals: [],
            contractStartDate: "",
            contractExpiryDate: "",
            grade: "",
            contract: ""
        }
    );
    const [addContract, {isLoading, isSuccess, isError, error}] = useAddContractMutation();

    useEffect(() => {
        if (isSuccess) {
            toast.success("Contract Added Successfully");
        } else if (isError) {
            const { message } = error.data;
            toast.error(message);
        }
    }, [isSuccess, isError, error]);

    const handleChange = (e) => {
        setContractInfo(prevState => ({...prevState, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        for (const key of contractInfo) {
            if (contractInfo.hasOwnProperty(key)) {
                formData.append(key, contractInfo[key]);
            }
        }
        console.log(contractInfo);
        // console.log(formData.entries());
        // await addContract({body: formData});
    }

    const handleCancel = () => {
        setContractInfo(
            {
                name: "",
                buyerName: "",
                minerals: [],
                contractStartDate: "",
                contractExpiryDate: "",
                grade: "",
                contract: ""
            }
        )
    }

    return (
        <div>
            <div>
                <p>Contract filename</p>
                <input type="text" name="name" value={contractInfo.name} onChange={handleChange}/>
            </div>
            <div>
                <p>Buyer Name</p>
                <input type="text" name="buyerName" value={contractInfo.buyerName} onChange={handleChange}/>
            </div>
            <div>
                <p>Minerals</p>
                <input type="text" name="minerals" value={contractInfo.minerals} onChange={handleChange}/>
            </div>
            <div>
                <p>Start Date</p>
                <input type="date" name="contractStartDate" value={contractInfo.contractStartDate} onChange={handleChange}/>
            </div>
            <div>
                <p>Expiry Date</p>
                <input type="date" name="contractExpiryDate" value={contractInfo.contractExpiryDate} onChange={handleChange}/>
            </div>
            <div>
                <p>Concentration</p>
                <input type="text" name="grade" value={contractInfo.grade} onChange={handleChange}/>
            </div>
            <input type="file" name="contract"/>
            <div>
                <button type="button" onClick={handleSubmit}>Submit</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    )
}


export default AddContract