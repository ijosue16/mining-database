import React from "react";
import Header from "../Header";



const ActionsPagesContainer = ({title,subTitle,actionsContainer}) => {

    return (
        <>
            <section className="flex flex-col gap-3">
            <Header title={title}
            subTitle={subTitle}/>
                <div className="bg-white p-4 m-0 border rounded-lg h-fit">
                {actionsContainer}
                </div>
            </section>
        </>
    )

}
export default ActionsPagesContainer;