// import React, {useEffect, useState} from "react";
// import ListContainer from "../components/Listcomponents/ListContainer";
// import { useSelector } from "react-redux";
// import {ImSpinner2} from "react-icons/im";
// import {Table, Input} from "antd";
// import { useGetListTagsQuery } from "../states/apislice";
// import {SearchOutlined} from "@ant-design/icons";
// import dayjs from "dayjs";
//
//
// const ListTags = () => {
//     const { permissions: userPermissions } = useSelector(state => state.persistedReducer.global);
//     const { data, isLoading, isSuccess } = useGetListTagsQuery({query: ""});
//     const [tags, setTags] = useState([]);
//     const [modifiedTags, setModifiedTags] = useState([]);
//     const [storeTags, setStoreTags] = useState(0);
//
//
//     useEffect(() => {
//         if (isSuccess) {
//             const { tags } = data.data;
//             setTags(tags);
//         }
//     }, [isSuccess, data]);
//
//     useEffect(() => {
//         let numTags = 0;
//         const modifiedTags = tags.filter(tag => tag.tagType === "mine").map((tag, index) => {
//             if (tag.tagType === "mine") {
//                 if (tag.status === "in store") numTags++;
//                 if (tag.entryId) {
//                     return {
//                         ...tag,
//                         companyName: tag.entryId.companyName,
//                         tagNumber: tag.tagNumber,
//                         sheetNumber: tag.sheetNumber,
//                         tagType: tag.tagType,
//                         status: tag.status,
//                     }
//                 } else if (tag.supplierId) {
//                     return {
//                         ...tag,
//                         companyName: tag.supplierId.companyName,
//                         tagNumber: tag.tagNumber,
//                         sheetNumber: tag.sheetNumber,
//                         tagType: tag.tagType,
//                         status: tag.status,
//                     }
//                 }
//             }
//         })
//         setStoreTags(numTags);
//         setModifiedTags(modifiedTags);
//     }, [tags, data]);
//
//     const [searchText, setSearchText] = useState(""); // State for storing the filter value
//
//     // Function to handle filtering based on company name
//     const handleSearch = (selectedKeys, confirm, dataIndex) => {
//         confirm(); // Close the filter dropdown
//         setSearchText(selectedKeys[0]);
//     };
//
//     const handleReset = (confirm, clearFilters) => {
//         clearFilters();
//         setSearchText("");
//         confirm();
//     };
//
//     const columns = [
//         {
//             title: "Company Name",
//             dataIndex: "companyName",
//             key: "companyName",
//             filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//                 <div style={{ padding: 8 }}>
//                     <Input
//                         placeholder="Search Company Name"
//                         value={selectedKeys[0]}
//                         autoFocus
//                         onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//                         onPressEnter={() => handleSearch(selectedKeys, confirm, "companyName")}
//                         style={{ width: 188, marginBottom: 8, display: "block" }}
//                     />
//                     <div className="flex gap-2">
//                         <button className="px-6 py-1 bg-orange-300 rounded-md" onClick={() => handleSearch(selectedKeys, confirm, "companyName")}>Search</button>
//                         <button className="px-6 py-1 bg-red-300 rounded-md" onClick={() => handleReset(confirm, clearFilters)}>Reset</button>
//                     </div>
//                 </div>
//             ),
//             filterIcon: (filtered) => <SearchOutlined size={30} style={{ color: filtered ? "#1890ff" : undefined }} />,
//             onFilter: (value, record) => record.companyName.toLowerCase().includes(value.toLowerCase()),
//             // onFilterDropdownVisibleChange: (visible) => {
//             //     if (visible) {
//             //         // Auto focus on the input field when the filter dropdown is opened
//             //         setTimeout(() => document.getElementById("searchInput").select(), 100);
//             //     }
//             // },
//         },
//         {
//             title: "Tag Number",
//             dataIndex: "tagNumber",
//             key: "tagNumber",
//         },
//         {
//             title: "Weight",
//             dataIndex: "weight",
//             key: "weight",
//         },
//         {
//             title: "Sheet Number",
//             dataIndex: "sheetNumber",
//             key: "sheetNumber",
//         },
//         {
//             title: "Tag Type",
//             dataIndex: "tagType",
//             key: "tagType",
//         },
//         {
//             title: "Status",
//             dataIndex: "status",
//             key: "status",
//         },
//         {
//             title: "registration Date",
//             dataIndex: "registrationDate",
//             key: "registrationDate",
//             render: (text)  => {
//                 if (text) {
//                     return <span>{dayjs(text).format("MMM DD, YYYY")}</span>
//                 } else {
//                     return null;
//                 }
//             }
//         },
//         {
//             title: "Export Date",
//             dataIndex: "exportDate",
//             key: "exportDate",
//             render: (text)  => {
//                 if (text) {
//                     return <span>{dayjs(text).format("MMM DD, YYYY")}</span>
//                 } else {
//                     return null;
//                 }
//             }
//         }
//     ]
//
//     return (
//         <>
//             <ListContainer
//                 title={"List of Tags"}
//                 isAllowed={userPermissions.tags?.create}
//                 navLinktext={"add/tag"}
//                 navtext={"Add New Tag"}
//                 table={
//                     <>
//                         <Table
//                             className=" w-full overflow-x-auto"
//                             loading={{
//                                 indicator: (
//                                     <ImSpinner2
//                                         style={{width: "60px", height: "60px"}}
//                                         className="animate-spin text-gray-500"
//                                     />
//                                 ),
//                                 spinning: isLoading,
//                             }}
//                             dataSource={modifiedTags}
//                             columns={columns}
//                             rowKey="_id"
//                             onChange={(pagination, filters, sorter) => {
//                                 const { companyName } = filters;
//                                 if (companyName?.length > 0) {
//                                     const numTags = modifiedTags.reduce((acc, currTag) => {
//                                         if (currTag.companyName.toLowerCase().includes(companyName[0]?.toLowerCase()) && currTag.status === "in store") {
//                                             return acc + 1;
//                                         }
//                                         return acc;
//                                     }, 0);
//                                     setStoreTags(numTags);
//                                 } else {
//                                     const numTags = modifiedTags.reduce((acc, currTag) => {
//                                         if (currTag.status === "in store") {
//                                             return acc + 1;
//                                         }
//                                         return acc;
//                                     }, 0);
//                                     setStoreTags(numTags);
//                                 }
//                             }}
//                             footer={() => {
//                                 return (
//                                     <div className="flex justify-start gap-3">
//                                         <p className="text-lg font-semibold">Total Tags: {modifiedTags.length}</p>
//                                         <p className="text-lg font-semibold">Tags in store: {storeTags}</p>
//                                     </div>
//                                 )
//                             }}
//                         />
//                     </>
//                 }
//             />
//         </>
//     )
// }
//
// export default ListTags;



// ListTags.jsx
import React, { useEffect, useState } from "react";
import ListContainer from "../components/Listcomponents/ListContainer";
import { useSelector } from "react-redux";
import { ImSpinner2 } from "react-icons/im";
import { Table, Input } from "antd";
import { useGetListTagsQuery } from "../states/apislice";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
// Import shadcn UI components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, Download } from "lucide-react";

const ListTags = () => {
    const { permissions: userPermissions } = useSelector(state => state.persistedReducer.global);

    // State for filtering and pagination
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
        filters: {},
        sorter: { field: 'createdAt', order: 'descend' },
    });

    // Build query string from table params
    const buildQueryString = () => {
        const { pagination, filters, sorter } = tableParams;
        let query = `page=${pagination.current}&limit=${pagination.pageSize}`;

        // Add sorting
        if (sorter.field && sorter.order) {
            const sortOrder = sorter.order === 'ascend' ? '' : '-';
            query += `&sort=${sortOrder}${sorter.field}`;
        }

        // Add filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value.length > 0) {
                if (key === 'companyName') {
                    // Special handling for company name search
                    query += `&$or[0][entryId.companyName][$regex]=${value[0]}&$or[0][entryId.companyName][$options]=i`;
                    query += `&$or[1][supplierId.companyName][$regex]=${value[0]}&$or[1][supplierId.companyName][$options]=i`;
                } else {
                    // Handle other filters
                    query += `&${key}=${value}`;
                }
            }
        });

        return query;
    };

    // Use RTK Query with dynamic query parameters
    const { data, isLoading, isSuccess, refetch } = useGetListTagsQuery({
        query: buildQueryString()
    }, {
        refetchOnMountOrArgChange: true
    });

    const [tags, setTags] = useState([]);
    const [modifiedTags, setModifiedTags] = useState([]);
    const [storeTags, setStoreTags] = useState(0);
    const [totalTags, setTotalTags] = useState(0);
    const [tagTypeFilter, setTagTypeFilter] = useState(null);

    useEffect(() => {
        if (isSuccess && data) {
            const { tags } = data.data;
            setTags(tags);

            // Update pagination based on API response
            if (data.pagination) {
                setTableParams(prev => ({
                    ...prev,
                    pagination: {
                        ...prev.pagination,
                        total: data.pagination.total,
                        current: data.pagination.currentPage,
                    }
                }));

                setTotalTags(data.pagination.total);
            }
        }
    }, [isSuccess, data]);

    useEffect(() => {
        let numTags = 0;
        const modifiedTags = tags.filter(tag => tagTypeFilter ? tag.tagType === tagTypeFilter : true)
            .map((tag) => {
                if (tag.status === "in store") numTags++;

                return {
                    ...tag,
                    companyName: tag.entryId?.companyName || tag.supplierId?.companyName || "N/A",
                    key: tag._id
                };
            });

        setStoreTags(numTags);
        setModifiedTags(modifiedTags);
    }, [tags, tagTypeFilter]);

    // Handle table changes (pagination, filtering, sorting)
    const handleTableChange = (pagination, filters, sorter) => {
        // Update table parameters
        setTableParams({
            pagination: {
                ...tableParams.pagination,
                current: pagination.current,
                pageSize: pagination.pageSize,
            },
            filters,
            sorter: sorter.field ? { field: sorter.field, order: sorter.order } : {},
        });

        // This will trigger a new API call via useEffect
        setTimeout(() => refetch(), 0);
    };

    // Export to CSV function
    const handleExportCSV = () => {
        // Get all tags data (you might want to modify this to export filtered data)
        const csvContent = [
            // CSV Header
            ["Company Name", "Tag Number", "Weight", "Sheet Number", "Tag Type", "Status", "Registration Date", "Export Date"],
            // CSV Data rows
            ...modifiedTags.map(tag => [
                tag.companyName,
                tag.tagNumber,
                tag.weight || "",
                tag.sheetNumber || "",
                tag.tagType,
                tag.status,
                tag.registrationDate ? dayjs(tag.registrationDate).format("YYYY-MM-DD") : "",
                tag.exportDate ? dayjs(tag.exportDate).format("YYYY-MM-DD") : ""
            ])
        ].map(row => row.join(",")).join("\n");

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `tags_export_${dayjs().format("YYYYMMDD")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to handle filtering based on company name
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm(); // Close the filter dropdown

        // Update the filters in table parameters
        setTableParams(prev => ({
            ...prev,
            filters: {
                ...prev.filters,
                [dataIndex]: selectedKeys.length ? selectedKeys : null
            },
            // Reset to first page when filtering
            pagination: {
                ...prev.pagination,
                current: 1
            }
        }));

        // Refetch data with new filters
        setTimeout(() => refetch(), 0);
    };

    const handleReset = (confirm, clearFilters, dataIndex) => {
        clearFilters();

        // Remove this specific filter
        setTableParams(prev => {
            const newFilters = { ...prev.filters };
            delete newFilters[dataIndex];

            return {
                ...prev,
                filters: newFilters,
                // Reset to first page when clearing filter
                pagination: {
                    ...prev.pagination,
                    current: 1
                }
            };
        });

        confirm();
        setTimeout(() => refetch(), 0);
    };

    const getStatusBadge = (status) => {
        if (status === "in store") {
            return <Badge className="bg-green-500">{status}</Badge>;
        } else {
            return <Badge className="bg-orange-500">{status}</Badge>;
        }
    };

    const columns = [
        {
            title: "Company Name",
            dataIndex: "companyName",
            key: "companyName",
            sorter: true,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search Company Name"
                        value={selectedKeys[0]}
                        autoFocus
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, "companyName")}
                        style={{ width: 188, marginBottom: 8, display: "block" }}
                    />
                    <div className="flex gap-2">
                        <Button
                            onClick={() => handleSearch(selectedKeys, confirm, "companyName")}
                            size="sm"
                            className="bg-orange-300 hover:bg-orange-400"
                        >
                            Search
                        </Button>
                        <Button
                            onClick={() => handleReset(confirm, clearFilters, "companyName")}
                            size="sm"
                            className="bg-red-300 hover:bg-red-400"
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            ),
            filterIcon: (filtered) => <SearchOutlined size={30} style={{ color: filtered ? "#1890ff" : undefined }} />,
        },
        {
            title: "Tag Number",
            dataIndex: "tagNumber",
            key: "tagNumber",
            sorter: true,
        },
        {
            title: "Weight",
            dataIndex: "weight",
            key: "weight",
            sorter: true,
        },
        {
            title: "Sheet Number",
            dataIndex: "sheetNumber",
            key: "sheetNumber",
        },
        {
            title: "Tag Type",
            dataIndex: "tagType",
            key: "tagType",
            render: (text) => <span className="capitalize">{text}</span>,
            filters: [
                { text: 'Mine', value: 'mine' },
                { text: 'Negociant', value: 'negociant' },
            ],
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => getStatusBadge(status),
            filters: [
                { text: 'In Store', value: 'in store' },
                { text: 'Out of Store', value: 'out of store' },
            ],
        },
        {
            title: "Registration Date",
            dataIndex: "registrationDate",
            key: "registrationDate",
            sorter: true,
            render: (text) => {
                if (text) {
                    return <span>{dayjs(text).format("MMM DD, YYYY")}</span>
                } else {
                    return null;
                }
            }
        },
        {
            title: "Export Date",
            dataIndex: "exportDate",
            key: "exportDate",
            sorter: true,
            render: (text) => {
                if (text) {
                    return <span>{dayjs(text).format("MMM DD, YYYY")}</span>
                } else {
                    return null;
                }
            }
        }
    ];

    return (
        <>
            <ListContainer
                title={"List of Tags"}
                isAllowed={userPermissions.tags?.create}
                navLinktext={"add/tag"}
                navtext={"Add New Tag"}
                table={
                    <Card className="w-full shadow-sm">
                        <CardContent className="p-0">
                            <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="flex items-center gap-2">
                                                <Filter size={16} />
                                                Filter Tag Type
                                                <ChevronDown size={16} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => setTagTypeFilter(null)}>
                                                All Types
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTagTypeFilter("mine")}>
                                                Mine
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTagTypeFilter("negociant")}>
                                                Negociant
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <Select
                                        value={tableParams.pagination.pageSize.toString()}
                                        onValueChange={(value) => {
                                            setTableParams({
                                                ...tableParams,
                                                pagination: {
                                                    ...tableParams.pagination,
                                                    pageSize: parseInt(value),
                                                    current: 1
                                                }
                                            });
                                            setTimeout(() => refetch(), 0);
                                        }}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Row per page" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10 per page</SelectItem>
                                            <SelectItem value="25">25 per page</SelectItem>
                                            <SelectItem value="50">50 per page</SelectItem>
                                            <SelectItem value="100">100 per page</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                    onClick={handleExportCSV}
                                >
                                    <Download size={16} />
                                    Export to CSV
                                </Button>
                            </div>

                            <Table
                                className="w-full"
                                loading={{
                                    indicator: (
                                        <ImSpinner2
                                            style={{ width: "60px", height: "60px" }}
                                            className="animate-spin text-gray-500"
                                        />
                                    ),
                                    spinning: isLoading,
                                }}
                                dataSource={modifiedTags}
                                columns={columns}
                                rowKey="_id"
                                pagination={{
                                    ...tableParams.pagination,
                                    showSizeChanger: false, // We're using our custom size changer
                                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                                }}
                                onChange={handleTableChange}
                                footer={() => {
                                    return (
                                        <div className="flex flex-wrap justify-start gap-4">
                                            <p className="text-lg font-semibold">Total Tags: {totalTags}</p>
                                            <p className="text-lg font-semibold">Tags in store: {storeTags}</p>
                                            {tagTypeFilter && (
                                                <p className="text-lg font-semibold">
                                                    Filtered by: <Badge>{tagTypeFilter}</Badge>
                                                </p>
                                            )}
                                        </div>
                                    );
                                }}
                            />
                        </CardContent>
                    </Card>
                }
            />
        </>
    );
};

export default ListTags;