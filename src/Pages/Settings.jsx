import React, {useEffect, useState} from 'react';
import {useGetSettingsQuery, useUpdateSettingsMutation} from "../states/apislice";
import ActionsPagesContainer from '../components/Actions components/ActionsComponentcontainer';
import AddComponent from '../components/Actions components/AddComponent';
import {toast} from "react-toastify";


const Settings = () => {
    const {data, isSuccess} = useGetSettingsQuery();
    const [updateSettings, {
        isLoading: isUpdating,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateSettingsMutation();

    const [settings, setSettings] = useState(
        {rmaFeeColtan: 0, rmaFeeCassiterite: 0, rmaFeeWolframite: 0, nameOfCompany: ""}
    );

    useEffect(() => {
        if (isUpdateSuccess) {
            toast.success("Settings updated successfully");
        } else if (isUpdateError) {
            const {message} = updateError.data;
            toast.error(message);
        }
    }, [isUpdateError, isUpdateSuccess, updateError]);

    useEffect(() => {
        console.log('----------------------------------------------------')

        if (isSuccess) {
            const {settings: existingSettings} = data.data;
            console.log(existingSettings);
            console.log('----------------------------------------------------')
            setSettings(prevState => (
                {
                    ...prevState,
                    rmaFeeWolframite: existingSettings.rmaFeeWolframite,
                    rmaFeeCassiterite: existingSettings.rmaFeeCassiterite,
                    rmaFeeColtan: existingSettings.rmaFeeColtan,
                    nameOfCompany: existingSettings.nameOfCompany,
                    address: {
                        province: existingSettings.address.province,
                        district: existingSettings.address.district,
                        sector: existingSettings.address.sector,
                    },
                    representative: existingSettings.representative
                })
            );
        }
    }, [isSuccess, data]);

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name.includes("address.")) {
            const addressField = name.split(".")[1];
            setSettings((prevState) => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    [addressField]: value
                }
            }));
        } else {
            setSettings((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleChangeSettings = (e) => {
        setSettings(prevState => ({...prevState, [e.target.name]: e.target.value}));
    }

    const handleCancel = () => {
        setSettings({
            nameOfCompany: "", rmaFeeWolframite: 0, rmaFeeColtan: 0, rmaFeeCassiterite: 0, representative: "",
            supplier: {province: "", district: "", sector: ""}
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(settings);
        const body = settings
        await updateSettings({body});
    }

    return (
        <>

            <ActionsPagesContainer title={'General Settings'}
                                   subTitle={'Modify to prefered settings'}
                                   actionsContainer={<AddComponent component={
                                       <div className="grid grid-cols-1 gap-y-10 pb-10">
                                           <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center">
                                               <li>
                                                   <p className="mb-1">Coltan RMA Fee</p>
                                                   <input type="number" name="rmaFeeColtan"
                                                          value={settings.rmaFeeColtan ||""}
                                                          className="focus:outline-none p-2 border rounded-lg w-full"
                                                          onChange={handleChange}/>
                                               </li>
                                               {/* ******* */}
                                               <li>
                                                   <p className="mb-1">Cassiterite RMA Fee</p>

                            <input type="number" name="rmaFeeCassiterite" value={settings.rmaFeeCassiterite ||""}  className="focus:outline-none p-2 border rounded-lg w-full" onWheelCapture={(e) => {e.target.blur()}} onChange={handleChangeSettings} />
                        </li>
                        {/* ******* */}
                        <li>
                            <p className="mb-1">Wolframite RMA Fee</p>
                                                   <input type="number" name="rmaFeeCassiterite"
                                                          value={settings.rmaFeeCassiterite}
                                                          className="focus:outline-none p-2 border rounded-lg w-full"
                                                          onWheelCapture={(e) => {
                                                              e.target.blur()
                                                          }} onChange={handleChange}/>
                                               </li>
                                               {/* ******* */}
                                               <li>
                                                   <p className="mb-1">Wolframite RMA Fee</p>

                                                   <input type="number" name="rmaFeeWolframite"
                                                          value={settings.rmaFeeWolframite ||""}
                                                          className="focus:outline-none p-2 border rounded-lg w-full"
                                                          onWheelCapture={(e) => {
                                                              e.target.blur()
                                                          }} onChange={handleChange}/>
                                               </li>
                                               {/* ******* */}
                                               <li>
                                                   <p className="mb-1">Name of Processor</p>
                                                   <input type="text" name="nameOfCompany" id="nameOfCompany"
                                                          autoComplete="off" value={settings.nameOfCompany ||""}
                                                          className="focus:outline-none p-2 border rounded-lg w-full"
                                                          onChange={handleChange}/>
                                               </li>
                                               <li>
                                                   <p className="mb-1">Name of Representatative</p>
                                                   <input type="text" name="representative" id="representative"
                                                          autoComplete="off" value={settings.representative ||""}
                                                          className="focus:outline-none p-2 border rounded-lg w-full"
                                                          onChange={handleChange}/>
                                               </li>
                                               <li>
                                                   <p className="mb-1">Province</p>
                                                   <input type="text" name="address.province" id="province"
                                                          autoComplete="off" value={settings.address.province}
                                                          className="focus:outline-none p-2 border rounded-lg w-full"
                                                          onChange={handleChange}
                                                   />
                                               </li>
                                               <li>
                                                   <p className="mb-1">District</p>
                                                   <input type="text" name="address.district" id="district"
                                                          autoComplete="off" value={settings.address.district}
                                                          className="focus:outline-none p-2 border rounded-lg w-full"
                                                          onChange={handleChange}/>
                                               </li>
                                               <li>
                                                   <p className="mb-1">Sector</p>
                                                   <input type="text" name="address.sector" id="sector"
                                                          autoComplete="off" value={settings.address.sector}
                                                          className="focus:outline-none p-2 border rounded-lg w-full"
                                                          onChange={handleChange}/>
                                               </li>
                                           </ul>
                                       </div>
                                   }
                                                                   Add={handleSubmit}
                                                                   Cancel={handleCancel}
                                                                   isloading={isUpdating}
                                   />}/>

        </>
    )
}

export default Settings;