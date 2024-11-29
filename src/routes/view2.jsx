import "./textarea.css"
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import ReactQuill, {Quill} from "react-quill";
import Editor from "../components/Editor.jsx";
import axios from "../axios.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDoubleLeft, faChevronLeft, faChevronRight, faSpinner} from "@fortawesome/free-solid-svg-icons";

const top=7;

const left=1;
const width=50;
const fsize=20;

const t=100-top;
const side=(100-width)/2;

const size=30;


export default function View2(){
    const [fontSize, setFontSize] = useState(size);
    const [entries, setEntries] = useState([]);
    const [cname, setCname] = useState("");
    const [loading,setLoading] = useState(true);
    const [eid, setEid] = useState(useParams().id);
    const [saving,setSaving] = useState(false);
    const [val, setVal] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const save = async (url, payload) => {
        setSaving(true)
        try {
            await axios.post('http://localhost:3000/save',
                {content :{val:val, eid:eid}});
            setSaving(false);
        } catch (error) {
            console.error('Error posting data:', error);
            throw error; // Rethrow or handle the error
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://localhost:3000/protected',
                    {params :{target:'view', eid:eid}});
                const sorted = response.data.data.entries
                    .sort((a, b) => new Date(a.datecreated) - new Date(b.datecreated));
                setEntries(sorted);
                setCname(response.data.data.name);
                setLoading(false);
            } catch(error){
                console.log(error);
            }
        };
        fetchData();
    }, [eid])
    if (loading){
        return <div>Loading...</div>;
    }
    return (
        <div className={"overflow-y-hidden"}>
            <Navigate saving={saving} save={save} loading={loading} cname={cname} entries={entries} eid={eid} setEid={setEid} fontSize={fontSize} setFontSize={setFontSize}></Navigate>
            <Background></Background>
            <SelectedPage setCount={setWordCount} saving={saving} val={val} setVal={setVal} fontSize={fontSize} setFontSize={setFontSize} entries={entries} eid={eid} loading={loading}></SelectedPage>
            <Footer count={wordCount} cname={cname}></Footer>
        </div>
    );
}

function Navigate({loading, list, eid, setEid, entries, cname, save, saving}){
    const navigate=useNavigate();
    const back=()=>{
        navigate("/home");
    };
    function prev(){
        const index=entries.findIndex(e=>e.eid===parseInt(eid));
        window.location.href=`/view/${entries[index-1].eid}`;
    }
    function next(){
        const index=entries.findIndex(e=>e.eid===parseInt(eid));
        window.location.href=`/view/${entries[index+1].eid}`;
    }
    return(


        <div className={`fixed z-40 top-0 left-0 w-screen flex justify-between items-center bg-blue-400`}
             style={{height: `${top}vh`}}>
            <button onClick={back} className={"left-0 pl-2"}><FontAwesomeIcon icon={faAngleDoubleLeft}/> Back home</button>
            <div>
                <button title={"Previous entry"} className={"rounded-2xl border-black w-[30px] h-[30px]"} onClick={prev}><FontAwesomeIcon icon={faChevronLeft}/></button>
                <select className={"w-[120px] h-[30px] m-2"} name="select" value={eid}
                        onChange={(e)=>{
                            setEid(parseInt(e.target.value))
                            window.location.href=`/view/${parseInt(e.target.value)}`
                        }
                }>
                    {(
                        entries.map((n) => (
                            <option key={n.eid} value={n.eid}>
                                {n.name}
                            </option>
                        ))
                    )}
                </select>
                <button title={"Next entry"} className={"rounded-2xl border-black w-[30px] h-[30px]"} onClick={next}><FontAwesomeIcon icon={faChevronRight}/></button>
            </div>
            <button className={"right-0 mr-10"} disabled={saving} onClick={save}>{saving?<FontAwesomeIcon icon={faSpinner} spin/>:"Save"}</button>
        </div>
    )
}

function Background() {
    let background = "../../src/assets/background-1.avif";
    return (
        <div style={{backgroundImage: `url(${background})`, backgroundSize:"auto", backgroundRepeat:"repeat"}}
        className={"absolute w-full h-full top-0 left-0 z-0"}></div>
    )
}

function SelectedPage({fontSize, setFontSize, eid, entries, loading, val, setVal, saving, setCount}){
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline','strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ],
    }

    const formats = [
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
        ];
    return(
        <div className={""}>
            <Editor setCount={setCount} saving={saving} val={val} setVal={setVal} fontSize={fontSize} setFontSize={setFontSize} entries={entries} loading={loading} eid={eid}/>
        </div>
    );
}

function Footer({cname, count}){
    return (
        <div className={"absolute bottom-0 w-screen bg-gray-300 h-[5vh] flex items-center justify-between"}>
            <h1 className={"ml-[3vw]"}>Current category: {cname}</h1>
            <h1 className={"mr-[3vw]"}>Words: {count}</h1>
        </div>);
}