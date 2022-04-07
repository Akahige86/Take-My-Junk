/*
- info about changed details -> succes or NOT?!
*/
import React, {useState, useContext} from 'react';
import { UserContext } from './context';
import Menu from './menu';

const url = `http://localhost:8081/`;

const Settings = () => {
    const [context, setContext] = useContext(UserContext);
    const [user, setUser] = useState(context.user)
    delete user.id;

    const details = (key) => {
        return (
            <div key={key} className=''>
                <label>{key}:</label> 
                <input 
                    name={key} 
                    value={user[key]}
                    type='text'
                    onChange={event => setUser( 
                        {
                            ...user,
                            [key]: event.target.value
                        }
                    )}
                />
            </div>
        )
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        //url builder
        let myUrl = url + [`licenseNo` in user ? `professionalChange/` : `consumerChange/`];
        myUrl += `${user.email}/${user.password}`;
        
        //fetch builder
        const header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        const data = {
            ...user
        };

        //fetch
        const response = await fetch(myUrl, {
            method: 'PUT',
            headers: header,
            body: JSON.stringify(data)
        });
        const responseJson = await response.json();
        console.log(responseJson);

        //info about changed details -> succes or NOT?!
    }

    return (
        <div>
            <div className='w3-panel'> 
                <div className='w3-left'>I am Settings!</div> 
                <div className='w3-right'><Menu /></div> 
            </div>
            <form onSubmit={(event) => submitHandler(event)}>
                {Object.keys(user).map(details)}
                <input type='submit' value='Submit changes' />
            </form>
        </div>
    )
}

export default Settings;