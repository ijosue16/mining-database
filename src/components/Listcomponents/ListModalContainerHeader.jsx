import { PiPlus,PiCaretLeftLight } from "react-icons/pi"
import { useNavigate } from "react-router-dom";

const ListModalContainerHeader = ({ title, subTitle, navtext,open,table }) => {
    const navigate = useNavigate();
    return (
        <>
         <PiCaretLeftLight className="mb-1" onClick={()=>navigate(-1)}/>
            <div className="sm:flex sm:justify-between sm:items-center mb-9">
                <div className="text-start">

                    <h4 className=" text-[18px] font-bold">{title}</h4>
                    <h6 className="text-[14px] ">{subTitle}</h6>

                </div>
                <div className="py-[10px] px-6 rounded bg-amber-500 flex items-center gap-3" onClick={open} >
                    <PiPlus className="text-white text-2xl" />
                    <button type="button" className=" bg-transparent text-white text-center" >{navtext}</button>
                </div>

            </div>
            <div className="bg-white w-full p-4 m-0 border rounded-lg h-fit">
            {table}
                </div>
        </>
    )

}
export default ListModalContainerHeader;