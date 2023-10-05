import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../constants';
import {Link} from 'react-router-dom';
import { useHistory } from 'react-router-dom';


function ListAssignment(props) {

  const history = useHistory();

  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');
  const [force, setForce] = useState(false);

  useEffect(() => {
   // called once after intial render
   fetchAssignments();
  }, [] )
 
  const fetchAssignments = () => {
    setMessage('')
    console.log("fetchAssignments");
    fetch(`${SERVER_URL}/assignment`)
    .then((response) => response.json() ) 
    .then((data) => { 
      console.log("assignment length "+data.length);
      setAssignments(data);
     }) 
    .catch(err => console.error(err)); 
  }

  const deleteAssignment = (id) => {
    //setMessage('');
    if(force == true){
      fetch(`${SERVER_URL}/assignment/delete/${id}?force=yes` , 
      {  
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json', }, 
      } )
      .then(res => {
        if (res.ok) {
          setMessage("Assignment deleted. Refresh the page to update list");
        } else {
          setMessage("Delete error. "+res.status);
          console.error('Delete assignment error =' + res.status);
      }})
      .catch(err => {
        setMessage("Exception. "+err);
        console.error('Delete assignment exception =' + err);
      });
    }
    else{
      fetch(`${SERVER_URL}/assignment/delete/${id}` , 
      {  
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json', }, 
      } )
      .then(res => {
        if (res.ok) {
          setMessage("Assignment deleted. Refresh the page to update list");
        } else {
          setMessage("Delete error, assignment has grades attached to it | Error code. "+res.status);
          console.error('Delete assignment error =' + res.status);
      }})
      .catch(err => {
        setMessage("Exception. "+err);
        console.error('Delete assignment exception =' + err);
      });
    }
  }

  const handleCheckboxChange = () =>{
    if(force == false){
      setForce(true);
    }
    else if(force == true){
      setForce(false);
    }
  }
  
  
  const headers = ['Assignment Name', 'Course Title', 'Due Date', ' ', ' ', ' '];
    
    return (
      <div>
        <h3>Assignments</h3>
        <div margin="auto" >
          <h4>{message}&nbsp;</h4>
              <table className="Center"> 
                <thead>
                  <tr>
                    {headers.map((title, idx) => (<th key={idx}>{title}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.assignmentName}</td>
                      <td>{row.courseTitle}</td>
                      <td>{row.dueDate}</td>
                      <td>
                      	<Link to={`/assignment/edit/${assignments[idx].id}`} >Edit</Link>
                      </td>
                      <td>
                        <Link to={`/gradeAssignment/${assignments[idx].id}`} >Grade</Link>
                      </td>
                      <td>
                        <button id="delete" type="button" margin="auto" onClick={() => deleteAssignment(assignments[idx].id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <label class="Center">
                <br></br>
                Force Delete Checkbox:
                <br></br>
                <input
                  type="checkbox"
                  checked={force}
                  onChange={handleCheckboxChange}
                />
              </label>
              <br></br>
              <br></br>
              <Link class="Center" to={`/assignment/create`} >Create</Link>
          </div>
      </div>
    )
}  

export default ListAssignment;