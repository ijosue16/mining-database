// import React, { useMemo } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Separator } from '@/components/ui/separator';
// import { Badge } from '@/components/ui/badge';
//
// const ShipmentPreview = ({ selectedLots, quantityMap }) => {
//     // Calculate shipment statistics
//     const shipmentStats = useMemo(() => {
//         if (!selectedLots.length) return null;
//
//         let totalWeight = 0;
//         let weightedMineralGrade = 0;
//         let weightedMineralPrice = 0;
//         let weightedTantalum = 0;
//         let weightedNiobium = 0;
//         let weightedIron = 0;
//
//         // Group lots by mineral type for better reporting
//         const mineralGroups = {};
//
//         selectedLots.forEach(lot => {
//             const quantity = parseFloat(quantityMap[lot._id] || 0);
//             if (quantity <= 0) return;
//
//             totalWeight += quantity;
//
//             // Add to mineral type group
//             const mineralType = lot.entry.mineralType;
//             if (!mineralGroups[mineralType]) {
//                 mineralGroups[mineralType] = {
//                     type: mineralType,
//                     lots: [],
//                     totalWeight: 0
//                 };
//             }
//             mineralGroups[mineralType].lots.push({...lot, shipmentQuantity: quantity});
//             mineralGroups[mineralType].totalWeight += quantity;
//
//             // Calculate weighted averages if values exist
//             if (lot.mineralGrade) {
//                 weightedMineralGrade += lot.mineralGrade * quantity;
//             }
//
//             if (lot.mineralPrice) {
//                 weightedMineralPrice += lot.mineralPrice * quantity;
//             }
//
//             // Calculate specific minerals for coltan
//             if (lot.entry.mineralType === 'coltan') {
//                 if (lot.tantal) weightedTantalum += lot.tantal * quantity;
//                 if (lot.niobium) weightedNiobium += lot.niobium * quantity;
//                 if (lot.iron) weightedIron += lot.iron * quantity;
//             }
//         });
//
//         // Calculate final weighted averages
//         const averageMineralGrade = totalWeight > 0 ? weightedMineralGrade / totalWeight : 0;
//         const averageMineralPrice = totalWeight > 0 ? weightedMineralPrice / totalWeight : 0;
//         const averageTantalum = totalWeight > 0 ? weightedTantalum / totalWeight : 0;
//         const averageNiobium = totalWeight > 0 ? weightedNiobium / totalWeight : 0;
//         const averageIron = totalWeight > 0 ? weightedIron / totalWeight : 0;
//
//         return {
//             totalWeight,
//             averageMineralGrade,
//             averageMineralPrice,
//             averageTantalum,
//             averageNiobium,
//             averageIron,
//             mineralGroups: Object.values(mineralGroups)
//         };
//     }, [selectedLots, quantityMap]);
//
//     if (!shipmentStats || shipmentStats.totalWeight === 0) {
//         return (
//             <div className="text-center p-6 text-gray-500">
//                 No valid quantities selected for shipment.
//             </div>
//         );
//     }
//
//     return (
//         <div className="space-y-6">
//             {/* Summary Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <Card>
//                     <CardContent className="pt-6">
//                         <div className="text-sm text-gray-500">Total Weight</div>
//                         <div className="text-2xl font-bold">{shipmentStats.totalWeight.toFixed(2)} kg</div>
//                     </CardContent>
//                 </Card>
//
//                 <Card>
//                     <CardContent className="pt-6">
//                         <div className="text-sm text-gray-500">Avg. Mineral Grade</div>
//                         <div className="text-2xl font-bold">
//                             {shipmentStats.averageMineralGrade ? shipmentStats.averageMineralGrade.toFixed(2) : 'N/A'}
//                         </div>
//                     </CardContent>
//                 </Card>
//
//                 <Card>
//                     <CardContent className="pt-6">
//                         <div className="text-sm text-gray-500">Avg. Mineral Price</div>
//                         <div className="text-2xl font-bold">
//                             {shipmentStats.averageMineralPrice ? `$${shipmentStats.averageMineralPrice.toFixed(2)}` : 'N/A'}
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//
//             {/* Coltan specific stats if any coltan is included */}
//             {shipmentStats.mineralGroups.some(group => group.type === 'coltan') && (
//                 <div>
//                     <h3 className="text-md font-medium mb-3">Coltan Analysis</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <Card>
//                             <CardContent className="pt-6">
//                                 <div className="text-sm text-gray-500">Avg. Tantalum</div>
//                                 <div className="text-2xl font-bold">
//                                     {shipmentStats.averageTantalum ? `${shipmentStats.averageTantalum.toFixed(2)}%` : 'N/A'}
//                                 </div>
//                             </CardContent>
//                         </Card>
//
//                         <Card>
//                             <CardContent className="pt-6">
//                                 <div className="text-sm text-gray-500">Avg. Niobium</div>
//                                 <div className="text-2xl font-bold">
//                                     {shipmentStats.averageNiobium ? `${shipmentStats.averageNiobium.toFixed(2)}%` : 'N/A'}
//                                 </div>
//                             </CardContent>
//                         </Card>
//
//                         <Card>
//                             <CardContent className="pt-6">
//                                 <div className="text-sm text-gray-500">Avg. Iron</div>
//                                 <div className="text-2xl font-bold">
//                                     {shipmentStats.averageIron ? `${shipmentStats.averageIron.toFixed(2)}%` : 'N/A'}
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             )}
//
//             <Separator />
//
//             {/* Details by mineral type */}
//             <div>
//                 <h3 className="text-md font-medium mb-3">Shipment Composition</h3>
//
//                 {shipmentStats.mineralGroups.map((group, index) => (
//                     <div key={group.type} className="mb-6">
//                         <div className="flex items-center mb-2">
//                             <h4 className="text-md font-medium capitalize">{group.type}</h4>
//                             <Badge variant="outline" className="ml-2">
//                                 {group.totalWeight.toFixed(2)} kg
//                             </Badge>
//                         </div>
//
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Lot #</TableHead>
//                                     <TableHead>Weight</TableHead>
//                                     <TableHead>Grade</TableHead>
//                                     {group.type === 'coltan' && (
//                                         <>
//                                             <TableHead>Ta</TableHead>
//                                             <TableHead>Nb</TableHead>
//                                             <TableHead>Fe</TableHead>
//                                         </>
//                                     )}
//                                     {group.type === 'cassiterite' && (
//                                         <TableHead>LME Price</TableHead>
//                                     )}
//                                     {group.type === 'wolframite' && (
//                                         <TableHead>MTU</TableHead>
//                                     )}
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {group.lots.map(lot => (
//                                     <TableRow key={lot._id}>
//                                         <TableCell>{lot.lotNumber}</TableCell>
//                                         <TableCell>{lot.shipmentQuantity.toFixed(2)} kg</TableCell>
//                                         <TableCell>{lot.mineralGrade || 'N/A'}</TableCell>
//                                         {group.type === 'coltan' && (
//                                             <>
//                                                 <TableCell>{lot.tantal ? `${lot.tantal}%` : 'N/A'}</TableCell>
//                                                 <TableCell>{lot.niobium ? `${lot.niobium}%` : 'N/A'}</TableCell>
//                                                 <TableCell>{lot.iron ? `${lot.iron}%` : 'N/A'}</TableCell>
//                                             </>
//                                         )}
//                                         {group.type === 'cassiterite' && (
//                                             <TableCell>${lot.londonMetalExchange || 'N/A'}</TableCell>
//                                         )}
//                                         {group.type === 'wolframite' && (
//                                             <TableCell>{lot.metricTonUnit || 'N/A'}</TableCell>
//                                         )}
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default ShipmentPreview;

// import React, { useMemo } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Separator } from '@/components/ui/separator';
// import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
//
// const ShipmentPreview = ({ selectedLots, quantityMap }) => {
//     // Calculate shipment statistics
//     const shipmentStats = useMemo(() => {
//         if (!selectedLots.length) return null;
//
//         let totalWeight = 0;
//         let weightedMineralGrade = 0;
//         let weightedMineralPrice = 0;
//         let weightedTantalum = 0;
//         let weightedNiobium = 0;
//         let weightedIron = 0;
//
//         // Group lots by mineral type for better reporting
//         const mineralGroups = {};
//
//         selectedLots.forEach(lot => {
//             const quantity = parseFloat(quantityMap[lot._id] || 0);
//             if (quantity <= 0) return;
//
//             totalWeight += quantity;
//
//             // Add to mineral type group
//             const mineralType = lot.entry.mineralType;
//             if (!mineralGroups[mineralType]) {
//                 mineralGroups[mineralType] = {
//                     type: mineralType,
//                     lots: [],
//                     totalWeight: 0
//                 };
//             }
//             mineralGroups[mineralType].lots.push({...lot, shipmentQuantity: quantity});
//             mineralGroups[mineralType].totalWeight += quantity;
//
//             // Calculate weighted averages if values exist
//             if (lot.mineralGrade) {
//                 weightedMineralGrade += lot.mineralGrade * quantity;
//             }
//
//             if (lot.mineralPrice) {
//                 weightedMineralPrice += lot.mineralPrice * quantity;
//             }
//
//             // Calculate specific minerals for coltan
//             if (lot.entry.mineralType === 'coltan') {
//                 if (lot.tantal) weightedTantalum += lot.tantal * quantity;
//                 if (lot.niobium) weightedNiobium += lot.niobium * quantity;
//                 if (lot.iron) weightedIron += lot.iron * quantity;
//             }
//         });
//
//         // Calculate final weighted averages
//         const averageMineralGrade = totalWeight > 0 ? weightedMineralGrade / totalWeight : 0;
//         const averageMineralPrice = totalWeight > 0 ? weightedMineralPrice / totalWeight : 0;
//         const averageTantalum = totalWeight > 0 ? weightedTantalum / totalWeight : 0;
//         const averageNiobium = totalWeight > 0 ? weightedNiobium / totalWeight : 0;
//         const averageIron = totalWeight > 0 ? weightedIron / totalWeight : 0;
//
//         return {
//             totalWeight,
//             averageMineralGrade,
//             averageMineralPrice,
//             averageTantalum,
//             averageNiobium,
//             averageIron,
//             mineralGroups: Object.values(mineralGroups)
//         };
//     }, [selectedLots, quantityMap]);
//
//     if (!shipmentStats || shipmentStats.totalWeight === 0) {
//         return (
//             <div className="text-center p-6 text-gray-500">
//                 No valid quantities selected for shipment.
//             </div>
//         );
//     }
//
//     return (
//         <div className="space-y-4">
//             {/* Summary Stats with smaller cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                 <Card className="shadow-sm">
//                     <CardContent className="p-3">
//                         <div className="text-xs text-gray-500">Total Weight</div>
//                         <div className="text-lg font-bold">{shipmentStats.totalWeight.toFixed(2)} kg</div>
//                     </CardContent>
//                 </Card>
//
//                 <Card className="shadow-sm">
//                     <CardContent className="p-3">
//                         <div className="text-xs text-gray-500">Avg. Mineral Grade</div>
//                         <div className="text-lg font-bold">
//                             {shipmentStats.averageMineralGrade ? shipmentStats.averageMineralGrade.toFixed(2) : 'N/A'}
//                         </div>
//                     </CardContent>
//                 </Card>
//
//                 <Card className="shadow-sm">
//                     <CardContent className="p-3">
//                         <div className="text-xs text-gray-500">Avg. Mineral Price</div>
//                         <div className="text-lg font-bold">
//                             {shipmentStats.averageMineralPrice ? `$${shipmentStats.averageMineralPrice.toFixed(2)}` : 'N/A'}
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//
//             {/* Coltan specific stats if any coltan is included */}
//             {shipmentStats.mineralGroups.some(group => group.type === 'coltan') && (
//                 <div>
//                     <h3 className="text-sm font-medium mb-2">Coltan Analysis</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                         <Card className="shadow-sm">
//                             <CardContent className="p-3">
//                                 <div className="text-xs text-gray-500">Avg. Tantalum</div>
//                                 <div className="text-lg font-bold">
//                                     {shipmentStats.averageTantalum ? `${shipmentStats.averageTantalum.toFixed(2)}%` : 'N/A'}
//                                 </div>
//                             </CardContent>
//                         </Card>
//
//                         <Card className="shadow-sm">
//                             <CardContent className="p-3">
//                                 <div className="text-xs text-gray-500">Avg. Niobium</div>
//                                 <div className="text-lg font-bold">
//                                     {shipmentStats.averageNiobium ? `${shipmentStats.averageNiobium.toFixed(2)}%` : 'N/A'}
//                                 </div>
//                             </CardContent>
//                         </Card>
//
//                         <Card className="shadow-sm">
//                             <CardContent className="p-3">
//                                 <div className="text-xs text-gray-500">Avg. Iron</div>
//                                 <div className="text-lg font-bold">
//                                     {shipmentStats.averageIron ? `${shipmentStats.averageIron.toFixed(2)}%` : 'N/A'}
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             )}
//
//             <Separator className="my-2" />
//
//             {/* Scrollable Details by mineral type */}
//             <div>
//                 <h3 className="text-sm font-medium mb-2">Shipment Composition</h3>
//
//                 <ScrollArea className="h-64 rounded-md border">
//                     <div className="p-4">
//                         {shipmentStats.mineralGroups.map((group) => (
//                             <div key={group.type} className="mb-6">
//                                 <div className="flex items-center mb-2">
//                                     <h4 className="text-sm font-medium capitalize">{group.type}</h4>
//                                     <Badge variant="outline" className="ml-2 text-xs">
//                                         {group.totalWeight.toFixed(2)} kg
//                                     </Badge>
//                                 </div>
//
//                                 <Table>
//                                     <TableHeader>
//                                         <TableRow>
//                                             <TableHead className="text-xs">Lot #</TableHead>
//                                             <TableHead className="text-xs">Weight</TableHead>
//                                             <TableHead className="text-xs">Grade</TableHead>
//                                             {group.type === 'coltan' && (
//                                                 <>
//                                                     <TableHead className="text-xs">Ta</TableHead>
//                                                     <TableHead className="text-xs">Nb</TableHead>
//                                                     <TableHead className="text-xs">Fe</TableHead>
//                                                 </>
//                                             )}
//                                             {group.type === 'cassiterite' && (
//                                                 <TableHead className="text-xs">LME Price</TableHead>
//                                             )}
//                                             {group.type === 'wolframite' && (
//                                                 <TableHead className="text-xs">MTU</TableHead>
//                                             )}
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody>
//                                         {group.lots.map(lot => (
//                                             <TableRow key={lot._id} className="text-sm">
//                                                 <TableCell>{lot.lotNumber}</TableCell>
//                                                 <TableCell>{lot.shipmentQuantity.toFixed(2)} kg</TableCell>
//                                                 <TableCell>{lot.mineralGrade || 'N/A'}</TableCell>
//                                                 {group.type === 'coltan' && (
//                                                     <>
//                                                         <TableCell>{lot.tantal ? `${lot.tantal}%` : 'N/A'}</TableCell>
//                                                         <TableCell>{lot.niobium ? `${lot.niobium}%` : 'N/A'}</TableCell>
//                                                         <TableCell>{lot.iron ? `${lot.iron}%` : 'N/A'}</TableCell>
//                                                     </>
//                                                 )}
//                                                 {group.type === 'cassiterite' && (
//                                                     <TableCell>${lot.londonMetalExchange || 'N/A'}</TableCell>
//                                                 )}
//                                                 {group.type === 'wolframite' && (
//                                                     <TableCell>{lot.metricTonUnit || 'N/A'}</TableCell>
//                                                 )}
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </div>
//                         ))}
//                     </div>
//                 </ScrollArea>
//             </div>
//         </div>
//     );
// };
//
// export default ShipmentPreview;


import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const ShipmentPreview = ({ selectedLots, quantityMap }) => {
    // Calculate shipment statistics
    const shipmentStats = useMemo(() => {
        if (!selectedLots.length) return null;

        let totalWeight = 0;
        let weightedMineralGrade = 0;
        let weightedMineralPrice = 0;
        let weightedTantalum = 0;
        let weightedNiobium = 0;
        let weightedIron = 0;

        selectedLots.forEach(lot => {
            const quantity = parseFloat(quantityMap[lot._id] || 0);
            if (quantity <= 0) return;

            totalWeight += quantity;

            // Calculate weighted averages if values exist
            if (lot.mineralGrade) {
                weightedMineralGrade += lot.mineralGrade * quantity;
            }

            if (lot.mineralPrice) {
                weightedMineralPrice += lot.mineralPrice * quantity;
            }

            // Calculate specific minerals for coltan
            if (lot.entry?.mineralType === 'coltan') {
                if (lot.tantal) weightedTantalum += lot.tantal * quantity;
                if (lot.niobium) weightedNiobium += lot.niobium * quantity;
                if (lot.iron) weightedIron += lot.iron * quantity;
            }
        });

        // Calculate final weighted averages
        const averageMineralGrade = totalWeight > 0 ? weightedMineralGrade / totalWeight : 0;
        const averageMineralPrice = totalWeight > 0 ? weightedMineralPrice / totalWeight : 0;
        const averageTantalum = totalWeight > 0 ? weightedTantalum / totalWeight : 0;
        const averageNiobium = totalWeight > 0 ? weightedNiobium / totalWeight : 0;
        const averageIron = totalWeight > 0 ? weightedIron / totalWeight : 0;

        return {
            totalWeight,
            averageMineralGrade,
            averageMineralPrice,
            averageTantalum,
            averageNiobium,
            averageIron,
            lotsWithQuantity: selectedLots.filter(lot => parseFloat(quantityMap[lot._id] || 0) > 0)
                .map(lot => ({
                    ...lot,
                    shipmentQuantity: parseFloat(quantityMap[lot._id] || 0)
                }))
        };
    }, [selectedLots, quantityMap]);

    if (!shipmentStats || shipmentStats.totalWeight === 0) {
        return (
            <div className="text-center p-6 text-gray-500">
                No valid quantities selected for shipment.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary Stats with smaller cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="shadow-sm">
                    <CardContent className="p-3">
                        <div className="text-xs text-gray-500">Total Weight</div>
                        <div className="text-lg font-bold">{shipmentStats.totalWeight.toFixed(2)} kg</div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-3">
                        <div className="text-xs text-gray-500">Avg. Mineral Grade</div>
                        <div className="text-lg font-bold">
                            {shipmentStats.averageMineralGrade ? shipmentStats.averageMineralGrade.toFixed(2) : 'N/A'}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-3">
                        <div className="text-xs text-gray-500">Avg. Mineral Price</div>
                        <div className="text-lg font-bold">
                            {shipmentStats.averageMineralPrice ? `$${shipmentStats.averageMineralPrice.toFixed(2)}` : 'N/A'}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Coltan specific stats if any coltan is included */}
            {shipmentStats.lotsWithQuantity.some(lot => lot.entry?.mineralType === 'coltan') && (
                <div>
                    <h3 className="text-sm font-medium mb-2">Coltan Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Card className="shadow-sm">
                            <CardContent className="p-3">
                                <div className="text-xs text-gray-500">Avg. Tantalum</div>
                                <div className="text-lg font-bold">
                                    {shipmentStats.averageTantalum ? `${shipmentStats.averageTantalum.toFixed(2)}%` : 'N/A'}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardContent className="p-3">
                                <div className="text-xs text-gray-500">Avg. Niobium</div>
                                <div className="text-lg font-bold">
                                    {shipmentStats.averageNiobium ? `${shipmentStats.averageNiobium.toFixed(2)}%` : 'N/A'}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardContent className="p-3">
                                <div className="text-xs text-gray-500">Avg. Iron</div>
                                <div className="text-lg font-bold">
                                    {shipmentStats.averageIron ? `${shipmentStats.averageIron.toFixed(2)}%` : 'N/A'}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            <Separator className="my-2" />

            {/* Flat list of all lots without grouping */}
            <div>
                <h3 className="text-sm font-medium mb-2">Shipment Details</h3>

                <ScrollArea className="h-64 rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs">Lot #</TableHead>
                                <TableHead className="text-xs">Mineral Type</TableHead>
                                <TableHead className="text-xs">Weight</TableHead>
                                <TableHead className="text-xs">Grade</TableHead>
                                <TableHead className="text-xs">Price</TableHead>
                                {/* Conditionally show coltan-specific columns if any coltan lots exist */}
                                {shipmentStats.lotsWithQuantity.some(lot => lot.entry?.mineralType === 'coltan') && (
                                    <>
                                        <TableHead className="text-xs">Ta</TableHead>
                                        <TableHead className="text-xs">Nb</TableHead>
                                        <TableHead className="text-xs">Fe</TableHead>
                                    </>
                                )}
                                {/* Conditionally show cassiterite-specific columns if any cassiterite lots exist */}
                                {shipmentStats.lotsWithQuantity.some(lot => lot.entry?.mineralType === 'cassiterite') && (
                                    <TableHead className="text-xs">LME Price</TableHead>
                                )}
                                {/* Conditionally show wolframite-specific columns if any wolframite lots exist */}
                                {shipmentStats.lotsWithQuantity.some(lot => lot.entry?.mineralType === 'wolframite') && (
                                    <TableHead className="text-xs">MTU</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shipmentStats.lotsWithQuantity.map(lot => (
                                <TableRow key={lot._id} className="text-sm">
                                    <TableCell>{lot.lotNumber}</TableCell>
                                    <TableCell>{lot.entry?.mineralType || 'N/A'}</TableCell>
                                    <TableCell>{lot.shipmentQuantity.toFixed(2)} kg</TableCell>
                                    <TableCell>{lot.mineralGrade || 'N/A'}</TableCell>
                                    <TableCell>{lot.mineralPrice ? `$${lot.mineralPrice}` : 'N/A'}</TableCell>

                                    {/* Conditionally render coltan-specific data */}
                                    {shipmentStats.lotsWithQuantity.some(l => l.entry?.mineralType === 'coltan') && (
                                        <>
                                            <TableCell>{lot.entry?.mineralType === 'coltan' && lot.tantal ? `${lot.tantal}%` : '-'}</TableCell>
                                            <TableCell>{lot.entry?.mineralType === 'coltan' && lot.niobium ? `${lot.niobium}%` : '-'}</TableCell>
                                            <TableCell>{lot.entry?.mineralType === 'coltan' && lot.iron ? `${lot.iron}%` : '-'}</TableCell>
                                        </>
                                    )}

                                    {/* Conditionally render cassiterite-specific data */}
                                    {shipmentStats.lotsWithQuantity.some(l => l.entry?.mineralType === 'cassiterite') && (
                                        <TableCell>{lot.entry?.mineralType === 'cassiterite' && lot.londonMetalExchange ? `$${lot.londonMetalExchange}` : '-'}</TableCell>
                                    )}

                                    {/* Conditionally render wolframite-specific data */}
                                    {shipmentStats.lotsWithQuantity.some(l => l.entry?.mineralType === 'wolframite') && (
                                        <TableCell>{lot.entry?.mineralType === 'wolframite' && lot.metricTonUnit ? lot.metricTonUnit : '-'}</TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
};

export default ShipmentPreview;