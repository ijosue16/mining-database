import React from "react";
import { DatePicker } from "antd";
import { HiPlus, HiMinus } from "react-icons/hi";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";

const ReportPage = () => {
  return (
    <ActionsPagesContainer
      title={`Report page`}
      subTitle={`Make report `}
      actionsContainer={
        <div className="w-full col-span-full space-y-6 p-2 relative mb-6">
          <div className="p-2 w-fit rounded-full bg-gray-400 shadow-2xl flex justify-center items-center absolute right-0 -bottom-4"><HiPlus className=" text-xl text-white"/></div>
          <p className="text-lg font-bold pl-1">Summary of report</p>
          <ul className=" list-none w-full bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-[4px] shadow-xl shadow-zinc-400 px-3 py-4 ">
            <li className=" space-y-1">
              <p className="pl-1">Name of processor</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name="name_of_processor"
                id=""
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">Name of consultant</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name="name_of_consultant"
                id=""
              />
            </li>
            <li className=" space-y-1">
              <p className="pl-1">Email of consultant</p>
              <input
                type="email"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name="email_of_consultant"
                id=""
              />
            </li>
            <li className=" space-y-1">
              <p className="pl-1">Date of report</p>
              <DatePicker
                id=""
                name="date_of_report"
                className="focus:outline-none p-2 border  rounded-[4px] w-full"
              />
            </li>
            <li className=" space-y-1">
              <p className="pl-1">Is trained (todo)</p>
              <DatePicker
                id=""
                name=""
                className="focus:outline-none p-2 border  rounded-[4px] w-full"
              />
            </li>
            <li className="space-y-1 col-span-full">
              <p className="pl-1">Purpose of visit</p>
              <textarea
                name="purpose_of_visit"
                id=""
                cols="30"
                rows="10"
                className="focus:outline-none p-2 border  rounded-[4px] w-full"
              ></textarea>
            </li>
          </ul>

          <p className="text-lg font-bold pl-1">Mine company info</p>
          <ul className=" list-none w-full bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-[4px] shadow-xl shadow-zinc-400 px-3 py-4 ">
            <li className=" space-y-1">
              <p className="pl-1">Company visited</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name="company_visited"
                id=""
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">company license number</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name="company_license_number"
                id=""
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">Number of minesites</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name="number_of_minesites"
                id=""
              />
            </li>
            <li className=" space-y-1">
              <p className="pl-1">Number of minesites visited</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name="number_of_minesites_visited"
                id=""
              />
            </li>
            <li className=" space-y-1 col-span-full">
              <p className="pl-1">Last visit date and sites</p>
              <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DatePicker
                  id=""
                  name="date_of_last_visit"
                  className="focus:outline-none p-2 border  rounded-[4px] w-full"
                />
                <input
                  type="text"
                  autoComplete="off"
                  className="focus:outline-none p-2 border rounded-[4px] w-full"
                  name="sites_visited"
                  id=""
                />
              </div>
            </li>
            <li className=" space-y-1 col-span-full">
              <p className="pl-1">List of interviewed person and role</p>
              <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className=" justify-self-end col-span-full flex items-center gap-2">
                  <p> person 1</p>
                  <HiPlus />
                </div>

                <span className=" space-y-1">
                  <p className="pl-1">name</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name=""
                    id=""
                  />
                </span>
                <span className=" space-y-1">
                  <p className="pl-1">role</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name=""
                    id=""
                  />
                </span>
              </div>
            </li>
          </ul>

          <p className="text-lg font-bold pl-1">Information per sites</p>
          <ul className=" list-none w-full bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-[4px] shadow-xl shadow-zinc-400 px-3 py-4 ">
            <p className="col-span-full text-lg font-semibold">Site 1</p>
            <li className=" space-y-1">
              <p className="pl-1">Name of the site</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name=""
                id=""
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">Code of the site</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name=""
                id=""
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">GPS coordinates</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name=""
                id=""
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">District</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name=""
                id=""
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">Sector</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name=""
                id=""
              />
            </li>
            <li className=" space-y-1">
              <p className="pl-1">Cell</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name=""
                id=""
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">Date of visit</p>
              <DatePicker
                id=""
                name=""
                className="focus:outline-none p-2 border  rounded-[4px] w-full"
              />
            </li>

            <li className=" space-y-1 col-span-full">
              <p className="pl-1 font font-semibold text-md">
                Name and position of representative
              </p>
              <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className=" justify-self-end col-span-full flex items-center gap-2">
                  <p> person 1</p>
                  <HiPlus />
                </div>

                <span className=" space-y-1">
                  <p className="pl-1">name</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name=""
                    id=""
                  />
                </span>
                <span className=" space-y-1">
                  <p className="pl-1">position</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name=""
                    id=""
                  />
                </span>
              </div>
            </li>

            <li className=" space-y-1 col-span-full shadow-2xl rounded-[4px] p-2 pb-6 mt-8">
              <p className="pl-1 font font-bold text-lg ">
                Level of activities at the mine site
              </p>
              <ul className="grid grid-cols-1 gap-12 ">
                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Number of digers
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on owns observation at the site
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Men</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Women</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Men</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Women</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                </ul>

                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Number of washers
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on owns observation at the site
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Men</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Women</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Men</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Women</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                </ul>

                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Number of transporters
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on owns observation at the site
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Men</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Women</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Men</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Women</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                </ul>

                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Number of teams
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on owns observation at the site
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Number of person per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Number of washers per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Number of transporters per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Number of diggers per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Number of person per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Number of washers per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Number of transporters per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Number of diggers per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                </ul>

                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Temporary workers
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1  gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on owns observation at the site
                    </p>
                    <span className="space-y-1 flex items-center justify-start gap-2">
                      <p className="pl-1">Do they use temporary workers?</p>
                      <input
                        type="checkbox"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px]  border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">number of temporary workers</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">number of times</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1  gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1 flex items-center justify-start gap-2">
                      <p className="pl-1">Do they use temporary workers?</p>
                      <input
                        type="checkbox"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px]  border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">number of temporary workers</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">number of times</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                </ul>
                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Equipment used
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on owns observation at the site
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">List</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on owns observation at the site
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">List</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                </ul>
              </ul>
            </li>

            <li className=" space-y-1 col-span-full shadow-2xl rounded-[4px] p-2 pb-6 mt-8">
              <p className="pl-1 font font-bold text-lg ">
                Information on level of production at site
              </p>
              <ul className="grid grid-cols-1 gap-12 ">
                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Production per day
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info collected from miners
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Production per day</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Production per day</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info from company's or cooperative's own records
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Production per day</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                </ul>

                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4 ">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Mineral wash frequency
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 items-center gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info collected from miners
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">times washed</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Days of mineral washing</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">times washed</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Days of mineral washing</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info from company's or cooperative's own records
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">times washed</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Days of mineral washing</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>
                  </li>
                </ul>
                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4 ">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Type of mined minerals
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info collected from miners
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Type of minerals</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>

                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Type of minerals</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>

                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info from company's or cooperative's own records
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Type of minerals</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name=""
                        id=""
                      />
                    </span>

                  </li>
                </ul>


              </ul>
            </li>
          </ul>

          <p className="text-lg font-bold pl-1">Mine company records tracking</p>
          <ul className=" list-none w-full bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-[4px] shadow-xl shadow-zinc-400 px-3 py-4 ">
            <li className=" space-y-1">
              <p className="pl-1">Company visited</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name=""
                id=""
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">company license number</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name=""
                id=""
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">Number of minesites</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name=""
                id=""
              />
            </li>
            <li className=" space-y-1">
              <p className="pl-1">Number of minesites visited</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name=""
                id=""
              />
            </li>
            <li className=" space-y-1 col-span-full">
              <p className="pl-1">Last visit date and sites</p>
              <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DatePicker
                  id=""
                  name=""
                  className="focus:outline-none p-2 border  rounded-[4px] w-full"
                />
                <input
                  type="text"
                  autoComplete="off"
                  className="focus:outline-none p-2 border rounded-[4px] w-full"
                  name=""
                  id=""
                />
              </div>
            </li>
            <li className=" space-y-1 col-span-full">
              <p className="pl-1">List of interviewed person and role</p>
              <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className=" justify-self-end col-span-full flex items-center gap-2">
                  <p> person 1</p>
                  <HiPlus />
                </div>

                <span className=" space-y-1">
                  <p className="pl-1">name</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name=""
                    id=""
                  />
                </span>
                <span className=" space-y-1">
                  <p className="pl-1">role</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name=""
                    id=""
                  />
                </span>
              </div>
            </li>
          </ul>
        </div>
      }
    />
  );
};

export default ReportPage;
