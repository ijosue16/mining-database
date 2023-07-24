const AddComponent = ({ Add, Cancel, component,isloading }) => {
    return (

        <form  onSubmit={Add} className="flex flex-col p-3 h-fit gap-2">
            <>
                {component}</>
            <div className=" self-end block space-x-2 sm:flex w-full justify-start sm:gap-2 items-center action-buttons">
                <button className="px-6 py-2 bg-amber-100 rounded-md"  type="submit">{isloading ? 'loading':'submit'}</button>
                <button className="px-6 py-2 bg-blue-100 rounded-md" onClick={Cancel} type="button">cancel</button>
            </div>
        </form>


    )
}
export default AddComponent;