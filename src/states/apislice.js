import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "",
       
    }),
    tagTypes:[""],

    endpoints:(builder)=>({

        endpointname: builder.query({
            query: () => ``,
            providesTags: [""],
        }),

    })
});
export const {useEndpointnameQuery}=apiSlice