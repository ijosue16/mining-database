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
    tagTypes:['buyers', 'contracts', 'shipments', 'dueDiligence','payments'],
    endpoints:(builder)=>({

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
                url: `/users/login`,
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
            invalidatesTags: ['shipments', 'buyers']
        })
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
    useGetAllShipmentsQuery,
    useAddShipmentMutation}=apiSlice