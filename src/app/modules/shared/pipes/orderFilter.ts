import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'orderSearch'
})
export class OrderSearchPipe implements PipeTransform {
    transform(items, orderID, field) {
        if (items && items.length) {
            return items.filter(item => {      
                if(orderID !== '' && orderID !== null && typeof orderID !== 'undefined'){
                    let orderIdVal = item.deliveries.deliveryNo.toLocaleString(undefined, { useGrouping: false, minimumIntegerDigits: 4 })
                    if(field == 'bill')
                        orderIdVal = item.orderNo.toLocaleString(undefined, { useGrouping: false, minimumIntegerDigits: 4 })

                    if(field == 'name')
                        orderIdVal = item.deliveryDetail.firstName+' '+item.deliveryDetail.lastName;

                    if(field == 'contact')
                        orderIdVal = item.deliveryDetail.phone;

                    if(field == 'paymentStatus'){
                        orderIdVal = item.status;
                    }

                    if(field == 'orderStatus'){
                        orderIdVal = item.deliveries.orderStatus;
                    }

                    if(field == 'orderDate' || field == 'deliveryDate'){
                        let dateField = (field == 'orderDate')?item.created_at:item.deliveries.deliveryDate;                
                        let searchDate = new Date(orderID).toLocaleDateString();
                        let itemDate = new Date(dateField).toLocaleDateString();                    
                        if(itemDate!=searchDate){
                            return false;
                        }                    
                    }else{ 
                        if (orderIdVal != null && orderIdVal.toLowerCase().indexOf(orderID.toLowerCase()) === -1) {
                            return false;
                        }
                    }
                }
                // if (companySearch && item.company.toLowerCase().indexOf(companySearch.toLowerCase()) === -1) {
                //     return false;
                // }
                // if (colorSearch && item.colorCode.toLowerCase().indexOf(colorSearch.toLowerCase()) === -1) {
                //     return false;
                // }

                return true;
            })
        }
        else {
            return items;
        }
    }
}