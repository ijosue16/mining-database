import React, {useEffect, useState} from 'react';
import { useUpdateSettingsMutation, useGetSettingsQuery } from "../states/apislice";
import { toast } from "react-toastify";


const Settings = () => {
    const {data, isSuccess} = useGetSettingsQuery();
    const [updateSettings, {isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError}] = useUpdateSettingsMutation();

    useEffect(() => {
        if (isUpdateSuccess) {
            toast.success("Settings updated successfully");
        } else if (isUpdateError) {
            const { message } = updateError.data;
            toast.error(message);
        }
    }, [isUpdateError, isUpdateSuccess, updateError]);

    const [settings, setSettings] = useState(
        {rmaFeeColtan: 0, rmaFeeCassiterite: 0, rmaFeeWolframite: 0, nameOfCompany: ""}
    );

    useEffect(() => {
        if (isSuccess) {
            const { settings: existingSettings } = data.data;
            setSettings(prevState => (
                {
                    ...prevState,
                    rmaFeeWolframite: existingSettings.rmaFeeWolframite,
                    rmaFeeCassiterite: existingSettings.rmaFeeCassiterite,
                    rmaFeeColtan: existingSettings.rmaFeeColtan,
                    nameOfCompany: existingSettings.nameOfCompany
                })
            );
        }
    }, [isSuccess]);

    const handleChangeSettings = (e) => {
        setSettings(prevState => ({...prevState, [e.target.name]: e.target.value}));
    }

    const handleCancel = () => {
        setSettings({nameOfCompany: "", rmaFeeWolframite: 0, rmaFeeColtan: 0, rmaFeeCassiterite: 0});
    }

    const handleSubmit = async () => {
        await updateSettings({body: settings});
    }

    return (
        <div>
            <form>
                <div>
                    <label>Coltan RMA Fee</label>
                    <input type="number" name="rmaFeeColtan" value={settings.rmaFeeColtan} onChange={handleChangeSettings}/>
                </div>
                <div>
                    <label>Cassiterite RMA Fee</label>
                    <input type="number" name="rmaFeeCassiterite" value={settings.rmaFeeCassiterite} onChange={handleChangeSettings}/>
                </div>
                <div>
                    <label>Wolframite RMA Fee</label>
                    <input type="number" name="rmaFeeWolframite" value={settings.rmaFeeWolframite} onChange={handleChangeSettings}/>
                </div>
                <div>
                    <label>Name of Processor</label>
                    <input type="text" name="nameOfCompany" value={settings.nameOfCompany} onChange={handleChangeSettings}/>
                </div>
                <div>
                    <button type="button" onClick={handleSubmit}>Submit</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default Settings;