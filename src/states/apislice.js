import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

// const existingUrl = "https://mining-company-management-system.onrender.com/api/v1/";
// "http://localhost:5001/api/v1/"

const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;

export const apiSlice = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, {getState}) => {
            const token = getState().persistedReducer?.global?.token
            if (token) {
                headers.append('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['buyers', 'contracts', 'advance-payment', 'messages', "tags", 'lots', 'lot-shipments',  'notifications', 'shipments', 'dueDiligence', 'payments', 'entries','suppliers', 'invoice', "dd-reports", "statistics", "settings", "editRequest"],
    endpoints: (builder) => ({

        endpointname: builder.query({
            query: () => ``,
            providesTags: [""],
        }),
        getAllBuyers: builder.query({
            query: () => `/buyers`,
            providesTags: ['buyers', 'contracts']
        }),
        createBuyer: builder.mutation({
            query: ({body}) => ({
                url: `/buyers`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['buyers', 'contracts']
        }),
        getOneBuyer: builder.query({
            query: ({buyerId}) => `/buyers/${buyerId}`,
            providesTags: ['buyers', 'contracts']
        }),
        updateBuyer: builder.mutation({
            query: ({body, buyerId}) => ({
                url: `/buyers/${buyerId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['buyers', 'contracts']
        }),
        deleteBuyer: builder.mutation({
            query: ({buyerId}) => ({
                url: `/buyers/${buyerId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['buyers', 'contracts']
        }),
        getAllContracts: builder.query({
            query: () => `/contracts`,
            providesTags: ['buyers', 'contracts']
        }),
        getBuyerContracts: builder.query({
            query: ({buyerId}) => `/contracts/${buyerId}`,
            providesTags: ['buyers', 'contracts']
        }),
        addContract: builder.mutation({
            query: ({body}) => ({
                url: `/contracts`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['contracts', 'buyers']
        }),
        downloadContract: builder.mutation({
            query: ({contractId}) => ({
                url: `/contracts/${contractId}`,
                method: 'POST',
                responseHandler: response => response.blob()
            })
        }),
        updateContract: builder.mutation({
            query: ({body, contractId}) => ({
                url: `/contracts/${contractId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['buyers', 'contracts']
        }),
        deleteContract: builder.mutation({
            query: ({contractId}) => ({
                url: `/contracts/${contractId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['buyers', 'contracts']
        }),
        signup: builder.mutation({
            query: ({body}) => ({
                url: `/users/signup`,
                method: 'POST',
                body,
            })
        }),
        login: builder.mutation({
            query: ({body}) => ({
                url: `/users/login`,
                method: 'POST',
                body
            })
        }),
        resetPassword: builder.mutation({
            query: ({ body }) => ({
                url: '/users/reset-password/manual',
                method: 'PATCH',
                body
            })
        }),
        logout: builder.mutation({
            query: ({body}) => ({
                url: `/users/logout`,
                method: 'POST',
                body
            })
        }),
        setup2FA: builder.mutation({
            query: ({body}) => ({
                url: `/users/setup-2fa`,
                method: 'POST',
                body
            })
        }),
        verify2FA: builder.mutation({
            query: ({body}) => ({
                url: `/users/verify-2fa`,
                method: 'POST',
                body
            })
        }),
        verifyCode: builder.mutation({
            query: ({body}) => ({
                url: `/users/verify-code`,
                method: 'POST',
                body
            })
        }),
        verifyToken: builder.mutation({
            query: ({token}) => ({
                url: `/users/verify-token`,
                method: 'POST',
                body: {token}
            })
        }),
        getAllDueDiligence: builder.query({
            query: () => `/duediligence`,
            providesTags: ['dueDiligence', 'buyers']
        }),
        addDueDiligence: builder.mutation({
            query: ({body}) => ({
                url: `/duediligence`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['dueDiligence', 'buyers']
        }),
        downloadDueDiligence: builder.mutation({
            query: ({documentId}) => ({
                url: `/duediligence/${documentId}`,
                method: 'POST',
                responseHandler: response => response.blob()
            }),
        }),
        updateDueDiligence: builder.mutation({
            query: ({body, documentId}) => ({
                url: `/duediligence/${documentId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['dueDiligence', 'buyers']
        }),
        deleteDueDiligence: builder.mutation({
            query: ({documentId}) => ({
                url: `/duediligence/${documentId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['dueDiligence', 'buyers']
        }),
        getAllSuppliers: builder.query({
            query: () => `/suppliers`,
            providesTags: ['suppliers']
        }),
        addSupplier: builder.mutation({
            query: ({body}) => ({
                url: `/suppliers`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['suppliers']
        }),
        updateSupplier: builder.mutation({
            query: ({body, supplierId}) => ({
                url: `/suppliers/${supplierId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['suppliers']
        }),
        getOneSupplier: builder.query({
            query: ({supplierId}) => `/suppliers/${supplierId}`,
            providesTags: ['suppliers']
        }),
        deleteSupplier: builder.mutation({
            query: ({supplierId}) => ({
                url: `/suppliers/${supplierId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['suppliers']
        }),
        generateDDReport: builder.mutation({
            query: ({body, supplierId}) => ({
                url: `/suppliers/generate/${supplierId}`,
                method: "POST",
                body
            }),
            invalidatesTags: ['suppliers']
        }),
        getAllPayments: builder.query({
            query: () => `/payments`,
            providesTags: ['payments', 'entries', "statistics", "advance-payment"]
        }),
        addPayment: builder.mutation({
            query: ({body}) => ({
                url: `/payments`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['payments', "statistics", "advance-payment", 'lots']
        }),
        getOnePayment: builder.query({
            query: ({paymentId}) => `/payments/${paymentId}`,
            providesTags: ['payments', "statistics", "advance-payment"]
        }),
        updatePayment: builder.mutation({
            query: ({body, paymentId, model}) => ({
                url: `/payments/update/${model}/${paymentId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['payments', "statistics", "advance-payment"]
        }),
        getAllAdvancePayments: builder.query({
            query: ({query = ""}) => `/advance-payment?${query}`,
            providesTags: ["advance-payment", "payments", "entries", "statistics"]
        }),
        getAllAdvancePaymentsBySupplier: builder.query({
            query: ({supplierId}) => `/advance-payment/${supplierId}`,
            providesTags: ["advance-payment", "payments", "entries", "statistics"]
        }),
        addAdvancePayment: builder.mutation({
            query: ({body}) => ({
                url: "/advance-payment",
                method: "POST",
                body
            }),
            invalidatesTags: ["advance-payment", "payments", "entries", "statistics"]
            // beneficiaryName, beneficiaryNationalId, phoneNumber, email, paymentAmount, currency, location, paymentDate, contractFile supplierId
        }),
        getOneAdvancePayment: builder.query({
            query: (paymentId) => `/advance-payment/${paymentId}`,
            providesTags: ["advance-payment", "payments", "entries", "statistics"]
        }),
        updateAdvancePayment: builder.mutation({
            query: ({body, paymentId}) => ({
                url: `/advance-payment/${paymentId}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: ["advance-payment"]
        }),
        getAllEntries: builder.query({
            query: ({model}) => `/entry/${model}`,
            providesTags: ['entries', 'payments', 'buyers', 'lots']
        }),
        getEntry: builder.query({
            query: ({model, entryId}) => `/entry/${model}/${entryId}`,
            providesTags: ['entries', 'payments', 'buyers']
        }),
        createEntry: builder.mutation({
            query: ({body, model}) => ({
                url: `/entry/${model}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments', 'lots']
        }),
        updateEntry: builder.mutation({
            query: ({body, model, entryId}) => ({
                url: `/entry/${model}/${entryId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments', 'lots']
        }),
        deleteEntry: builder.mutation({
            query: ({model, entryId}) => ({
                url: `/entry/${model}/${entryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        getOneEntry: builder.query({
            query: ({entryId, model}) => `/stock/entry-info/${model}/${entryId}`,
            providesTags: ['entries', 'payments', 'buyers']
        }),
        getEntriesPayments: builder.query({
            query: ({query}) => `/entry/finance/payments/summary${query ? '?' + query : ''}`,
            providesTags: ['entries', 'payments', 'buyers', 'lots', 'fees']
        }),
        createColtanEntry: builder.mutation({
            query: ({body}) => ({
                url: `/coltan`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        getAllColtanEntries: builder.query({
            query: () => `/coltan`,
            providesTags: ['entries', 'payments', 'buyers']
        }),
        getOneColtanEntry: builder.query({
            query: ({entryId}) => `/coltan/${entryId}`,
            providesTags: ['entries', 'payments', 'buyers']
        }),
        updateColtanEntry: builder.mutation({
            query: ({body, entryId}) => ({
                url: `/coltan/${entryId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        deleteColtanEntry: builder.mutation({
            query: ({entryId}) => ({
                url: `/coltan/${entryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        createCassiteriteEntry: builder.mutation({
            query: ({body}) => ({
                url: `/cassiterite`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        getAllCassiteriteEntries: builder.query({
            query: () => `/cassiterite`,
            providesTags: ['entries', 'payments', 'buyers']
        }),
        getOneCassiteriteEntry: builder.query({
            query: ({entryId}) => `/cassiterite/${entryId}`,
            providesTags: ['entries', 'payments', 'buyers']
        }),
        updateCassiteriteEntry: builder.mutation({
            query: ({body, entryId}) => ({
                url: `/cassiterite/${entryId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        deleteCassiteriteEntry: builder.mutation({
            query: ({entryId}) => ({
                url: `/cassiterite/${entryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        createBerylliumEntry: builder.mutation({
            query: ({body}) => ({
                url: `/beryllium`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        getAllBerylliumEntries: builder.query({
            query: () => `/beryllium`,
            providesTags: ['entries', 'payments', 'buyers']
        }),
        getOneBerylliumEntry: builder.query({
            query: ({entryId}) => `/beryllium/${entryId}`,
            providesTags: ['entries', 'payments', 'buyers']
        }),
        updateBerylliumEntry: builder.mutation({
            query: ({body, entryId}) => ({
                url: `/beryllium/${entryId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        deleteBerylliumEntry: builder.mutation({
            query: ({entryId}) => ({
                url: `/beryllium/${entryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        createLithiumEntry: builder.mutation({
            query: ({body}) => ({
                url: `/lithium`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        getAllLithiumEntries: builder.query({
            query: () => `/lithium`,
            providesTags: ['entries', 'payments', 'buyers']
        }),
        getOneLithiumEntry: builder.query({
            query: ({entryId}) => `/lithium/${entryId}`,
            providesTags: ['entries', 'payments', 'buyers']
        }),
        updateLithiumEntry: builder.mutation({
            query: ({body, entryId}) => ({
                url: `/lithium/${entryId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        deleteLithiumEntry: builder.mutation({
            query: ({entryId}) => ({
                url: `/lithium/${entryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        createWolframiteEntry: builder.mutation({
            query: ({body}) => ({
                url: `/wolframite`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        getAllWolframiteEntries: builder.query({
            query: () => `/wolframite`,
            providesTags: ['entries', 'payments', 'buyers']
        }),
        getOneWolframiteEntry: builder.query({
            query: ({entryId}) => `/wolframite/${entryId}`,
            providesTags: ['entries', 'payments', 'buyers']
        }),
        updateWolframiteEntry: builder.mutation({
            query: ({body, entryId}) => ({
                url: `/wolframite/${entryId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        deleteWolframiteEntry: builder.mutation({
            query: ({entryId}) => ({
                url: `/wolframite/${entryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        createMixedEntry: builder.mutation({
            query: ({body}) => ({
                url: `/mixed`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipments']
        }),
        detailedStock: builder.query({
            query: ({model}) => `/stock/details/${model}`,
            providesTags: ["shipments"]
        }),
        getAllShipments: builder.query({
            query: () => `/shipments`,
            providesTags: ['shipments', 'buyers']
        }),
        addShipment: builder.mutation({
            query: ({body}) => ({
                url: `/shipments`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['shipments', 'buyers', "entries"]
        }),
        getOneShipment: builder.query({
            query: (shipmentId) => `/shipments/${shipmentId}`,
            providesTags: ["shipments", "buyers", "entries"]
        }),
        updateShipment: builder.mutation({
            query: ({body, shipmentId}) => ({
                url: `/shipments/${shipmentId}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: ["shipments", "entries"]
        }),
        getTagsList: builder.query({
            query: ({shipmentId}) => `/shipments/tags/${shipmentId}`,
            providesTags: ["shipments", "entries", "tags"]
        }),
        generateNegociantTagsList: builder.mutation({
            query: ({shipmentId}) => ({
                url: `/shipments/negociant-tags/${shipmentId}`,
                method: "POST"
            })
        }),
        generatePackingList: builder.mutation({
            query: ({shipmentId}) => ({
                url: `/shipments/packing-list/${shipmentId}`,
                method: "POST"
            })
        }),
        getListTags: builder.query({
            query: ({query}) => `/tags${query ? "?"+query : ""}`,
            providesTags: ["tags"]
        }),
        createTag: builder.mutation({
            query: ({body}) => ({
                url: `/tags`,
                method: "POST",
                body
            }),
            invalidatesTags: ["tags"]
        }),
        deleteTag: builder.mutation({
            query: ({tagNumber}) => ({
                url: `/tags/${tagNumber}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["tags"]
        }),
        createAndUpdateTags: builder.mutation({
            query: ({body}) => ({
                url: `/tags/create-update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['tags']
        }),
        // getEntryTags: builder.query({
        //     query: ({entryId})
        // }),
        getSupplierTags: builder.query({
            query: ({supplierId}) => `/tags/supplier/${supplierId}`,
            providesTags: ["tags"]
        }),
        updateTag: builder.mutation({
            query: ({body, tagNumber}) => ({
                url: `/tags/${tagNumber}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: ["tags"]
        }),
        generateTagList: builder.mutation({
           query: ({shipmentId}) => ({
               url: `/shipments/tags/${shipmentId}`,
               method: "POST"
           }),
            invalidatesTags: ["tags", 'shipments']
        }),
        shipmentReport: builder.mutation({
            query: ({shipmentId}) => ({
                url: `/shipments/report/${shipmentId}`,
                method: "POST",
                responseHandler:(response)=>{
                   return response.blob();
                },
            })
        }),
        shipmentReportSpreadsheet: builder.mutation({
            query: ({shipmentId}) => ({
                url: `/shipments/report/worksheet/${shipmentId}`,
                method: "POST",
                responseHandler: (response) => {
                    return response.blob();
                }
            })
        }),
        shipmentSuppliersGraph: builder.query({
            query: ({shipmentId}) => `/shipments/graph/${shipmentId}`,
            providesTags: ["shipments"]
        }),
        getPaymentHistory: builder.query({
            query: ({entryId, model, lotNumber}) => `/stock/payment-history/${model}/${entryId}/${lotNumber}`,
            providesTags: ["payments", "advance-payment", "statistics"]
        }),
        getFileStructure: builder.mutation({
            query: ({body}) =>  ({
                url: "/file-structure",
                method: "POST",
                body
            }),
            invalidatesTags: ["shipments", "buyers", "contracts", "advance-payment", "dd-reports"]
        }),
        getExistingFileForEdit: builder.query({
            query: ({url}) => `/file-structure/file?url=${encodeURIComponent(url)}`,
            providesTags: ["dd-reports"]
        }),
        saveFile: builder.mutation({
            query: ({body}) => ({
                url: "/file-structure/file",
                method: "PATCH",
                body
            })
        }),
        convertToSFDT: builder.mutation({
            query: ({body}) => ({
                url: "/file-structure/convert",
                method: "POST",
                body,
            }),
            invalidatesTags: ["dd-reports"]
        }),
        downloadFile: builder.mutation({
            query: () => ({
                url: "/file-structure/download",
                method: "POST",
                // body,
                // responseHandler: response => {
                //     return response.blob();
                // }
            })
        }),
        getSettings: builder.query({
            query: () => `/settings`,
            providesTags: ["settings"]
        }),
        updateSettings: builder.mutation({
            query: ({body}) => ({
                url: "/settings",
                method: "PATCH",
                body
            }),
            invalidatesTags: ["settings"]
        }),
        getSupplierProductionHistory: builder.mutation({
            query: ({body, supplierId}) => ({
                url: `/suppliers/history/${supplierId}`,
                method: "POST",
                body
            }),
            invalidatesTags: ["suppliers", "entries", "shipments"]
        }),
        getDueDiligence: builder.query({
            query: () => `/suppliers/due-diligence`,
        }),
        getAllUsers: builder.query({
            query: () => `/users`,
            providesTags: ["users"]
        }),
        getOneUser: builder.query({
            query: (userId) => `/users/${userId}`,
            providesTags: ["users"]
        }),
        updateUser: builder.mutation({
            query: ({body, userId}) => ({
                url: `/users/${userId}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: ["users"]
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["users"]
        }),
        getAllInvoices: builder.query({
            query: () => `/invoice`,
            providesTags: ['invoice']
        }),
        getSuppliersInvoice: builder.query({
            query: (supplierId) => `/invoice/supplier/${supplierId}`,
            providesTags: ['invoice']
        }),
        generateInvoice: builder.mutation({
            query: ({body}) => ({
                url: `/invoice`,
                method: "POST",
                body,
                // responseHandler:response=>response.blob()
            }),
            invalidatesTags: ['invoice']
        }),
        updateInvoice: builder.mutation({
            query: ({body, invoiceId}) => ({
                url: `/invoice/${invoiceId}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: ['invoice']
        }),
        getInvoice: builder.query({
            query: (invoiceId) => `/invoice/${invoiceId}`,
            providesTags: ['invoice']
        }),
        getUnsettledLots: builder.query({
            query: (supplierId) => `/stock/unpaid-lots/${supplierId}`,
            providesTags: ['payments', 'entries', 'suppliers']
        }),
        getAllEditRequests: builder.query({
            query: ({query}) => `/edit-request${query? `?${query}` : ''}`,
            providesTags: ['editRequest', 'notifications']
        }),
        createEditRequest: builder.mutation({
            query: ({body}) => ({
                url: `/edit-request`,
                method: "POST",
                body
            }),
            invalidatesTags: ['editRequest', 'notifications']
        }),
        getOneEditRequest: builder.query({
            query: ({requestId}) => `/edit-request/${requestId}`,
            providesTags: ['editRequest']
        }),
        updateEditRequest: builder.mutation({
            query: ({body, requestId}) => ({
                url: `/edit-request/${requestId}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: ['editRequest', 'notifications']
        }),
        deleteGradeImg: builder.mutation({
            query: ({lotId}) => ({
                url: `/lots/delete-grade-image/${lotId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['entries', 'lots']
        }),
        getMessages: builder.query({
            query: ({chatId}) => `/message/${chatId}`,
            providesTags: ['messages']
        }),
        addMessage: builder.mutation({
            query: ({body}) => ({
                url: `/message`,
                method: "POST",
                body
            }),
            providesTags: ['messages']
        }),
        lastMessage: builder.query({
            query: ({chatId}) => `/message/last/${chatId}`,
            providesTags: ['messages']
        }),
        createChat: builder.mutation({
            query: ({body}) => ({
                url: `/chat`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['chat']
        }),
        userChats: builder.query({
            query: ({userId}) => `/chat/${userId}`,
            providesTags: ['chat']
        }),
        findChat: builder.query({
            query: ({firstId, secondId}) => `/chat/find/${firstId}/${secondId}`,
            providesTags: ['chat']
        }),
        getAllLogs: builder.query({
            query: () => `/logs`,
            providesTags: ['logs']
        }),
        getNotifications: builder.query({
            query: (userId) => `/users/notifications/${userId}`,
            providesTags: ['notifications']
        }),
        updateNotificationStatus: builder.mutation({
            query: ({userId, notificationId}) => ({
                url: `/users/notifications/${userId}/${notificationId}`,
                method: "PATCH",
            }),
            invalidatesTags: ['notifications']
        }),
        getStockSummary: builder.query({
            query: () => `/stock/stock-summary`,
            providesTags: ['stock']
        }),
        getYearStockSummary: builder.query({
            query: ({year}) => `/stock/current-stock/${year ? year : new Date().getFullYear()}`,
            invalidatesTags: ['stock']
        }),
        generateLabReport: builder.mutation({
            query: ({body, model}) => ({
                url: `/entry/lab-report/${model}`,
                method: "POST",
                body,
            })
        }),
        generateForwardNote: builder.mutation({
            query: ({shipmentId}) => ({
                url: `/shipments/forward-note/${shipmentId}`,
                method: "POST",
            }),
            invalidatesTags: ['shipments']
        }),
        getLotById: builder.query({
            query: ({id}) => `/lots/${id}`,
            providesTags: ['lots']
        }),
        createLots: builder.mutation({
            query: ({body}) => ({
                url: `/lots`,
                method: "POST",
                body
            }),
            invalidatesTags: ['lots', 'entries']
        }),
        updateLot: builder.mutation({
            query: ({lotId, body}) => ({
                url: `/lots/${lotId}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: ['lots', 'entries']
        }),
        deleteLot: builder.mutation({
            query: ({lotId}) => ({
                url: `/lots/${lotId}`,
                method: "DELETE",
                invalidatesTags: ['lots', 'entries']
            }),
        }),
        createLotShipments: builder.mutation({
            query: ({body}) => ({
                url: '/lot-shipments',
                method: 'POST',
                body
            }),
            invalidatesTags: ['lot-shipments']
        }),
        updateLotShipments: builder.mutation({
            query: ({body, id}) => ({
                url: `/lot-shipments/${id}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['lot-shipments']
        }),
        deleteLotShipments: builder.mutation({
            query: ({body, id}) => ({
                url: `/lot-shipments/${id}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['lot-shipments']
        }),
        getAllFeeTypes: builder.query({
            query: () => `/fee-types`,
            providesTags: ['fee-type']
        }),
        getFeeTypeById: builder.query({
            query: ({id}) => `/fee-types/${id}`,
            providesTags: ['fee-type']
        }),
        createFeeType: builder.mutation({
            query: ({body}) => ({
                url: `/fee-types`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['fee-type']
        }),
        updateFeeType: builder.mutation({
            query: ({body, id}) => ({
                url: `/fee-types/${id}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['fee-type']
        }),
        deleteFeeType: builder.mutation({
            query: ({id}) => ({
                url: `/fee-types/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['fee-type']
        }),
        getFeesByLot: builder.query({
            query: ({lotId}) => `/fees/lot/${lotId}`,
            providesTags: ['fees']
        }),
        createFee: builder.mutation({
            query: ({body}) => ({
                url: `/fees`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['fees', 'lots']
        }),
        updateFee: builder.mutation({
            query: ({body, id}) => ({
                url: `/fees/${id}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['fees', 'lots']
        }),
        deleteFee: builder.mutation({
            query: ({id}) => ({
                url: `/fees/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['fees', 'lots']
        })





    })
})
export const {
    useEndpointnameQuery,
    useSignupMutation,
    useLoginMutation,
    useResetPasswordMutation,
    useLogoutMutation,
    useVerifyTokenMutation,
    useGetAllBuyersQuery,
    useCreateBuyerMutation,
    useGetOneBuyerQuery,
    useUpdateBuyerMutation,
    useDeleteBuyerMutation,
    useGetAllContractsQuery,
    useGetBuyerContractsQuery,
    useAddContractMutation,
    useDownloadContractMutation,
    useUpdateContractMutation,
    useDeleteContractMutation,
    useGetAllDueDiligenceQuery,
    useAddDueDiligenceMutation,
    useDownloadDueDiligenceMutation,
    useUpdateDueDiligenceMutation,
    useDeleteDueDiligenceMutation,
    useGetAllSuppliersQuery,
    useGetOneSupplierQuery,
    useAddSupplierMutation,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation,
    useGetDueDiligenceQuery,
    useGetAllPaymentsQuery,
    useAddPaymentMutation,
    useGetOnePaymentQuery,
    useUpdatePaymentMutation,
    useGetAllAdvancePaymentsQuery,
    useGetOneAdvancePaymentQuery,
    useAddAdvancePaymentMutation,
    useUpdateAdvancePaymentMutation,
    /////   NEW ENDPOINTS
    useGetAllEntriesQuery,
    useGetEntryQuery,
    useCreateEntryMutation,
    useGetOneEntryQuery,
    useUpdateEntryMutation,
    ////    NEW ENDPOINTS
    useDeleteEntryMutation,
    useCreateColtanEntryMutation,
    useGetAllColtanEntriesQuery,
    useGetOneColtanEntryQuery,
    useUpdateColtanEntryMutation,
    useDeleteColtanEntryMutation,
    useCreateCassiteriteEntryMutation,
    useGetAllCassiteriteEntriesQuery,
    useGetOneCassiteriteEntryQuery,
    useUpdateCassiteriteEntryMutation,
    useDeleteCassiteriteEntryMutation,
    useCreateBerylliumEntryMutation,
    useGetAllBerylliumEntriesQuery,
    useGetOneBerylliumEntryQuery,
    useUpdateBerylliumEntryMutation,
    useDeleteBerylliumEntryMutation,
    useCreateLithiumEntryMutation,
    useGetAllLithiumEntriesQuery,
    useGetOneLithiumEntryQuery,
    useUpdateLithiumEntryMutation,
    useDeleteLithiumEntryMutation,
    useCreateWolframiteEntryMutation,
    useGetAllWolframiteEntriesQuery,
    useGetOneWolframiteEntryQuery,
    useUpdateWolframiteEntryMutation,
    useDeleteWolframiteEntryMutation,
    useCreateMixedEntryMutation,
    useGetAllShipmentsQuery,
    useAddShipmentMutation,
    useUpdateShipmentMutation,
    useGetOneShipmentQuery,
    useGetTagsListQuery,
    useGenerateTagListMutation,
    useUpdateTagMutation,
    useShipmentReportMutation,
    useShipmentReportSpreadsheetMutation,
    useShipmentSuppliersGraphQuery,
    useGetPaymentHistoryQuery,
    useDetailedStockQuery,
    useGetFileStructureMutation,
    useDownloadFileMutation,
    useUpdateSettingsMutation,
    useGetSettingsQuery,
    useGetSupplierProductionHistoryMutation,
    useGetAllUsersQuery,
    useGetOneUserQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetAllInvoicesQuery,
    useGetSuppliersInvoiceQuery,
    useGenerateInvoiceMutation,
    useUpdateInvoiceMutation,
    useGetInvoiceQuery,
    useGetUnsettledLotsQuery,
    useGetAllEditRequestsQuery,
    useCreateEditRequestMutation,
    useGetOneEditRequestQuery,
    useUpdateEditRequestMutation,
    useDeleteGradeImgMutation,
    useLazyGetMessagesQuery,
    useAddMessageMutation,
    useLazyLastMessageQuery,
    useCreateChatMutation,
    useUserChatsQuery,
    useLazyFindChatQuery,
    useGenerateDDReportMutation,
    useGetAllLogsQuery,
    useGetNotificationsQuery,
    useUpdateNotificationStatusMutation,
    useGenerateNegociantTagsListMutation,
    useGeneratePackingListMutation,
    useGetListTagsQuery,
    useCreateTagMutation,
    useGetSupplierTagsQuery,
    useGetStockSummaryQuery,
    useGetYearStockSummaryQuery,
    useGetExistingFileForEditQuery,
    useSaveFileMutation,
    useConvertToSFDTMutation,
    useGenerateLabReportMutation,
    useGenerateForwardNoteMutation,
    useSetup2FAMutation,
    useVerify2FAMutation,
    useVerifyCodeMutation,
    // new hooks
    useGetLotByIdQuery,
    useCreateLotsMutation,
    useUpdateLotMutation,
    useDeleteLotMutation,
    useCreateLotShipmentsMutation,
    useUpdateLotShipmentsMutation,
    useDeleteLotShipmentsMutation,
    // tags
    useDeleteTagMutation,
    useCreateAndUpdateTagsMutation,
    useGetAllFeeTypesQuery,
    useGetFeeTypeByIdQuery,
    useUpdateFeeTypeMutation,
    useCreateFeeTypeMutation,
    useDeleteFeeTypeMutation,
    useGetFeesByLotQuery,
    useCreateFeeMutation,
    useUpdateFeeMutation,
    useDeleteFeeMutation,
    useLazyGetEntriesPaymentsQuery,
} = apiSlice
