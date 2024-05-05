import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseURL, BEARERKEY } from './../../App';


function UserControl({ currentUser, setCurrentUser }) {
    const [users, setUsers] = useState(null)
    const [currentDelete, setCurrentDelete] = useState(null)
    const [loading, setLoading] = useState(true)

    async function getUsers() {
        setLoading(true)
        const config = {
            headers: {
                authorization: BEARERKEY + localStorage.getItem("token"),
            }
        };
        const result = await axios
            .get(`${baseURL}/users/all`, config)
            .catch((err) => {
                setUsers(null);
                setLoading(false);
                console.log(err);
            });
        if (result.data?.message === 'done') {
            setUsers(result?.data?.users)
            setLoading(false)
        }
    }
    async function deleteUser() {
        const config = {
            headers: {
                authorization: BEARERKEY + localStorage.getItem("token"),
            }
        };
        const result = await axios
            .delete(`${baseURL}/users/${currentDelete._id}/delete`, config)
            .catch((err) => {
                console.log(err);
                alert("Something went wrong")
            });
        if (result.data?.message === 'done') {
            getUsers()
        }
    }
    async function removeAdmin(user) {
        const config = {
            headers: {
                authorization: BEARERKEY + localStorage.getItem("token"),
            }
        };
        const result = await axios
            .put(`${baseURL}/users/${user._id}/removeadmin`, { role: 'user' }, config)
            .catch((err) => {
                console.log(err);
                alert("Something went wrong")
            });
        if (result.data?.message === 'done') {
            getUsers()
        }
    }
    async function makeAdmin(user) {
        const config = {
            headers: {
                authorization: BEARERKEY + localStorage.getItem("token"),
            }
        };
        const result = await axios
            .put(`${baseURL}/users/${user._id}/makeadmin`, { role: 'admin' }, config)
            .catch((err) => {
                console.log(err);
                alert("Something went wrong")
            });
        if (result.data?.message === 'done') {
            getUsers()
        }
    }

    useEffect(() => {
        getUsers()
    }, [])


    return <>
        <Link to='/cp' className='back h4 mb-2 d-inline-flex text-warning'>← Control Panel</Link>

        <table className="table table-striped table-hover table-bordered ">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th colSpan={currentUser.role === 'superadmin' ? '2' : '1'}>Admin Panel</th>
                </tr>
            </thead>
            <tbody>
                {users?.map((user) => {
                    if (currentUser._id === user._id) {
                        return <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.age}</td>

                            <td>
                                {user.role == 'admin' || user.role == 'superadmin' ? <p className='text-success p-0 m-0 h5'>You</p> : ''
                                }
                            </td>
                        </tr>
                    } else {
                        return <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.age}</td>

                            <td>
                                {user.role === 'admin' || user.role === 'superadmin' ?
                                    user.role === 'superadmin' ?
                                        <p className="text-success p-0 m-0 h5">Adminstrator</p>
                                        : <>
                                            {currentUser.role === 'superadmin' ? <button onClick={() => removeAdmin(user)} className="btn btn-danger ">Remove Admin</button> : 'admin'}
                                        </>
                                    :
                                    <button onClick={() => makeAdmin(user)} className="btn btn-success me-1 ">Make Admin</button>
                                }
                            </td>
                            {currentUser.role === 'superadmin' ?
                                <td><button data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setCurrentDelete(user)} className='btn btn-danger'>Delete User</button></td> : ''}
                        </tr>
                    }
                })}

            </tbody>
        </table>

        <div className="modals">
            <div className="modal fade" id="doneModal" tabIndex="-1" aria-labelledby="doneModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-dark " id="doneModalLabel">Done</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="wrapper" >
                                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /> <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                </svg>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success " data-bs-dismiss="modal">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-dark " id="deleteModalLabel">Delete</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p className="lead text-dark">Are you Sure?</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={deleteUser} data-bs-toggle="modal" data-bs-target="#doneModal" type="button" data-bs-dismiss="modal" className="btn btn-danger" >Delete</button>
                            <button type="button" className="btn btn-info" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </>
}

export default UserControl