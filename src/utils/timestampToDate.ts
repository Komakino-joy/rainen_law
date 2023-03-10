export default function timestampToDate(timestamp: string)
{
 const date = new Date(timestamp)
 const yyyy = date.getFullYear(); 
 let mm:string|number  = date.getMonth()+1;
 let dd:string|number = date.getDate(); 
 if(dd<10){dd='0'+dd} 
 if(mm<10){mm='0'+mm};
 return yyyy + '-' + mm + '-' + dd
}