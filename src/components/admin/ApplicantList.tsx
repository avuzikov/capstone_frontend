import React from "react";

const ApplicantList = () => {

  


  function handleListClick(): void {
    throw new Error("Function not implemented.");
  }

  return(

    <div className="boxed">
    <h4>Customer List</h4>
        <table id="applicants-list">
            <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Pass</th>
            </tr>
            </thead>
            <tbody>
{/* 
                return (<tr key='id'
                className='Applicant Row'
                onClick={()=>handleListClick()} 
                >
                    <td>{item.fullName}</td>
                    <td>{item.email}</td>
                    <td>{item.address}</td>
                    <td>{item.phone}</td>
                    <td>{item.resume}</td>
                    <td>{item.department}</td>
                </tr>);

            ) */}
            </tbody>
        </table>
    </div>


);

};

export default ApplicantList;
