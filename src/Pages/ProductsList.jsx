import ProductListContainer from "../components/Listcomponents/ProductListContainer";
import BasicTable from "../components/tables/BasicTable";
import { useMyContext } from "../context files/MycontextProvider";

const ProductsList = () => {
    const { sharedData, updateSharedData } = useMyContext();

    return (
        <>
            <ProductListContainer title={'Product list'}
                subTitle={'Manage product list'}
                navLinktext={'add/product'}
                navtext={'Add new product'}
                table={< BasicTable />} />
        </>
    )
}
export default ProductsList;