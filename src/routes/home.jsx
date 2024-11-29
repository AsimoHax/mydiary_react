import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {
    faHome,
    faArrowLeft,
    faArrowRight,
    faUsers,
    faCaretRight,
    faCaretDown,
    faEllipsisV,
    faSpinner,
    faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import axios from "../axios.jsx";

export default function Home() {
    const [expand, setExpand] = useState(false);
    const [mess, setMess] = useState([]);
    const [data, setData] = useState({});
    const [filter, setFilter]=useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [uid, setUid] = useState(0);
    const autoExpand=false;
    const [collections,setCollections] = useState([]);
    if (!localStorage.getItem('accessToken')) {
        window.location.href='/login';
    }

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://localhost:3000/protected',
                    {params :{target:'home'}});
                setData(response.data);
                setUid(response.data.data.uid);
                setLoading(false);
                const collectionsWithExpand = response.data.data.collections.map((collection) => ({
                    ...collection, // spread existing collection fields
                    expand: autoExpand  // add 'expand' field to each collection
                }));
                setCollections(collectionsWithExpand);
                setMess(response.data.data.mess);

            } catch(error){
                console.log(error);
            }
        };
        fetchData();
    }, [])

    return (<>
            <Navbar mess={mess} loading={loading} dataArray={data} expand={expand} setFilter={setFilter} />
            <Accordion expand={expand} setExpand={setExpand} />
            <GridShow collections={collections} filter={filter} mess={mess} expand={expand} loading={loading}
                      setCollections={setCollections} data={data} uid={uid} />

        </>

    );
}

function Accordion({expand, setExpand}) {
    const hide = 5;
    const show = 20;
    return (
        <div
            className={"absolute left-0 top-0 h-screen bg-gray-400 z-20 flex flex-col justify-start items-start pt-3 md:pl-2"}
        style={{width:`${expand?show:hide}vw`}}>

            <button className={""} onClick={()=>setExpand(!expand)} >
                <FontAwesomeIcon icon={expand?faArrowLeft:faArrowRight}/>{expand ? 'Collapse' : ''}</button>
            <button> <FontAwesomeIcon icon={faHome}/> {expand?'All items':' '}</button>
            <button><FontAwesomeIcon icon={faUsers}/>{expand?'Shared':' '}</button>
            <button>Uncategorized</button>
            <button>Favorites</button>

        </div>
    )
}

function GridShow({collections,filter, expand, setCollections, loading, mess, data, uid}) {
    const [open, setOpen] = useState(false);
    const [isEntry, setIsEntry] = useState(true);
    const [collectionID, setCollectionID] = useState(-1);
    const [isSet, setIsSet] = useState(true);
    const [creating, setCreating] = useState(false);
    const [name, setName] = useState("");
    const [cMenu, setCMenu] = useState(false);

    const btnRef=useRef(null);
    const menuRef=useRef(null);
    function handleClose(event){
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClose);
        return () => {
            document.removeEventListener('mousedown', handleClose);
        };
    }, []);

    if (collections[0]&&collectionID<0 )
        {setCollectionID(collections[0].cid)};

    const create = async () => {
        setCreating(true);
        if (!data.data.name || name.length === 0){

            return;}

        try {
            await axios.get('http://localhost:3000/protected',
                {params :{target:'createEntry', cid:collectionID, uid:uid, username:data.data.name, name: name, categorized:collectionID<0?false:isSet, isEntry:isEntry},});
            setOpen(false);
            window.location.href='/home';
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message);
            }
        } finally {
            setCreating(false);
        }
    };


    function handleChange(bool){
        setIsEntry(bool);
    }

    function handleCollection(cid){
        setCollectionID(cid);
    }

    function handleSet(){
        setIsSet(!isSet);
    }

    function deleteC(){
        console.log('delete');
        return 2;
    }
    function rename(){
        console.log('Rename');
        return 2;
    }
    function info(){
        console.log('info');
        return 2;
    }

    function Add(){
        setOpen(true);
        console.log("W");


    }

    if (loading){
        return (<div className={"flex justify-center items-center"}><FontAwesomeIcon icon={faSpinner} spin/></div>);
    }

    return (<>
            {collections.length===1 && mess.length===0&&(<div className={"absolute h-[92vh] w-screen bg-gray-300 flex justify-center items-center z-10"}>
        You haven't created any entries yet. Start by adding your first one!
        </div>)}
        <div
            className={`bg-gray-300 h-[92vh] z-10 ml-[5vw] p-4 transition-all duration-300 overflow-y-auto`}
            style={{marginLeft: `${expand ? 20 : 5}vw`}}
        >

            {loading ? 'Loading' : collections.length === 0 ? 'Empty' : collections.map((c) => (
                <Category key={c.cid} collection={c}
                          setCollections={setCollections} mess={mess}>

                </Category>
            ))}
            <button
                className={"w-30 h-[60px] hover:bg-gray-400 absolute right-0 bottom-0 z-50 mb-[10vw] md:mb-[5vw] m-[5vw] border-black rounded-3xl flex items-center justify-between text-2xl pl-[40px] pr-[40px]"}
                disabled={creating}
                onClick={Add}>
                <FontAwesomeIcon icon={faPlus}/>Add
            </button>

            {open&&<div onClick={handleClose}
                className={"w-screen h-screen absolute bg-transparent left-0 top-0 z-50 backdrop-blur"}>
                <div ref={menuRef}
                    className={"shadow-black absolute w-[400px] rounded shadow border border-black h-auto bg-gray-200 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}>
                    <div>

                        <div className={"flex justify-start m-[1vw]"}>
                            <div className={""}>
                                <label>Add a new: </label>
                                <input className={"ml-[2vw] mr-2"} type={"radio"} name={"add"} checked={isEntry}
                                onChange={()=>handleChange(true)}/>
                                <label>Entry</label>
                            </div>
                            <div className={"pl-[2vw]"}>
                                <input type={"radio"} className={"mr-2"} name={"add"} checked={!isEntry}
                                onChange={()=>handleChange(false)}/>
                                <label>Collection</label>
                            </div>
                        </div>
                        {isEntry&&(
                            <div className={" m-[1vw]"}>Select category:
                                {collections[1]?
                                    <>
                                    <select className={"mr-2 ml-1 w-40 text-left"}
                                            disabled={!isSet}
                                                        value={collectionID}
                                                        onChange={(e)=>handleCollection(parseInt(e.target.value))}>
                                        {collections.filter((c) => c.cname !== 'Uncategorized')
                                            .map((c) => (<option value={c.cid}>{c.cname}</option>))}
                                    </select><br/>
                                        <label>
                                    <input type={"checkbox"} className={"mr-1"} checked={!isSet} onChange={handleSet}/>
                                            Set category later
                                    </label>
                                    </>
                                    :
                                    <>
                                    <select disabled={true} value={1}><option>You haven't created any category.</option></select>
                                       <br/>
                                        <input type={"checkbox"} className={"mr-1"} disabled checked/>
                                        Set category later
                                    </>}
                            </div>

                        )}
                        <div className={"border border-t-black mt-[20px]"}>
                        </div>
                        <div className={"m-[1vw]"}>
                            <label>
                                Name: <input type={"text"} onChange={(e)=>setName(e.target.value)} maxLength={15} className={"pl-2"}></input>
                            </label>
                            <label></label>
                        </div>
                        <div className={" bottom-0 w-full"}>
                            <div className={"flex justify-between bottom-0 h-[40px] rounded border-black border-r-black border"}>
                                <button className={"w-1/2 border-r-black rounded-none"} onClick={()=>setOpen(false)}>Cancel</button>
                                <button className={"w-1/2 rounded-none"} onClick={create}>{creating?"Creating":"Create"}</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>}


        </div></>
    );
}

function Category({collection, setCollections, mess}) {
    const entries = mess.filter(i => i.cid === collection.cid);
    const [cMenu, setCMenu] = useState(false);
    useEffect(()=>{
        const handleClickOutside = (e) => {
            if (btnRef.current && !btnRef.current.contains(e.target)) {
                setCMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>{
            document.removeEventListener("mousedown", handleClickOutside);
        };
    },[]);
    const btnRef=useRef(null);
    function handleMenu(e){
        e.stopPropagation();
        setCMenu(!cMenu);
    }
    function rename(){
        console.log(`Rename${collection.cname}`);
    };
    function deleteC(){
        console.log(`Delete${collection}`);
    };
    function info(){
        console.log(`Info${collection}`);
    };
    function setExpand() {
        setCollections(prevCollections =>
            prevCollections.map((c) =>
                c.cid === collection.cid ? {...c, expand: !collection.expand} : c
            )
        );
    }
    return(<>

        <div className="border-t-black mt-5 border border-b-transparent border-l-transparent border-r-transparent flex relative justify-left items-center p-4 cursor-pointer" onClick={() => setExpand()}>
            <h1 className="text-lg font-bold">{collection.cname}</h1> {/* Category Title */}
            <button className={"ml-2 border border-opacity-20 border-black w-7"}><FontAwesomeIcon icon={collection.expand?faCaretDown:faCaretRight}/></button>
            <button className={"ml-2 border relative border-opacity-20 border-black w-7"} onClick={(e)=>handleMenu(e)}><FontAwesomeIcon icon={faEllipsisV}/>
                {cMenu && (
                    <div ref={btnRef} className={"absolute left-7 -mt-7 z-10 w-20 bg-white border-black border"}>
                        <ul>
                            <li className={"px-4 py-2 hover:bg-gray-200 cursor-pointer"} onClick={rename}>
                                Rename
                            </li>
                            <li className={"px-4 py-2 hover:bg-gray-200 cursor-pointer"} onClick={deleteC}>
                                Delete
                            </li>
                            <li className={"px-4 py-2 hover:bg-gray-200 cursor-pointer"} onClick={info}>
                                Info
                            </li>
                        </ul>
                    </div>
                )}</button>

        </div>

        {collection.expand && (
            <div className="flex flex-wrap gap-4 ">
                {entries.map((entry) => (
                    <Page entry={entry} key={entry.eid} />
                ))}

            </div>

        )}</>
    );

}

function Page({entry}){
    const [isOpen, setIsOpen] = useState(false);
    const btnRef = useRef(null);
    const toggleMenu = (e) =>{
        e.stopPropagation();
        setIsOpen(!isOpen);
    }
    const navigate = useNavigate();

    useEffect(()=>{
        const handleClickOutside = (e) => {
            if (btnRef.current && !btnRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>{
            document.removeEventListener("mousedown", handleClickOutside);
        };
    },[]);

    const toPage= ()=>{

        navigate(`/view/${entry.eid}`);
    };
    const timeAgo = (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) {
            return 'Just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else if (diffInDays < 30) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();  // For dates older than a month, show the actual date
        }
    }

    return (
        <div
            className="bg-white p-6 rounded-lg shadow-md md:w-[260px] w-[200] relative hover:bg-gray-200" onClick={toPage}
        >
            {/* Card Header */}
            <h2 className="text-xl font-semibold">{entry.name}</h2>

            {/* Card Body */}
            <div className={"relative flex justify-between items-baseline "}>
                <p className="text-sm mt-2 text-gray-500">Last edited: {timeAgo(new Date(entry.lastedited))}</p>
                <button ref={btnRef} className={"p-2 mb-1 rounded-lg"} onClick={toggleMenu}><FontAwesomeIcon icon={faEllipsisV}/></button>
                {isOpen && (
                    <div ref={btnRef} className={"absolute left-full w-20 bg-white"}>
                        <ul>
                            <button className={"px-4 py-2 hover:bg-gray-200 cursor-pointer"} onClick={toPage}>
                                Open
                            </button>
                            <li className={"px-4 py-2 hover:bg-gray-200 cursor-pointer"}>
                                Delete
                            </li>
                            <li className={"px-4 py-2 hover:bg-gray-200 cursor-pointer"}>
                                Info
                            </li>
                        </ul>
                    </div>
                )}
            </div>

        </div>
    );
}

function Navbar({dataArray, expand, loading, mess}){
    const data=dataArray.data;
    const searchRef=useRef(null);
    const [filter, setFilter]=useState(false);
    const [filtered, setFiltered]=useState(mess);
    function handleUser(){
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accessToken");
        window.location.href='/login';
    }
    function handleSearch(val){
        if (val.length>0){
            setFilter(true);
        } else {
            setFilter(false);
        }
        setFiltered(mess.filter(collection => {
            // Check if the collection name matches the query
            const isCollectionMatch = collection.name.toLowerCase().includes(val);

            // If the collection name or any entry matches, keep the collection
            return isCollectionMatch;
        }))
        console.log(filtered);
    }

    function handleSearchRef(event){
        if (searchRef.current && !searchRef.current.contains(event.target) && !event.target.id==="ignore") {
            setFilter(false);
        }
        if (searchRef.current && searchRef.current.contains(event.target)) {
            setFilter(true);
        }

    };
    useEffect(() => {
        document.addEventListener('mousedown', handleSearchRef);
        return () => {
            document.removeEventListener('mousedown', handleSearchRef);
        };
    }, []);

    return(
        <>
        <nav className=" navbar navbar-expand-lg navbar-dark bg-dark bg-amber-300 z-0 h-[8vh] w-screen flex">
            <div className="container flex items-center justify-end pl-[10vw]">
                <div className="w-20"></div>
                <label className={"relative"} onClick={handleSearchRef}>
                <input className={"h-[30px] z-20 pl-3 mr-[20vw] bg-gray-100 relative"} placeholder={"Search"}
                style={{width:`${expand?35:50}vw`}} ref={searchRef}
                onChange={(e)=>handleSearch(e.target.value)}/>
                    {filtered.length>0&&filter&&(
                        <div  className={"absolute left-0 z-20 bg-white"}
                        style={{width:`${expand?35:50}vw`}}>
                            <ul>
                                {filtered.map((entry, i) => (
                                    <li id={"ignore"} key={i} className={"hover:bg-gray-300"} onClick={()=>window.location.href=`/view/${entry.eid}`} >{entry.name}</li>
                                ))}
                            </ul>
                        </div>
                    )
                    }
                </label>
                <button onClick={() => handleUser()}
                        className={" underline text-blue-800 "}>{loading ? "Loading" : data.name}<FontAwesomeIcon
                    className={""} icon={faCaretDown}/></button>
            </div>
        </nav>

        </>
    );
}