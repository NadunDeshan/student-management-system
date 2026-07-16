import {useEffect} from "react";

function DocumentTitle(title) {
    useEffect(()=>{
        document.title=`${title} | Student Management Sys`;
    },[title]);

}
export default DocumentTitle;