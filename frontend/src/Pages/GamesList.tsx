import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import API_BASE_URL from '../config/Config';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

interface Game {
    _id: number;
    gameName: string;
    gameType: string;
    gamePhoto: string;
}


function GamesList() {

    const [games, setGames] = useState<Game[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [gamesPerPage] = useState(5);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/gameList`);
                const res = await response.json();
                setGames(res.data);
                console.log(res.data);
                
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };
        fetchGames();
    }, []);

    // Get current games
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleDelete = async (id: number) => {
        const customId = "custom-id-yes";

        const confirmToastId = toast.info(
            <div>
                <p>Are you sure you want to delete this Entry?</p>
                <Button 
                style={{backgroundColor:'#4fc9d1',color:'black'}} 
                variant="contained"
                color="inherit"
                onClick={() => handleDeleteConfirmed(id)}
                startIcon={<DoneIcon/>}
                >Yes</Button>
                <Button
                style={{left:'40px',backgroundColor:'#4fc9d1',color:'black'}} 
                variant="contained"
                color="inherit"
                onClick={() => toast.dismiss(confirmToastId)}
                startIcon={<CloseIcon/>}
                >No</Button>
            </div>,
            {
                toastId:customId,
                position: 'top-center',
                theme:"dark",
                autoClose: false, // Disable auto-close
                closeOnClick: true, // Disable close on click outside
            }
        );
        const handleDeleteConfirmed = async (id: number) => {
            try {
                await axios.delete(`${API_BASE_URL}/api/admin/deletegame/${id}`);
                // Remove the deleted game from the state
                setGames(games.filter(game => game._id !== id));
                toast.success('Game deleted successfully');
            } catch (error) {
                console.error("Error deleting game:", error);
                toast.error('Failed to delete game. Please try again.');
            }
        };
    }

    return (
        <>
            <Header />
            <div className='d-flex justify-content-center p-1' style={{ color: 'black', backgroundColor: '#4fc9d1' }}>
                <h1>Games List</h1>
            </div>
            <div className="container" >

                <br />

                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Game Name</th>
                            <th>Game Type</th>
                            <th>Game Photo</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentGames.map((game, index) => (
                            <tr key={game._id}>
                                <td>{(currentPage - 1) * gamesPerPage + index + 1}</td>
                                <td>{game.gameName}</td>
                                <td>{game.gameType}</td>
                                <td>
                                    {game.gamePhoto?(
                                        <img src={`${API_BASE_URL}/photos/${game.gamePhoto}`}
                                            alt={game.gameName}
                                            style={{ display: 'block', margin: 'auto', maxWidth: '100px', maxHeight: '90px', borderRadius: '55px' }}
                                        />
                                    ) : (
                                        <span>No Photo Available</span>
                                    )}
                                </td>
                                <td>
                                    <Link to={`/edit/${game._id}`} className="btn btn-custom btn-md me-1 m-2" style={{ color: 'black', backgroundColor: '#4fc9d1' }}>
                                        Edit
                                    </Link>
                                    <button className="btn btn-danger btn-md" onClick={() => handleDelete(game._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ul className="pagination justify-content-end">
                    {Array.from({ length: Math.ceil(games.length / gamesPerPage) }).map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <br />
                            <button onClick={() => paginate(index + 1)} className="page-link" style={{ backgroundColor: '#4fc9d1', }}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default GamesList;
