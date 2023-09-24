import React, {useState, useEffect}  from 'react';
import {SERVER_URL} from '../constants';


//  required properties -  assignmentId
//  

function GradeAssignment ( ) {
  
  const [grades, setGrades] = useState([]);
  let assignmentId=0;
  const [message, setMessage] = useState('');

  const path = window.location.pathname;  // /gradebook/123
  const s = /\d+$/.exec(path)[0];
  console.log("Grade assignmentId="+s);
  assignmentId=s;

  useEffect(() => {
    fetchGrades()
   }, [] )

 
  const fetchGrades = ( ) => {
      setMessage('');
      console.log("fetchGrades "+assignmentId);
      fetch(`${SERVER_URL}/gradebook/${assignmentId}`)
      .then((response) => response.json()) 
      .then((data) => { setGrades(data) })        
      .catch(err => { 
        setMessage("Exception. "+err);
        console.error("fetch grades error "+ err);
      });
    }
  
    // when submit button pressed, send updated grades to back end 
    //  and then fetch the new grades.
    const saveGrades = ( ) => {
      setMessage(''); 
      console.log("Gradebook.save ");     
      fetch(`${SERVER_URL}/gradebook/${assignmentId}` , 
          {  
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json', }, 
            body: JSON.stringify( grades )
          } )
      .then(res => {
          if (res.ok) {
            fetchGrades(assignmentId);
            setMessage("Grades saved.");
          } else {
            setMessage("Save error. "+res.status);
            console.error('Save grades error =' + res.status);
      }})
        .catch(err => {
            setMessage("Exception. "+err);
            console.error('Save grades exception =' + err);
        });
   };        
    

    const onChangeInput = (e, row_id) => {
      setMessage('');
      console.log("onChangeInput "+row_id);
      // grade value must be digts only. 
      if ( /^\d*$/.test(e.target.value) ) {
        const editData = grades.map((row, idx) =>
          row_id === idx ? { ...row, grade: e.target.value } : row
        );
        setGrades( editData);
      } else {
        setMessage("Grades are digits only!");
      }
    }
 
    const headers = ['Name', 'Email', 'Grade'];

    return (
      <div>
        <h3>Assignment Grades</h3>
        <div margin="auto" >
          <h4 id="gmessage" >{message}&nbsp;</h4>
          <table className="Center"> 
            <thead>
              <tr>
                {headers.map((title, idx) => (<th key={idx}>{title}</th>))}
              </tr>
            </thead>
            <tbody>
              {grades.map((row,idx) => (
                <tr key={idx}>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>
                  <input
                      name="grade"
                      value={(row.grade)? row.grade : ""}  
                      type="text"
                      onChange={(e) => onChangeInput(e, idx)}
                  />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button id="sgrade" type="button" margin="auto" onClick={saveGrades}>Save Grades</button>
        </div>
      </div>
    )
}

export default GradeAssignment;