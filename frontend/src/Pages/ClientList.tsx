import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import API_BASE_URL from '../config/Config';

interface People {
    _id: number;
    username: string;
    email: string;
    countryCode:string;
    phoneNumber:string;
}


function ClientList() {

    const [clients, setClients] = useState<People[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientPerPage] = useState(10);

   
        const fetchClientList = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/user/profileList`);
                const data = await response.json();
                setClients(data?.data);
                
            } catch (error) {
                console.error('Error fetching clients list:', error);
            }
        };
        useEffect(() => {
        fetchClientList();
    }, []);

    // Get current games
    const indexOfLastClient = currentPage * clientPerPage;
    const indexOfFirstClient = indexOfLastClient - clientPerPage;
    const currentClient = clients?.length > 0 &&  clients?.slice(indexOfFirstClient, indexOfLastClient);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleDelete = async (id:number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this client?")
        if (confirmDelete){
            try {
                
                await axios.delete(`${API_BASE_URL}/api/user/deleteUser/${id}`)
                
                //remove the deleted game from the state
                fetchClientList()
            } catch (error) {
                console.error("Error deleteing game:",error);
            }
        }    
    }

    return (
        <>
            <Header/>
            <div className='d-flex justify-content-center p-1' style={{color:'black',backgroundColor:'#4fc9d1'}}>
                <h1>Client's List</h1>
            </div>
        <div className="container position-static">
            <br />
            <table className="table table-striped table-bordered"style={{maxHeight:'300px'}}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th> Username</th>
                        <th> Email</th>
                        <th>CountryCode</th>
                        <th> Mobile</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {currentClient && currentClient?.length > 0 && currentClient?.map((user ,index) => (
                        <tr key={user?._id}>
                            <td>{(currentPage - 1) * clientPerPage + index + 1}</td>
                            <td>{user?.username}</td>
                            <td>{user?.email}</td>
                            <td>{user?.countryCode}</td>
                            <td>{user?.phoneNumber}</td>
                            
                            <td>
                                {/* <Link to={`#`}className="btn btn-custom btn-md me-1 m-2" style={{color:'black', backgroundColor:'#4fc9d1'}}>
                                    Edit
                                </Link> */}
                                <button className="btn btn-danger btn-md"
                                onClick={() => handleDelete(user?._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ul className="pagination  justify-content-end">
                {Array.from({ length: Math.ceil(clients?.length / clientPerPage) }).map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <br/>
                        <button onClick={() => paginate(index + 1)} className="page-link" style={{backgroundColor:'#4fc9d1',}}>
                            {index + 1}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
}

export default ClientList;
