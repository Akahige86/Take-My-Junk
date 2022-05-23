import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './context';
import MenuPanel from './menu';
import Auction from './auction';

const urlFiltered = `http://localhost:8081/getAuctionByFilers/`;
const urlBid = `http://localhost:8081/getAuctionsWithMyBids/`;

const Professional = () => {
    const [auctions, setAuctions] = useState([]);
    const [auctionsWithBid, setAuctionsWithBid] = useState([]);
    const [clicked, setClicked] = useState(`w3-hide`);
    const [context, setContext] = useContext(UserContext);
    const [bidRefresh, setBidRefresh] = useState(false);

    const refreshBid = () => {
        bidRefresh === false ?  setBidRefresh(true) :  setBidRefresh(false);
    }

    const fetching = async () => {
        //url build
        const myUrlFiltered = urlFiltered + context.user.id;

        //fetch build
        const header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        const body = {
            junkType: null,
            distanceMax:  10000, // Number.POSITIVE_INFINITY,
            startDate: null,
            endDate: null,
            auctionStarted: null,
            volumeMin: -1, // Number.NEGATIVE_INFINITY,
            volumeMax: 10000, // Number.POSITIVE_INFINITY,
            lowestBid: 10000 // Number.POSITIVE_INFINITY,
        }

        //fetch
        const response = await fetch(myUrlFiltered, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(body),
        });
        // console.log(response);

        if(response.ok) {
            const responseJson = await response.json();
            // console.log(responseJson);
            setAuctions(responseJson)
        } else {
            console.log(`Problem with request Filtered Auctions ${response.status}`);
        }
    }
    
    useEffect(() => {
        
        fetching();
        //after fetch

    },[bidRefresh]);

    //Auctions with BID
    useEffect(() => {
        //url build
        const myUrlAuctionsWithBids = urlBid + context.user.id;

        //fetch build
        const header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        //fetch
        const fetching = async () => {
            const response = await fetch(myUrlAuctionsWithBids, {
                method: 'GET',
                headers: header,
            });
            if(response.ok) {
                const responseJson = await response.json();
                setAuctionsWithBid(responseJson)
            } else {
                console.log(`Problem with request Auctions With Bids ${response.status}`);
            }
        }
        fetching();

    }, [bidRefresh] );

    const displayHandler = () => {
        clicked === `w3-hide` ? setClicked(`w3-show`) : setClicked(`w3-hide`);
    }

    const displayAuctions = () => {
        if(auctions < 1) {
            return <div>No Auction avaliable</div>
        } else
        return (
        auctions.map((auction, index) => <Auction key={index} body={auction} index={index} refreshBid={refreshBid} />)
        );
    }

    const displayAuctionsWithMyBids = () => {
        if(auctions < 1) {
            return <div>No Auctions with your Bid on it :-(</div>
        } else
        return (
            auctionsWithBid.map((auction, index) => <Auction key={index} body={auction} index={index} refreshBid={refreshBid} />)
        );
    }

    const showFilters = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <div className='w3-panel w3-border'> 
                <div className='w3-left w3-border'>Professional Menu:</div> 
                <div className='w3-right w3-border'><MenuPanel /> </div>
            </div> <br />
            <div>
                <div>My bids</div>
                <div className={``}> {displayAuctionsWithMyBids()} </div>
            </div> <br />
            <div>
                <div onClick = {() => displayHandler()}>Auctions</div> <br />
                <div className={`${clicked}`}> 
                    <div><button onClick={(e) => showFilters(e)}>Filter Auctions</button></div>
                    {displayAuctions()} 
                </div>
            </div>

        </div>
    );
}

export default Professional;