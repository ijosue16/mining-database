import React from "react";
import pluginsList from "./ToolbarIcons";
import useOnClickListener from "./UseOnClickListener";

const ToolbarEditor=()=>{
    const {onClick}=useOnClickListener();

return (
    <>
    <ul className="w-full p-2 bg-white grid rounded grid-flow-col justify-between">
    {pluginsList.map(({id,Icon,event})=>(
        <li key={id}>
            <span onClick={()=>onClick(event)}>{Icon}</span>
        </li>
    ))}
    </ul>
    </>
)
}
export default ToolbarEditor;