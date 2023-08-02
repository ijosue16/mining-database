import React from "react";
import { BiSolidFilePdf } from "react-icons/bi"
import { BsCardList } from "react-icons/bs"
import { HiOutlinePrinter } from "react-icons/hi"
import { RiEditLine } from "react-icons/ri"
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";

const DummyPage = () => {
    return (
        <>
            <ActionsPagesContainer title={'Edit Payment'}
                subTitle={'Edit/Update Payment'}
                actionsContainer={
                    <div className="w-full space-y-4">
                        <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-4 gap-3 border-b-[1px]">
                            <span className="flex w-fit justify-end items-center gap-6 pr-1 pb-3">
                                <RiEditLine className=" text-2xl justify-self-end" />
                                <BiSolidFilePdf className=" text-2xl justify-self-end" />
                                <BsCardList className=" text-2xl justify-self-end" />
                                <HiOutlinePrinter className=" text-2xl justify-self-end" />
                            </span>
                        </div>
                        <ul className=" list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            <li className=" space-y-1">
                                <p className=" text-md text-indigo-500 pb-[1px]">supplier info</p>
                                <p>name:COPEMINYA</p>
                                <p>representative:Bernard</p>
                                <p>heloo</p>
                                <p>heloo</p>

                            </li>
                        </ul>
                        <table className="table-fixed w-full">
                            <thead className=" bg-slate-100 text-left">
                                <tr className=" border-b-[1px]">
                                    <th className="py-2 pl-1 text-base font-semibold">Song</th>
                                    <th className="py-2 pl-1 text-base font-semibold">Artist</th>
                                    <th className="py-2 pl-1 text-base font-semibold">Year</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                <tr className=" border-b-[1px]">
                                    <td className="py-2 pl-1">The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                                    <td>Malcolm Lockyer</td>
                                    <td>1961</td>
                                </tr>
                                <tr className=" border-b-[1px]">
                                    <td className="py-2 pl-1">Witchy Woman</td>
                                    <td>The Eagles</td>
                                    <td>1972</td>
                                </tr>
                                <tr className=" border-b-[1px]">
                                    <td className="py-2 pl-1">Shining Star</td>
                                    <td>Earth, Wind, and Fire</td>
                                    <td>1975</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                } />
        </>
    )
}
export default DummyPage;