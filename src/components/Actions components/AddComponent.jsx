import { Spin } from "antd";
import { ImSpinner2 } from "react-icons/im";

const AddComponent = ({ Add, Cancel, component, isloading }) => {
  return (
    <form onSubmit={Add} className="flex flex-col p-3 h-fit gap-2">
      <>{component}</>
      <div className=" self-end flex gap-2 flex-col sm:flex-row w-full justify-start sm:gap-2 items-start action-buttons">
        {isloading ? (
          <button
            className="px-2 flex gap-1 items-center justify-start py-2 bg-orange-200 rounded-md text-gray-500"
            type="submit"
          >
            <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500" />
            Sending
          </button>
        ) : (
          <button className="px-6 py-2 bg-orange-300 rounded-md" type="submit">
            Submit
          </button>
        )}
        <button
          className="px-6 py-2 bg-blue-100 rounded-md"
          onClick={Cancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
export default AddComponent;
