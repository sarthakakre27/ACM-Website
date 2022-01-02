import React,{ useEffect,useState }  from 'react'

import {useLocation} from 'react-router-dom'

function ProblemDetails() {

    let location = useLocation();

    const [details,setDetails] = useState({})

    useEffect(()=>{
        fetch(`http://127.0.0.1:8000/api/problems/problem-details/${location.id}`)
        .then((response)=>response.json())
        .then((data)=>{
            setDetails(data)
            console.log(data)
        })
        .catch((err)=>console.log(err))
    },[location])

    return (
        <div>
            <p>{details[0]?.name}</p>
        </div>
    )
}

export default ProblemDetails
