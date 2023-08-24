import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://mining-company-management-system.onrender.com/api/v1/",
        // prepareHeaders: (headers, {getState}) => {
        //     const token = getState.auth.token;
        //     if (token) {
        //         headers.append('Authorization', `Bearer ${token}`)
        //     }
        //     return headers;
        // }
    }),
    tagTypes: ['buyers', 'contracts', 'shipments', 'dueDiligence', 'payments', 'entries'],
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
        logout: builder.mutation({
            query: () => ({
                url: `/users/logout`,
                method: 'POST'
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
        getAllPayments: builder.query({
            query: () => `/payments`,
            providesTags: ['payments', 'entries']
        }),
        addPayment: builder.mutation({
            query: ({body}) => ({
                url: `/payments`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['payments']
        }),
        getOnePayment: builder.query({
            query: ({paymentId}) => `/payments/${paymentId}`,
            providesTags: ['payments']
        }),
        getAllEntries: builder.query({
            query: () => `/entries`,
            providesTags: ['entries', 'payments', 'buyers']
        }),
        getOneEntry: builder.query({
            query: ({entryId, model}) => `/entries/${model}/${entryId}`,
            providesTags: ['entries', 'payments', 'buyers']
        }),
        createEntry: builder.mutation({
            query: ({body, model}) => ({
                url: `/entries/${model}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
        }),
        updateEntry: builder.mutation({
            query: ({body, model, entryId}) => ({
                url: `/entries/${model}/${entryId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
        }),
        deleteEntry: builder.mutation({
            query: ({model, entryId}) => ({
                url: `/entries/${model}/${entryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
        }),
        createColtanEntry: builder.mutation({
            query: ({body}) => ({
                url: `/coltan`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
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
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
        }),
        deleteColtanEntry: builder.mutation({
            query: ({entryId}) => ({
                url: `/coltan/${entryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
        }),
        createCassiteriteEntry: builder.mutation({
            query: ({body}) => ({
                url: `/cassiterite`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
        }),
        getAllCassiteriteEntries: builder.query({
            query: () => `/Cassiterite`,
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
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
        }),
        deleteCassiteriteEntry: builder.mutation({
            query: ({entryId}) => ({
                url: `/cassiterite/${entryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
        }),
        createBerylliumEntry: builder.mutation({
            query: ({body}) => ({
                url: `/beryllium`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
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
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
        }),
        deleteBerylliumEntry: builder.mutation({
            query: ({entryId}) => ({
                url: `/beryllium/${entryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
        }),
        createLithiumEntry: builder.mutation({
            query: ({body}) => ({
                url: `/lithium`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
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
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
        }),
        deleteLithiumEntry: builder.mutation({
            query: ({entryId}) => ({
                url: `/lithium/${entryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
        }),
        createWolframiteEntry: builder.mutation({
            query: ({body}) => ({
                url: `/wolframite`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
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
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
        }),
        deleteWolframiteEntry: builder.mutation({
            query: ({entryId}) => ({
                url: `/wolframite/${entryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
        }),
        createMixedEntry: builder.mutation({
            query: ({body}) => ({
                url: `/mixed`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['entries', 'payments', 'buyers', 'shipment']
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
        updateShipment: builder.mutation({
            query: ({body, shipmentId}) => ({
                url: `/shipments/${shipmentId}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: ["shipments", "entries"]
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
    })
});
export const {
    useEndpointnameQuery,
    useSignupMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetAllBuyersQuery,
    useCreateBuyerMutation,
    useGetOneBuyerQuery,
    useUpdateBuyerMutation,
    useDeleteBuyerMutation,
    useGetAllContractsQuery,
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
    useGetAllPaymentsQuery,
    useAddPaymentMutation,
    useGetOnePaymentQuery,
    useGetAllEntriesQuery,
    useGetOneEntryQuery,
    useUpdateEntryMutation,
    useCreateEntryMutation,
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
    useShipmentReportMutation,
    useDetailedStockQuery
} = apiSlice